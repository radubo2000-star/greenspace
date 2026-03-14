// ============================================
// VOLUNTEER FORM HANDLER
// ============================================

const path = require('path');
const config = require('../../config');
const transporter = require('../../config/nodemailer');
const { dataFolder } = require('../../utils/folders');
const { saveData, isValidEmail } = require('../../utils/helpers');
const { renderEmail } = require('../../utils/email-renderer');
const logger = require('../../utils/logger');

async function handleVolunteerForm(req, res) {
  try {
    const { name, email, phone, age, city, interests, availability, experience, motivation } = req.body;

    if (!name || !email || !phone || !age || !city || !interests || !availability || !motivation) {
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

    const volunteerData = {
      timestamp: new Date().toISOString(),
      name,
      email,
      phone,
      age,
      city,
      interests,
      availability,
      experience,
      motivation
    };

    // Always persist the submission
    const volunteersFolder = path.join(dataFolder, 'volunteers');
    await saveData('forms/volunteers', volunteersFolder, 'volunteer', volunteerData);

    if (!config.isEmailConfigured()) {
      logger.info('🙋 Volunteer application (Email not configured):', { name, email });

      return res.json({
        success: true,
        message: 'Aplicația ta a fost înregistrată cu succes! Te vom contacta în curând.'
      });
    }

    const templateData = { name, email, phone, age, city, interests, availability, experience, motivation };

    // Email to admin
    const adminMailOptions = {
      from: config.email.fromEmail,
      to: config.email.adminEmail,
      subject: `[Voluntariat] Aplicație nouă - ${name}`,
      html: renderEmail('volunteer-admin', templateData)
    };

    // Confirmation email to volunteer
    const volunteerMailOptions = {
      from: config.email.fromEmail,
      to: email,
      subject: 'Bine ai venit în echipa de voluntari - Asociația Green Space',
      html: renderEmail('volunteer-user', templateData)
    };

    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(volunteerMailOptions);

    logger.info('✅ Volunteer application emails sent:', { name, email });

    res.json({
      success: true,
      message: 'Aplicația ta a fost trimisă cu succes! Verifică-ți emailul pentru confirmare.'
    });

  } catch (error) {
    logger.error('❌ Volunteer application error:', error);
    res.status(500).json({
      success: false,
      error: 'A apărut o eroare la trimiterea aplicației. Te rugăm să încerci din nou.'
    });
  }
}

module.exports = handleVolunteerForm;
