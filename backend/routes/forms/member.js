// ============================================
// MEMBER FORM HANDLER
// ============================================

const path = require('path');
const config = require('../../config');
const transporter = require('../../config/nodemailer');
const { dataFolder } = require('../../utils/folders');
const { saveData, isValidEmail } = require('../../utils/helpers');
const { renderEmail } = require('../../utils/email-renderer');
const logger = require('../../utils/logger');

const membershipPrices = {
  student: '50',
  individual: '100',
  family: '200'
};

const membershipNames = {
  student: 'Student',
  individual: 'Individual',
  family: 'Familie'
};

async function handleMemberForm(req, res) {
  try {
    const { membershipType, name, email, phone, address, city, cnp, occupation, motivation, agreeTerms } = req.body;

    if (!membershipType || !name || !email || !phone || !address || !city || !cnp || !motivation || !agreeTerms) {
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

    const memberData = {
      timestamp: new Date().toISOString(),
      membershipType,
      name,
      email,
      phone,
      address,
      city,
      cnp,
      occupation,
      motivation
    };

    // Always persist the submission
    const membersFolder = path.join(dataFolder, 'members');
    await saveData('forms/members', membersFolder, 'member', memberData);

    if (!config.isEmailConfigured()) {
      logger.info('👤 Member application (Email not configured):', { name, email, membershipType });

      return res.json({
        success: true,
        message: 'Cererea ta a fost înregistrată cu succes! Te vom contacta în curând.'
      });
    }

    const templateData = {
      membershipType,
      membershipName: membershipNames[membershipType],
      membershipPrice: membershipPrices[membershipType],
      name,
      email,
      phone,
      address,
      city,
      cnp,
      occupation,
      motivation
    };

    // Email to admin
    const adminMailOptions = {
      from: config.email.fromEmail,
      to: config.email.adminEmail,
      subject: `[Membru ${membershipNames[membershipType]}] Cerere nouă - ${name}`,
      html: renderEmail('member-admin', templateData)
    };

    // Confirmation email to member
    const memberMailOptions = {
      from: config.email.fromEmail,
      to: email,
      subject: 'Bine ai venit în familia Green Space - Asociația Green Space',
      html: renderEmail('member-user', templateData)
    };

    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(memberMailOptions);

    logger.info('✅ Member application emails sent:', { name, email, membershipType });

    res.json({
      success: true,
      message: 'Cererea ta a fost trimisă cu succes! Verifică-ți emailul pentru detalii despre plată.'
    });

  } catch (error) {
    logger.error('❌ Member application error:', error);
    res.status(500).json({
      success: false,
      error: 'A apărut o eroare la trimiterea cererii. Te rugăm să încerci din nou.'
    });
  }
}

module.exports = handleMemberForm;
