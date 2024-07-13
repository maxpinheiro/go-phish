import { getRunById } from '@/services/run.service';
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
// GET /runs/:runId : get a specific run
const handleGet = (req: NextApiRequest, res: NextApiResponse<{}>) => {
  console.log('GET => /runs/:userId');
  const { runId } = req.query;
  if (runId) {
    const id = parseInt(runId.toString());
    getRunById(id).then((run) => {
      if (run) {
        res.status(200).json({ run });
      } else {
        res.status(404).json({ error: 'Run not found' });
      }
    });
  } else {
    res.status(400).json({ error: 'Missing run id' });
  }
};

export default handler;
