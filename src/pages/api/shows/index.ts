import type { NextApiRequest, NextApiResponse } from 'next';
import { ResponseStatus } from '@/types/main';
import { getAllShows, getShowsForRun } from '@/services/show.service';

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

// GET /shows : get all scores
// QUERY PARAMS:
//   - runId: get all shows for a run
//   - night: get specific night from a run
const handleGet = (req: NextApiRequest, res: NextApiResponse<{}>) => {
  const { runId, night } = req.query;
  if (runId) {
    // get all shows for a run
    const runid = parseInt(runId.toString());
    if (isNaN(runid)) {
      res.status(400).json({ error: 'User not found.' });
    } else {
      console.log(`GET => /shows?runId=${runid}${night && `&night=${night}`}`);
      getShowsForRun(runid).then((shows) => {
        if (shows !== ResponseStatus.NotFound) {
          if (night && !isNaN(parseInt(night.toString()))) {
            const show = shows.find((s) => s.runNight === parseInt(night.toString()));
            if (show) {
              res.status(200).json({ show });
            } else {
              res.status(404).json({
                error: `No show found for night ${parseInt(night.toString())}`,
              });
            }
          } else {
            res.status(200).json({ shows });
          }
        } else {
          res.status(500);
        }
      });
    }
  } else {
    // get all shows
    console.log('GET => /shows');
    getAllShows().then((shows) => {
      if (shows) {
        res.status(200).json({ shows });
      } else {
        res.status(500);
      }
    });
  }
  // scores?runId={runId} : guesses for specific show
};

export default handler;
