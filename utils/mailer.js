// utils/mailer.js
import SibApiV3Sdk from 'sib-api-v3-sdk';
import 'dotenv/config';

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

/**
 * Envoie un mail à un jury avec son code
 */
export async function sendMail({ toEmail, toName, code }) {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.sender = {
    name: process.env.BREVO_FROM_NAME,
    email: process.env.BREVO_FROM_EMAIL,
  };

  sendSmtpEmail.to = [{ email: toEmail, name: toName }];
  sendSmtpEmail.subject = 'Votre code pour accéder à MarsAI';
  sendSmtpEmail.htmlContent = `
    <h3>Bonjour ${toName},</h3>
    <p>Voici votre code pour accéder au jury : <b>${code}</b></p>
    <p>Merci de ne pas partager ce code.</p>
  `;

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Mail envoyé avec succès :', data);
    return data;
  } catch (error) {
    console.error('Erreur envoi email :', error);
    throw new Error('Erreur envoi email');
  }
}
