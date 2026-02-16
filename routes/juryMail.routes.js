import express from 'express';
import { sendMail } from '../utils/mailer.js';

const router = express.Router();

router.post('/send-mail', async (req, res) => {
  const { email, firstname, lastname, code } = req.body;

  try {
    await sendMail({
      toEmail: email,
      toName: `${firstname} ${lastname}`,
      code,
    });
    res.json({ message: 'Mail envoyé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur envoi email' });
  }
});

export default router;
