// ============================================
// STATISTICS SERVICE
// ============================================
// Extracts statistics computation from the admin route into a
// dedicated module with a short TTL cache (60 seconds) so repeated
// dashboard loads don't re-read every record from the store.

const path = require('path');
const { dataFolder } = require('./folders');
const { readData, readJsonFiles } = require('./helpers');
const { readPageViews } = require('./page-views-store');
const { resolvePageName } = require('./page-name-map');
const logger = require('./logger');

// ============================================
// CACHE
// ============================================

const CACHE_TTL_MS = 60 * 1000; // 60 seconds

// Membership fee schedule (RON) — single source of truth
const MEMBERSHIP_PRICES = { student: 50, individual: 100, family: 200 };

let _cache = null;
let _cacheTimestamp = 0;

function isCacheValid() {
  return _cache && (Date.now() - _cacheTimestamp) < CACHE_TTL_MS;
}

function setCache(data) {
  _cache = data;
  _cacheTimestamp = Date.now();
}

// ============================================
// DATA LOADING
// ============================================

/**
 * Load all form data collections.
 * Uses Firebase Realtime DB via readData() with file fallback.
 * @returns {Promise<Object>} All collections
 */
async function loadAllData() {
  const contactsFolder = path.join(dataFolder, 'contacts');
  const volunteersFolder = path.join(dataFolder, 'volunteers');
  const membersFolder = path.join(dataFolder, 'members');
  const partnershipsFolder = path.join(dataFolder, 'partnerships');
  const donationsFolder = path.join(dataFolder, 'donations');

  const [contacts, volunteers, members, partnerships, donations] = await Promise.all([
    readData('forms/contacts', contactsFolder),
    readData('forms/volunteers', volunteersFolder),
    readData('forms/members', membersFolder),
    readData('forms/partnerships', partnershipsFolder),
    readData('forms/donations', donationsFolder),
  ]);

  return { contacts, volunteers, members, partnerships, donations };
}

// ============================================
// COMPUTATION
// ============================================

/**
 * Compute full admin statistics.
 * @returns {Promise<Object>} Statistics object
 */
