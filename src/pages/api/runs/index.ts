import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllRuns, getRunById } from '@/services/run.service';

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
// GET /runs : get all runs
const handleGet = (req: NextApiRequest, res: NextApiResponse<{}>) => {
  console.log('GET => /runs');
  getAllRuns().then((runs) => {
    if (runs) {
      res.status(200).json({ runs });
    } else {
      res.status(500);
    }
  });
};

export default handler;
