// ============================================
// DONATION FORM HANDLER
// ============================================

const path = require('path');
const config = require('../../config');
const transporter = require('../../config/nodemailer');
const { dataFolder } = require('../../utils/folders');
const { saveData, isValidEmail } = require('../../utils/helpers');
const { renderEmail } = require('../../utils/email-renderer');
const logger = require('../../utils/logger');

async function handleDonationForm(req, res) {
  try {
    const { amount, isRecurring, paymentMethod, name, email, phone, message } = req.body;

    if (!amount || !paymentMethod || !name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Te rugăm să completezi toate câmpurile obligatorii.'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Te rugăm să introduci o adresă de email validă.'
      });
    }

    const donationData = {
      amount,
      isRecurring,
      paymentMethod,
      name,
      email,
      phone: phone || '',
      message: message || '',
      timestamp: new Date().toISOString(),
      status: paymentMethod === 'card' ? 'pending' : 'awaiting_transfer'
    };

    const donationsFolder = path.join(dataFolder, 'donations');
    await saveData('forms/donations', donationsFolder, 'donation', donationData);

    // Send emails if SMTP is configured
    if (config.isEmailConfigured()) {
      try {
        const templateData = { amount, isRecurring, paymentMethod, name, email, phone, message };

        // Email to admin
        const adminMailOptions = {
          from: config.email.fromEmail,
          to: config.email.adminEmail,
          subject: `[Donație ${paymentMethod === 'card' ? 'Card' : 'Transfer'}] ${amount} RON - ${name}`,
          html: renderEmail('donation-admin', templateData)
        };

        await transporter.sendMail(adminMailOptions);

        // Email to donor
        const donorMailOptions = {
          from: config.email.fromEmail,
          to: email,
          subject: 'Mulțumim pentru donația ta! - Asociația Green Space',
          html: renderEmail('donation-user', templateData)
        };

        await transporter.sendMail(donorMailOptions);
        logger.info(`✅ Donation emails sent for: ${email}`);
      } catch (emailError) {
        logger.error('❌ Error sending donation emails:', emailError);
      }
    } else {
      logger.info('💾 Donation saved to file (SMTP not configured)');
    }

    res.json({
      success: true,
      message: paymentMethod === 'card' 
        ? 'Donația ta a fost înregistrată cu succes! Verifică-ți emailul pentru detalii.'
        : 'Cererea ta a fost înregistrată! Verifică-ți emailul pentru detaliile transferului bancar.'
    });

  } catch (error) {
    logger.error('Error processing donation:', error);
    res.status(500).json({
      success: false,
      error: 'A apărut o eroare la procesarea donației. Te rugăm să încerci din nou.'
    });
  }
}

module.exports = handleDonationForm;
