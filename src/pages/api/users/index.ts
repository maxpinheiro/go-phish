import { createUser, getAllUsers, getUserByEmail, getUsersByIds } from '@/services/user.service';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = (req: NextApiRequest, res: NextApiResponse<{}>) => {
  switch (req.method) {
    case 'GET':
      handleGet(req, res);
      break;
    case 'POST':
      handlePost(req, res);
      break;
    default:
      res.status(503).json({ error: 'Invalid request method.' });
      break;
  }
};

// GET /users : get all users
const handleGet = (req: NextApiRequest, res: NextApiResponse<{}>) => {
  const { userIds, email } = req.query;
  if (userIds) {
    const userIdList = userIds
      .toString()
      .split('_')
      .map((s) => parseInt(s) || 0);
    console.log(`GET => /users?userIds=${userIdList.join(',')}`);
    getUsersByIds(userIdList).then((users) => {
      if (users) {
        res.status(200).json({ users });
      } else {
        res.status(500);
      }
    });
  } else if (email) {
    console.log(`GET => /users?email=${email}`);
    getUserByEmail(email.toString()).then((user) => {
      if (user) {
        res.status(200).json({ user });
      } else {
        res.status(500);
      }
    });
  } else {
    console.log('GET => /users');
    getAllUsers().then((users) => {
      if (users) {
        res.status(200).json({ users });
      } else {
        res.status(500);
      }
    });
  }
};

// POST /users : create new user (ie signup)
// request body: {username, password}
const handlePost = (req: NextApiRequest, res: NextApiResponse<{}>) => {
  console.log('POST => /users');
  const { username, password, bio, email } = req.body;
  if (username && password) {
    createUser(username, password, bio, email).then((newUser) => {
      if (newUser) {
        res.status(200).json({ user: newUser });
      } else if (newUser === null) {
        res.status(409).json({ error: 'Username taken.' });
      } else {
        res.status(500);
      }
    });
  } else {
    res.status(400).json({ error: 'Missing username and/or password.' });
  }
};

export default handler;
