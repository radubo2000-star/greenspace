// ============================================
// PARTNERSHIP FORM HANDLER
// ============================================

const path = require('path');
const config = require('../../config');
const transporter = require('../../config/nodemailer');
const { dataFolder } = require('../../utils/folders');
const { saveData, isValidEmail } = require('../../utils/helpers');
const { renderEmail } = require('../../utils/email-renderer');
const logger = require('../../utils/logger');

const partnershipTypeNames = {
  corporate: 'Companie',
  ngo: 'ONG',
  institution: 'Instituție',
  media: 'Media'
};

async function handlePartnershipForm(req, res) {
  try {
    const { partnershipType, companyName, contactPerson, position, email, phone, website, industry, employees, interests, budget, description, goals } = req.body;

    if (!partnershipType || !companyName || !contactPerson || !position || !email || !phone || !interests || !description || !goals) {
      return res.status(400).json({
        success: false,
        error: 'Toate câmpurile obligatorii trebuie completate'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Adresa de email nu este validă'
      });
    }

    const partnershipData = {
      timestamp: new Date().toISOString(),
      partnershipType,
      companyName,
      contactPerson,
      position,
      email,
      phone,
      website,
      industry,
      employees,
      interests,
      budget,
      description,
      goals
    };

    // Always persist the submission
    const partnershipsFolder = path.join(dataFolder, 'partnerships');
    await saveData('forms/partnerships', partnershipsFolder, 'partnership', partnershipData);

    if (!config.isEmailConfigured()) {
      logger.info('🤝 Partnership proposal (Email not configured):', { companyName, email, partnershipType });

      return res.json({
        success: true,
        message: 'Propunerea ta a fost înregistrată cu succes! Te vom contacta în curând.'
      });
    }

    const templateData = {
      partnershipType,
      partnershipTypeName: partnershipTypeNames[partnershipType],
      companyName,
      contactPerson,
      position,
      email,
      phone,
      website,
      industry,
      employees,
      interests,
      budget,
      description,
      goals
    };

    // Email to admin
    const adminMailOptions = {
      from: config.email.fromEmail,
      to: config.email.adminEmail,
      subject: `[Parteneriat ${partnershipTypeNames[partnershipType]}] Propunere nouă - ${companyName}`,
      html: renderEmail('partnership-admin', templateData)
    };

    // Confirmation email to partner
    const partnerMailOptions = {
      from: config.email.fromEmail,
      to: email,
      subject: 'Mulțumim pentru propunerea de parteneriat - Asociația Green Space',
      html: renderEmail('partnership-user', templateData)
    };

    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(partnerMailOptions);

    logger.info('✅ Partnership proposal emails sent:', { companyName, email, partnershipType });

    res.json({
      success: true,
      message: 'Propunerea ta a fost trimisă cu succes! Verifică-ți emailul pentru confirmare.'
    });

  } catch (error) {
    logger.error('❌ Partnership proposal error:', error);
    res.status(500).json({
      success: false,
      error: 'A apărut o eroare la trimiterea propunerii. Te rugăm să încerci din nou.'
    });
  }
}

module.exports = handlePartnershipForm;