async function computeStatistics() {
  // Return cached result if still valid
  if (isCacheValid()) {
    logger.debug('Statistics served from cache');
    return _cache;
  }

  logger.debug('Computing statistics (cache miss)...');

  const { contacts, volunteers, members, partnerships, donations } = await loadAllData();

  // Calculate total donations
  const totalDonations = donations.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);
  const recurringDonations = donations.filter(d => d.isRecurring).length;
  const oneTimeDonations = donations.filter(d => !d.isRecurring).length;

  // Calculate donations by payment method
  const cardDonations = donations.filter(d => d.paymentMethod === 'card').length;
  const bankDonations = donations.filter(d => d.paymentMethod === 'bank').length;

  // Calculate members by type
  const studentMembers = members.filter(m => m.membershipType === 'student').length;
  const individualMembers = members.filter(m => m.membershipType === 'individual').length;
  const familyMembers = members.filter(m => m.membershipType === 'family').length;

  // Calculate partnerships by type
  const corporatePartnerships = partnerships.filter(p => p.partnershipType === 'corporate').length;
  const ngoPartnerships = partnerships.filter(p => p.partnershipType === 'ngo').length;
  const institutionPartnerships = partnerships.filter(p => p.partnershipType === 'institution').length;
  const mediaPartnerships = partnerships.filter(p => p.partnershipType === 'media').length;

  // Get data for last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentContacts = contacts.filter(c => new Date(c.timestamp) >= thirtyDaysAgo).length;
  const recentVolunteers = volunteers.filter(v => new Date(v.timestamp) >= thirtyDaysAgo).length;
  const recentMembers = members.filter(m => new Date(m.timestamp) >= thirtyDaysAgo).length;
  const recentPartnerships = partnerships.filter(p => new Date(p.timestamp) >= thirtyDaysAgo).length;
  const recentDonations = donations.filter(d => new Date(d.timestamp) >= thirtyDaysAgo).length;

  // Calculate monthly trends (last 12 months)
  const monthlyData = [];
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const monthName = monthStart.toLocaleDateString('ro-RO', { month: 'short', year: 'numeric' });

    const monthContacts = contacts.filter(c => {
      const d = new Date(c.timestamp);
      return d >= monthStart && d <= monthEnd;
    }).length;

    const monthVolunteers = volunteers.filter(v => {
      const d = new Date(v.timestamp);
      return d >= monthStart && d <= monthEnd;
    }).length;

    const monthMembers = members.filter(m => {
      const d = new Date(m.timestamp);
      return d >= monthStart && d <= monthEnd;
    }).length;

    const monthDonations = donations.filter(d => {
      const dt = new Date(d.timestamp);
      return dt >= monthStart && dt <= monthEnd;
    }).reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

    const monthMemberships = members.filter(m => {
      const d = new Date(m.timestamp);
      return d >= monthStart && d <= monthEnd;
    }).reduce((sum, m) => {
      return sum + (MEMBERSHIP_PRICES[m.membershipType] || 0);
    }, 0);

    const monthPartnerships = partnerships.filter(p => {
      const d = new Date(p.timestamp);
      return d >= monthStart && d <= monthEnd;
    }).length;

    monthlyData.push({
      month: monthName,
      contacts: monthContacts,
      volunteers: monthVolunteers,
      members: monthMembers,
      donations: monthDonations,
      memberships: monthMemberships,
      partnerships: monthPartnerships,
    });
  }

  // Calculate historical totals (before last 12 months)
  const historicalContacts = contacts.filter(c => new Date(c.timestamp) < oneYearAgo).length;
  const historicalVolunteers = volunteers.filter(v => new Date(v.timestamp) < oneYearAgo).length;
  const historicalMembers = members.filter(m => new Date(m.timestamp) < oneYearAgo).length;
  const historicalDonations = donations.filter(d => new Date(d.timestamp) < oneYearAgo)
    .reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);
  const historicalMemberships = members.filter(m => new Date(m.timestamp) < oneYearAgo)
    .reduce((sum, m) => {
      return sum + (MEMBERSHIP_PRICES[m.membershipType] || 0);
    }, 0);
  const historicalPartnerships = partnerships.filter(p => new Date(p.timestamp) < oneYearAgo).length;

  // Calculate volunteer interests distribution
  const interestsMap = {};
  volunteers.forEach(v => {
    if (v.interests && Array.isArray(v.interests)) {
      v.interests.forEach(interest => {
        interestsMap[interest] = (interestsMap[interest] || 0) + 1;
      });
    }
  });

  const topInterests = Object.entries(interestsMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  // Get page view statistics
  let pageViewStats = {
    totalViews: 0,
    uniquePaths: 0,
    topPages: [],
  };

  try {
    const pageViews = await readPageViews();

    pageViewStats.totalViews = pageViews.length;

    const pathCounts = {};
    pageViews.forEach(view => {
      pathCounts[view.path] = (pathCounts[view.path] || 0) + 1;
    });

    pageViewStats.uniquePaths = Object.keys(pathCounts).length;

    pageViewStats.topPages = Object.entries(pathCounts)
      .map(([pagePath, count]) => {
        const recentView = pageViews.find(v => v.path === pagePath);
        return {
          path: pagePath,
          title: resolvePageName(pagePath, recentView?.title),
          views: count,
        };
      })
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
  } catch (error) {
    logger.error('Error reading page view stats:', error);
  }

  const statistics = {
    overview: {
      totalContacts: contacts.length,
      totalVolunteers: volunteers.length,
      totalMembers: members.length,
      totalPartnerships: partnerships.length,
      totalDonations: donations.length,
      totalDonationAmount: totalDonations,
      recentActivity: {
        contacts: recentContacts,
        volunteers: recentVolunteers,
        members: recentMembers,
        partnerships: recentPartnerships,
        donations: recentDonations,
      },
    },
    donations: {
      total: totalDonations,
      count: donations.length,
      recurring: recurringDonations,
      oneTime: oneTimeDonations,
      byMethod: {
        card: cardDonations,
        bank: bankDonations,
      },
      average: donations.length > 0 ? totalDonations / donations.length : 0,
    },
    members: {
      total: members.length,
      byType: {
        student: studentMembers,
        individual: individualMembers,
        family: familyMembers,
      },
    },
    partnerships: {
      total: partnerships.length,
      byType: {
        corporate: corporatePartnerships,
        ngo: ngoPartnerships,
        institution: institutionPartnerships,
        media: mediaPartnerships,
      },
    },
    volunteers: {
      total: volunteers.length,
      topInterests: topInterests,
    },
    pageViews: pageViewStats,
    trends: {
      monthly: monthlyData,
      historical: {
        contacts: historicalContacts,
        volunteers: historicalVolunteers,
        members: historicalMembers,
        donations: historicalDonations,
        memberships: historicalMemberships,
        partnerships: historicalPartnerships,
      },
    },
  };

  setCache(statistics);
  logger.debug('Statistics computed and cached');

  return statistics;
}

module.exports = {
  computeStatistics,
  loadAllData,
};
