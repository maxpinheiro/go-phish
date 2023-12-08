import type { NextApiRequest, NextApiResponse } from 'next';
import { ResponseStatus } from '@/types/main';

import {
  addGuess,
  getAllGuesses,
  getGuessesForRun,
  getGuessesForShow,
  getGuessesForUser,
  getGuessesForUserForRun,
  getGuessesForUserForShow,
} from '@/services/guess.service';

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

// GET /guesses : get all guesses
//     /guesses?runId={runId}: get all guesses for a run
//     /guesses?userId={userId}: get all guesses for a user
//     /guesses?runId={runId}&userId={userId}: get all guesses for a user for a run
const handleGet = (req: NextApiRequest, res: NextApiResponse<{}>) => {
  const { runId, userId, showId, completed } = req.query;
  const runid = parseInt(runId?.toString() || '');
  const userid = parseInt(userId?.toString() || '');
  const showid = parseInt(showId?.toString() || '');

  if (runId && userId && !isNaN(runid) && !isNaN(userid)) {
    // get all guesses for a user for a run
    console.log(`GET => /guesses?runId=${runid}&userId=${userid}`);
    getGuessesForUserForRun(userid, runid).then((guesses) => {
      if (guesses === ResponseStatus.NotFound) {
        res.status(404).json({ error: 'No guesses found.' });
        return;
      }

      res.status(200).json({ guesses });
    });
  } else if (showId && userId && !isNaN(showid) && !isNaN(userid)) {
    // get all guesses for a user for a run
    console.log(`GET => /guesses?showId=${showid}&userId=${userid}`);
    getGuessesForUserForShow(userid, showid).then((guesses) => {
      if (guesses === ResponseStatus.NotFound) {
        res.status(404).json({ error: 'No guesses found.' });
        return;
      }

      res.status(200).json({ guesses });
    });
  } else if (showId && !isNaN(showid)) {
    console.log(`GET => /guesses?showId=${showid}`);
    getGuessesForShow(showid).then((guesses) => {
      if (guesses === ResponseStatus.NotFound) {
        res.status(404).json({ error: 'No guesses found.' });
        return;
      }

      const filtered = completed ? guesses.filter((g) => g.completed) : guesses;
      res.status(200).json({ data: filtered });
    });
  } else if (runId && !isNaN(runid)) {
    // get all guesses for a run
    console.log(`GET => /guesses?runId=${runid}`);
    getGuessesForRun(runid).then((guesses) => {
      if (guesses === ResponseStatus.NotFound) {
        res.status(404).json({ error: 'No guesses found.' });
        return;
      }

      const filtered = completed ? guesses.filter((g) => g.completed) : guesses;
      res.status(200).json({ data: filtered });
    });
  } else if (userId && !isNaN(userid)) {
    // get all guesses for a user
    console.log(`GET => /guesses?userId=${userid}`);
    getGuessesForUser(userid).then((guesses) => {
      if (guesses === ResponseStatus.NotFound) {
        res.status(404).json({ error: 'No guesses found.' });
        return;
      }

      const filtered = completed ? guesses.filter((g) => g.completed) : guesses;
      res.status(200).json({ data: filtered });
    });
  } else {
    // get all guesses
    console.log('GET => /guesses');
    getAllGuesses().then((guesses) => {
      res.status(200).json({ data: guesses });
    });
  }
};

// POST /guesess : create guess for user
const handlePost = (req: NextApiRequest, res: NextApiResponse<{}>) => {
  console.log('POST => /guesses');
  const body = req.body;
  if (!body.hasOwnProperty('userId')) {
    res.status(400).json({ error: 'Missing user id' });
  } else if (!body.hasOwnProperty('runId')) {
    res.status(400).json({ error: 'Missing run id' });
  } else if (!body.hasOwnProperty('showId')) {
    res.status(400).json({ error: 'Missing show id' });
  } else if (!body.hasOwnProperty('songId')) {
    res.status(400).json({ error: 'Missing song id' });
  } else if (!body.hasOwnProperty('songName')) {
    res.status(400).json({ error: 'Missing song name' });
  } else if (!body.hasOwnProperty('encore')) {
    res.status(400).json({ error: 'Missing song name' });
  } else {
    const { userId, runId, showId, songId, songName, encore } = body;
    // validate username, run, & song

    // try saving song
    addGuess(userId, runId, showId, songId, songName, encore).then((result) => {
      if (!result) {
        res.status(409).json({ error: 'Song guess already exists for user' });
      } else {
        res.status(200).json({ guess: result });
      }
    });
    // succes
    // fail (already saved by someone else)
  }
};

export default handler;
