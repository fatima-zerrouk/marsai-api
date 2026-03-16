import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Création du transporteur SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail', // ou autre selon ton SMTP
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Envoi d’un mail avec le code d’accès
 * @param {string} toEmail - Email du destinataire
 * @param {string} toName - Nom du destinataire
 * @param {string} code - Code généré et stocké en DB
 */
export async function sendMail({ toEmail, toName, code }) {
  if (!toEmail || !code) {
    throw new Error('Aucun destinataire ou code défini');
  }

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
    console.log(`🔹 Envoi mail à ${toEmail} avec code ${code}`);
    const info = await transporter.sendMail(mailOptions);
    const success = info.accepted.includes(toEmail);
    console.log(`🔹 Mail envoyé: ${success}`);
    return success
      ? { success: true, code }
      : { success: false, message: 'Mail non accepté par le serveur' };
  } catch (error) {
    console.error('❌ Erreur envoi email :', error);
    return { success: false, message: 'Erreur lors de l’envoi du mail' };
  }
}

/**
 * Envoi d’un mail de statut film (approuvé/refusé/non conforme)
 */
export async function sendMovieStatusMail({
  toEmail,
  toName,
  status,
  movieTitle,
}) {
  if (!toEmail) throw new Error('Aucun destinataire défini');

  let subject = '';
  let message = '';

  switch (status) {
    case 'approved':
      subject = `Votre film "${movieTitle}" a été accepté !`;
      message = `Nous avons le plaisir de vous informer que votre film <strong>${movieTitle}</strong> a été accepté et publié dans la galerie.`;
      break;
    case 'rejected':
      subject = `Votre film "${movieTitle}" a été refusé`;
      message = `Nous sommes désolés de vous informer que votre film <strong>${movieTitle}</strong> n'a pas été retenu.`;
      break;
    case 'isconform':
      subject = `Votre film "${movieTitle}" est non conforme`;
      message = `Votre film <strong>${movieTitle}</strong> a été jugé non conforme aux règles du concours.`;
      break;
    default:
      throw new Error('Statut inconnu');
  }

  const mailOptions = {
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject,
    html: `
      <div style="font-family: Arial; padding: 30px;">
        <h2>Bonjour ${toName},</h2>
        <p>${message}</p>
        <p>Merci pour votre participation à MarsAI</p>
      </div>
    `,
  };

  try {
    console.log(`🔹 Envoi mail statut film à ${toEmail} pour "${movieTitle}"`);
    const info = await transporter.sendMail(mailOptions);
    const success = info.accepted.includes(toEmail);
    console.log(`🔹 Mail envoyé: ${success}`);
    return success ? { success: true } : { success: false };
  } catch (error) {
    console.error('❌ Erreur envoi email statut film :', error);
    return { success: false };
  }
}
