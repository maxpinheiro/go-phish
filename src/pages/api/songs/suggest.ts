import { sendSongSuggestEmail } from '@/services/mail.service';
import type { NextApiRequest, NextApiResponse } from 'next';

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

// POST /songs/suggest : suggest song
const handlePost = async (req: NextApiRequest, res: NextApiResponse<{}>) => {
  console.log('POST => /songs/suggest');
  const body = req.body;
  if (!body.hasOwnProperty('song')) {
    res.status(400).json({ error: 'Missing song' });
    return;
  }
  const song = body.song?.toString();
  const success = await sendSongSuggestEmail(song);
  if (success) {
    res.status(200).send('success');
  } else {
    res.status(500).json({ error: 'Unknown error.' });
  }
};

export default handler;
