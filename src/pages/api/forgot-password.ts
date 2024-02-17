import { ResponseStatus } from '@/types/main';
import type { NextApiRequest, NextApiResponse } from 'next';

import { getUserByEmail } from '../../services/user.service';
import { createVerificationTokenForUser } from '@/services/auth.service';
import { sendPasswordResetEmail } from '@/services/mail.service';

const handler = async (req: NextApiRequest, res: NextApiResponse<{}>) => {
  switch (req.method) {
    case 'POST':
      await handlePost(req, res);
      break;
    default:
      res.status(503).json({ error: 'Invalid request method.' });
      break;
  }
};

// POST /forgot-password : request password-reset email
const handlePost = async (req: NextApiRequest, res: NextApiResponse<{}>) => {
  console.log('POST => /forgot-password');
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }
  // check if user exists
  const user = await getUserByEmail(email);
  if (user === ResponseStatus.NotFound || !user.email) {
    return res.status(404).json({ error: 'No user found with email.' });
  }
  // create and store token
  const token = await createVerificationTokenForUser(user.email);
  if (token === ResponseStatus.UnknownError) {
    return res.status(500).json({ error: 'Could not create verification token.' });
  }
  // send email
  const result = await sendPasswordResetEmail(user.email, token, user.name || user.username);
  if (result) {
    res.status(200).json({ success: true });
  } else {
    res.status(500).json({ error: 'Unknown error.' });
  }
};

export default handler;
