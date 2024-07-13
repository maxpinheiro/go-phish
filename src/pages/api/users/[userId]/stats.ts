import { getUserById } from '@/services/user.service';
import { ResponseStatus } from '@/types/main';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = (req: NextApiRequest, res: NextApiResponse<{}>) => {
  switch (req.method) {
    case 'GET':
      handleGet(req, res);
      break;
    default:
      res.status(503).json({ error: 'Invalid request method.' });
      break;
  }
};

// GET /users/:userId/stats : get stats for a single user
const handleGet = (req: NextApiRequest, res: NextApiResponse<{}>) => {
  const userId = parseInt(req.query.userId?.toString() || '');
  if (isNaN(userId)) {
    res.status(400).json({ error: 'Missing user id' });
    return;
  }
  console.log(`GET => /users/{${userId}}/stats`);
  getUserById(userId).then((user) => {
    if (user === ResponseStatus.NotFound) {
      res.status(404).json({ error: 'User not found.' });
    } else {
      res.status(200).json({ user });
    }
  });
};

export default handler;
