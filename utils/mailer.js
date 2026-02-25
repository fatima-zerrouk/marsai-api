import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMail({ toEmail, toName }) {
  if (!toEmail) throw new Error('Aucun destinataire défini');

  const code = crypto.randomInt(100000, 999999).toString();

  const mailOptions = {
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'Votre code d’accès sécurisé – MarsAI',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          <h2 style="color: #333; margin-bottom: 20px;">Bonjour ${toName},</h2>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Vous trouverez ci-dessous votre <strong>code d’accès sécurisé</strong> pour rejoindre l’espace Jury de MarsAI :
          </p>
          <div style="margin: 30px 0; text-align: center;">
            <span style="display: inline-block; padding: 15px 30px; font-size: 24px; letter-spacing: 4px; font-weight: bold; color: #ffffff; background-color: #6f707194; border-radius: 6px;">
              ${code}
            </span>
          </div>
          <p style="font-size: 14px; color: #555; line-height: 1.6;">
            Pour des raisons de sécurité, merci de ne pas partager ce code avec des tiers.
          </p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info.accepted.includes(toEmail)
      ? { success: true, code }
      : { success: false, message: 'Mail non accepté par le serveur' };
  } catch (error) {
    console.error('Erreur envoi email :', error);
    return { success: false, message: 'Erreur lors de l’envoi du mail' };
  }
}
