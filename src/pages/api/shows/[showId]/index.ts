import { getShowById } from '@/services/show.service';
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

// GET /shows/:showId : get a single show
const handleGet = (req: NextApiRequest, res: NextApiResponse<{}>) => {
  const showId = parseInt(req.query.showId?.toString() || '');

  if (isNaN(showId)) {
    res.status(400).json({ error: 'Missing show id' });
    return;
  }
  console.log(`GET => /showId/{${showId}}`);
  getShowById(showId).then((show) => {
    if (show === undefined) {
      res.status(404).json({ error: 'User not found.' });
    } else {
      res.status(200).json({ show });
    }
  });
};

export default handler;
