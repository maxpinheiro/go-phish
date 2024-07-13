import { ResponseStatus } from '@/types/main';
import type { NextApiRequest, NextApiResponse } from 'next';

import {
  addGuess,
  getAllGuesses,
  getGuessesForRun,
  getGuessesForShow,
  getGuessesForUser,
  getGuessesForUserForRun,
  getGuessesForUserForShow,
} from '@/services/guess.service';

const handler = async (req: NextApiRequest, res: NextApiResponse<{}>) => {
  switch (req.method) {
    case 'GET':
      await handleGet(req, res);
      break;
    case 'POST':
      await handlePost(req, res);
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
const handleGet = async (req: NextApiRequest, res: NextApiResponse<{}>) => {
  const { runId, userId, showId, completed } = req.query;
  const runid = parseInt(runId?.toString() || '');
  const userid = parseInt(userId?.toString() || '');
  const showid = parseInt(showId?.toString() || '');

  if (runId && userId && !isNaN(runid) && !isNaN(userid)) {
    // get all guesses for a user for a run
    console.log(`GET => /guesses?runId=${runid}&userId=${userid}`);
    const guesses = await getGuessesForUserForRun(userid, runid);
    if (guesses === ResponseStatus.NotFound) {
      res.status(404).json({ error: 'No guesses found.' });
    } else {
      res.status(200).json({ guesses });
    }
  } else if (showId && userId && !isNaN(showid) && !isNaN(userid)) {
    // get all guesses for a user for a run
    console.log(`GET => /guesses?showId=${showid}&userId=${userid}`);
    const guesses = await getGuessesForUserForShow(userid, showid);
    if (guesses === ResponseStatus.NotFound) {
      res.status(404).json({ error: 'No guesses found.' });
    } else {
      res.status(200).json({ guesses });
    }
  } else if (showId && !isNaN(showid)) {
    console.log(`GET => /guesses?showId=${showid}`);
    const guesses = await getGuessesForShow(showid);
    if (guesses === ResponseStatus.NotFound) {
      res.status(404).json({ error: 'No guesses found.' });
    } else {
      const filtered = completed ? guesses.filter((g) => g.completed) : guesses;
      res.status(200).json({ data: filtered });
    }
  } else if (runId && !isNaN(runid)) {
    // get all guesses for a run
    console.log(`GET => /guesses?runId=${runid}`);
    const guesses = await getGuessesForRun(runid);
    if (guesses === ResponseStatus.NotFound) {
      res.status(404).json({ error: 'No guesses found.' });
    } else {
      const filtered = completed ? guesses.filter((g) => g.completed) : guesses;
      res.status(200).json({ data: filtered });
    }
  } else if (userId && !isNaN(userid)) {
    // get all guesses for a user
    console.log(`GET => /guesses?userId=${userid}`);
    const guesses = await getGuessesForUser(userid);
    if (guesses === ResponseStatus.NotFound) {
      res.status(404).json({ error: 'No guesses found.' });
    } else {
      const filtered = completed ? guesses.filter((g) => g.completed) : guesses;
      res.status(200).json({ data: filtered });
    }
  } else {
    // get all guesses
    console.log('GET => /guesses');
    const guesses = await getAllGuesses();
    res.status(200).json({ data: guesses });
  }
};

// POST /guesess : create guess for user
const handlePost = async (req: NextApiRequest, res: NextApiResponse<{}>) => {
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
    const result = await addGuess(userId, runId, showId, songId, songName, encore);
    if (!result) {
      res.status(409).json({ error: 'Song guess already exists for user' });
    } else {
      res.status(200).json({ guess: result });
    }
  }
};

export default handler;
