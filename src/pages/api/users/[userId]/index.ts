import { ResponseStatus } from '@/types/main';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserById, updateUser } from '@/services/user.service';
import { Prisma } from '@prisma/client';

const handler = (req: NextApiRequest, res: NextApiResponse<{}>) => {
  switch (req.method) {
    case 'GET':
      handleGet(req, res);
      break;
    case 'PUT':
      handlePut(req, res);
      break;
    default:
      res.status(503).json({ error: 'Invalid request method.' });
      break;
  }
};

// GET /users/:userId : get a single user
const handleGet = (req: NextApiRequest, res: NextApiResponse<{}>) => {
  const userId = parseInt(req.query.userId?.toString() || '');
  if (isNaN(userId)) {
    res.status(400).json({ error: 'Missing user id' });
    return;
  }
  console.log(`GET => /users/{${userId}}`);
  getUserById(userId).then((user) => {
    if (user === ResponseStatus.NotFound) {
      res.status(404).json({ error: 'User not found.' });
    } else {
      res.status(200).json({ user });
    }
  });
};

// PUT /users/:userId : update a single user
const handlePut = (req: NextApiRequest, res: NextApiResponse<{}>) => {
  const userId = parseInt(req.query.userId?.toString() || '');
  if (isNaN(userId)) {
    res.status(400).json({ error: 'Missing user id' });
    return;
  }
  console.log(`PUT => /users/{${userId}}`);
  const userData = req.body as Prisma.UserUpdateInput;
  updateUser(userId, userData).then((user) => {
    if (user === ResponseStatus.NotFound) {
      res.status(404).json({ error: 'User not found.' });
    } else {
      res.status(200).json({ user });
    }
  });
};

export default handler;
