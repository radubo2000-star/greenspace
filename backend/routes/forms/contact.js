// ============================================
// CONTACT FORM HANDLER
// ============================================

const path = require('path');
const config = require('../../config');
const transporter = require('../../config/nodemailer');
const { dataFolder } = require('../../utils/folders');
const { saveData, isValidEmail } = require('../../utils/helpers');
const { renderEmail } = require('../../utils/email-renderer');
const logger = require('../../utils/logger');

async function handleContactForm(req, res) {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'Toate câmpurile sunt obligatorii'
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Adresa de email nu este validă'
      });
    }

    const contactData = {
      timestamp: new Date().toISOString(),
      name,
      email,
      subject,
      message
    };

    // Always persist the submission
    const contactsFolder = path.join(dataFolder, 'contacts');
    await saveData('forms/contacts', contactsFolder, 'contact', contactData);

    // Send emails if SMTP is configured
    if (!config.isEmailConfigured()) {
      logger.info('📧 Contact form submission (Email not configured):', { name, email, subject });

      return res.json({
        success: true,
        message: 'Mesajul tău a fost înregistrat cu succes! Te vom contacta în curând.'
      });
    }

    const templateData = { name, email, subject, message };

    // Email to admin
    const adminMailOptions = {
      from: config.email.fromEmail,
      to: config.email.adminEmail,
      subject: `[Contact Form] ${subject}`,
      html: renderEmail('contact-admin', templateData)
    };

    // Confirmation email to user
    const userMailOptions = {
      from: config.email.fromEmail,
      to: email,
      subject: 'Confirmăm primirea mesajului tău - Asociația Green Space',
      html: renderEmail('contact-user', templateData)
    };

    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    logger.info('✅ Contact form emails sent successfully:', { name, email, subject });

    res.json({
      success: true,
      message: 'Mesajul tău a fost trimis cu succes! Verifică-ți emailul pentru confirmare.'
    });

  } catch (error) {
    logger.error('❌ Contact form error:', error);
    res.status(500).json({
      success: false,
      error: 'A apărut o eroare la trimiterea mesajului. Te rugăm să încerci din nou.'
    });
  }
}

module.exports = handleContactForm;
