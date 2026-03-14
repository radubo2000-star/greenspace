// ============================================
// ANALYTICS ROUTES
// ============================================
// Page view tracking using a single JSON file store
// instead of one file per view (much better for filesystem performance).

const express = require('express');
const router = express.Router();
const { readPageViews, appendPageView, clearPageViews, migrateOldPageViews } = require('../utils/page-views-store');
const adminAuth = require('../middleware/adminAuth');
const { resolvePageName } = require('../utils/page-name-map');
const logger = require('../utils/logger');

// Migrate any old per-file page views on startup
migrateOldPageViews();

/**
 * Track page view
 */
router.post('/page-view', async (req, res) => {
  try {
    const { path: pagePath, title, timestamp, referrer, userAgent } = req.body;

    if (!pagePath) {
      return res.status(400).json({
        success: false,
        error: 'Path is required'
      });
    }

    // Guard against excessively large payloads that could bloat the store
    const MAX_FIELD = 2048;
    if (
      (typeof pagePath === 'string' && pagePath.length > MAX_FIELD) ||
      (typeof title === 'string' && title.length > MAX_FIELD) ||
      (typeof referrer === 'string' && referrer.length > MAX_FIELD) ||
      (typeof userAgent === 'string' && userAgent.length > MAX_FIELD)
    ) {
      return res.status(400).json({
        success: false,
        error: 'One or more fields exceed the maximum allowed length'
      });
    }

    const pageViewData = {
      path: String(pagePath).slice(0, MAX_FIELD),
      title: title ? String(title).slice(0, MAX_FIELD) : pagePath,
      timestamp: timestamp || new Date().toISOString(),
      referrer: referrer ? String(referrer).slice(0, MAX_FIELD) : null,
      userAgent: userAgent ? String(userAgent).slice(0, MAX_FIELD) : null
    };

    await appendPageView(pageViewData);

    res.json({
      success: true,
      message: 'Page view tracked'
    });
  } catch (error) {
    logger.error('Error tracking page view:', error);
    res.status(200).json({
      success: false,
      error: 'Failed to track page view',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * Get page view statistics
 */
router.get('/page-views', async (req, res) => {
  try {
    const pageViews = (await readPageViews())
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const totalViews = pageViews.length;

    if (totalViews === 0) {
      return res.json({
        success: true,
        statistics: {
          totalViews: 0,
          uniquePaths: 0,
          topPages: [],
          recentViews: [],
          viewsByDay: [],
          viewsByHour: []
        }
      });
    }

    const pathCounts = {};
    pageViews.forEach(view => {
      pathCounts[view.path] = (pathCounts[view.path] || 0) + 1;
    });

    const uniquePaths = Object.keys(pathCounts).length;

    const topPages = Object.entries(pathCounts)
      .map(([pagePath, count]) => {
        const recentView = pageViews.find(v => v.path === pagePath);
        return {
          path: pagePath,
          title: resolvePageName(pagePath, recentView?.title),
          views: count,
          percentage: totalViews > 0 ? ((count / totalViews) * 100).toFixed(1) : 0
        };
      })
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    const recentViews = pageViews.slice(0, 20).map(view => ({
      path: view.path,
      title: resolvePageName(view.path, view.title),
      timestamp: view.timestamp,
      referrer: view.referrer
    }));

    // Calculate views by day (last 30 days)
    const viewsByDay = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayViews = pageViews.filter(view => {
        const viewDate = new Date(view.timestamp);
        return viewDate >= date && viewDate < nextDate;
      }).length;

      viewsByDay.push({
        date: date.toISOString().split('T')[0],
        views: dayViews
      });
    }

    // Calculate views by hour (last 24 hours)
    const viewsByHour = [];
    for (let i = 23; i >= 0; i--) {
      const date = new Date();
      date.setHours(date.getHours() - i, 0, 0, 0);
      
      const nextHour = new Date(date);
      nextHour.setHours(nextHour.getHours() + 1);

      const hourViews = pageViews.filter(view => {
        const viewDate = new Date(view.timestamp);
        return viewDate >= date && viewDate < nextHour;
      }).length;

      viewsByHour.push({
        hour: date.getHours(),
        time: date.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }),
        views: hourViews
      });
    }

    const statistics = {
      totalViews,
      uniquePaths,
      topPages,
      recentViews,
      viewsByDay,
      viewsByHour
    };

    res.json({
      success: true,
      statistics
    });
  } catch (error) {
    logger.error('Error getting page view statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get page view statistics'
    });
  }
});

/**
 * Reset (clear) all page view statistics
 * Protected by admin authentication
 */
router.delete('/page-views', adminAuth, async (req, res) => {
  try {
    await clearPageViews();
    logger.info('Page view statistics cleared by admin');

    res.json({
      success: true,
      message: 'All page view statistics have been cleared'
    });
  } catch (error) {
    logger.error('Error clearing page view statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear page view statistics'
    });
  }
});

module.exports = router;
