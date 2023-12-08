import { ResponseStatus } from '@/types/main';
import type { NextApiRequest, NextApiResponse } from 'next';

import { attemptLogin } from '../../services/user.service';

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

// POST /users/login : attempt login with credentials
const handlePost = (req: NextApiRequest, res: NextApiResponse<{}>) => {
  console.log('POST => /users/login');
  const { username, password } = req.body;
  if (!username) {
    res.status(400).json({ error: 'Missing username' });
  } else if (!password) {
    res.status(400).json({ error: 'Missing password' });
  } else {
    attemptLogin(username, password).then((result) => {
      if (result === ResponseStatus.NotFound) {
        res.status(404).json({ error: 'No user found with username/password.' });
        return;
      }

      res.status(200).json({ user: result });
    });
  }
};

export default handler;
