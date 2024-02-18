import { ResponseStatus } from '@/types/main';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserByEmail, updateUser } from '../../services/user.service';
import { deleteVerificationToken, fetchVerificationToken } from '@/services/auth.service';
import moment from 'moment-timezone';

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

// POST /reset-password : attempt to reset account password with token
const handlePost = async (req: NextApiRequest, res: NextApiResponse<{}>) => {
  console.log('POST => /reset-password');
  const { password, token } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Missing password' });
  } else if (!token) {
    return res.status(400).json({ error: 'Missing token' });
  }
  // find verification token
  const verificationToken = await fetchVerificationToken(token);
  if (verificationToken === ResponseStatus.NotFound) {
    return res.status(404).json({ error: 'Could not find verification token.' });
  }
  const now = moment();
  if (moment(verificationToken.expires) <= now) {
    return res.status(404).json({ error: 'Token expired.' });
  }
  // find user with email
  const user = await getUserByEmail(verificationToken.identifier);
  if (user === ResponseStatus.NotFound) {
    return res.status(404).json({ error: 'No user found with email.' });
  }
  // reset password
  const result = await updateUser(user.id, { password });
  if (result === ResponseStatus.NotFound) {
    res.status(500).json({ error: 'Unknown error.' });
  } else {
    // delete token once transaction complete
    const result = await deleteVerificationToken(token);
    if (result === ResponseStatus.Success) {
      res.status(200).json({ success: true });
    } else {
      res.status(500).json({ error: 'Unknown error.' });
    }
  }
};

export default handler;
