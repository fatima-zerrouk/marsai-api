// utils/mailer.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Envoie un email au jury avec son code
 */
export async function sendMail({ toEmail, toName, code }) {
  if (!toEmail) throw new Error('Aucun destinataire défini');

  const mailOptions = {
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'Votre code pour accéder à MarsAI',
    html: `
      <h3>Bonjour ${toName},</h3>
      <p>Voici votre code pour accéder au jury : <b>${code}</b></p>
      <p>Merci de ne pas partager ce code.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    // Vérifier si Gmail a vraiment accepté l'adresse
    if (info.accepted.includes(toEmail)) {
      return { success: true, message: 'Mail accepté par le serveur' };
    } else {
      return { success: false, message: 'Mail non accepté par le serveur' };
    }
  } catch (error) {
    console.error('Erreur envoi email :', error);
    return { success: false, message: 'Erreur lors de l’envoi du mail' };
  }
}
