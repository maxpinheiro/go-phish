import { getSetlistForShowDate } from '@/services/phishnet.service';
import { ResponseStatus } from '@/types/main';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse<{}>) => {
  switch (req.method) {
    case 'GET':
      await handleGet(req, res);
      break;
    default:
      res.status(503).json({ error: 'Invalid request method.' });
      break;
  }
};

// GET /setlist?date=YYYY-MM-DD : get setlist for show
const handleGet = async (req: NextApiRequest, res: NextApiResponse<{}>) => {
  console.log('GET => /setlist');
  const { date } = req.query;
  if (!date) {
    res.status(400).json({ error: 'Missing date' });
  } else {
    const setlist = await getSetlistForShowDate(date.toString());
    if (setlist === ResponseStatus.NotFound) {
      res.status(404).json({ error: 'No user found with username/password.' });
    } else if (setlist === ResponseStatus.UnknownError) {
      res.status(500).json('Unknown internal error');
    } else {
      res.status(200).json({ setlist });
    }
  }
};

export default handler;
