import { updateUserAvatar } from '@/services/user.service';
import { ResponseStatus } from '@/types/main';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

const handler = async (req: NextApiRequest, res: NextApiResponse<{}>) => {
  switch (req.method) {
    case 'PUT':
      await handlePut(req, res);
      break;
    default:
      res.status(503).json({ error: 'Invalid request method.' });
      break;
  }
};

const handlePut = async (req: NextApiRequest, res: NextApiResponse<{}>) => {
  const { head, torso, background, type } = req.body;
  const userId = parseInt(req.query.userId?.toString() || '');
  const session = await getServerSession(req, res, authOptions);
  const currentUserId = session?.user?.id;
  if (isNaN(userId)) {
    res.status(400).json({ error: 'Missing user id' });
    return;
  } else if (userId !== currentUserId) {
    res.status(401).json({ error: 'You are not signed in as this user.' });
  } else if (!head || !torso || !background) {
    res.status(400).json({ error: 'Missing avatar config' });
    return;
  }
  const result = await updateUserAvatar(userId, head, torso, background, type);
  if (result === ResponseStatus.NotFound) {
    res.status(500).json('Could not find user with id.');
  } else {
    res.status(200).json({ user: result });
  }
};

export default handler;
