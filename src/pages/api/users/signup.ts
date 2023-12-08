import { ResponseStatus } from '@/types/main';
import type { NextApiRequest, NextApiResponse } from 'next';

import { attemptSignup } from '@/services/user.service';

const handler = (req: NextApiRequest, res: NextApiResponse<{}>) => {
  switch (req.method) {
    case 'POST':
      handlePost(req, res);
      break;
    default:
      res.status(503).json({ error: 'Invalid request method.' });
      break;
  }
};

// POST /users/signup : attempt signup with credentials
const handlePost = async (req: NextApiRequest, res: NextApiResponse<{}>) => {
  console.log('POST => /users/signup');
  const { username, password, email } = req.body;
  if (!username) {
    res.status(400).json({ error: 'Missing username' });
  } else if (!password) {
    res.status(400).json({ error: 'Missing password' });
  } else if (!email) {
    res.status(400).json({ error: 'Missing email' });
  } else {
    const result = await attemptSignup(username, password, email);
    if (result === 'name conflict') {
      // SignupResponse.NameConflict) {
      res.status(ResponseStatus.Conflict).json({ error: 'name conflict' });
      return;
    } else if (result === 'email conflict') {
      // SignupResponse.NameConflict) {
      res.status(ResponseStatus.Conflict).json({ error: 'email conflict' });
      return;
    }
    res.status(200).json({ user: result });
  }
};

export default handler;
