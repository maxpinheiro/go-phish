import type { NextApiRequest, NextApiResponse } from 'next';
import { ResponseStatus } from '@/types/main';
import { getGuessesForShow, scoreGuesses } from '@/services/guess.service';
import { getSongsByIds } from '@/services/song.service';
import { Song } from '@prisma/client';

const handler = async (req: NextApiRequest, res: NextApiResponse<{}>) => {
  switch (req.method) {
    case 'POST':
      await handlePost(req, res);
      break;
    default:
      res.status(503).json({ error: 'Invalid request method.' });
      break;
  }
};

// POST /shows/:showId/score : score guesses for a show
const handlePost = async (req: NextApiRequest, res: NextApiResponse<{}>) => {
  console.log('POST => /shows/:showId/score');
  // validate parameters
  const showId = parseInt(req.query.showId?.toString() || '');
  const body = req.body;
  if (isNaN(showId)) {
    res.status(400).json({ error: 'Missing show id' });
    return;
  } else if (!body.hasOwnProperty('songs')) {
    res.status(400).json({ error: 'Missing songs' });
    return;
  }
  const setlistSongs: { id: string; encore: boolean }[] = body.songs;
  // collect song data
  const songs = await getSongsByIds(setlistSongs.map((s) => s.id));
  if (songs === ResponseStatus.NotFound) {
    res.status(500).json({ error: 'Could not get songs' });
    return;
  }
  // organize song data
  const songLookup = Object.fromEntries(songs.map((s) => [s.id, s]));
  const scoredSongs: { id: string; name: string; encore: boolean; points: number }[] = setlistSongs.map(
    ({ id, encore }) => {
      return { id, encore, name: songLookup[id]?.name || id, points: songLookup[id]?.points || 0 };
    }
  );
  // fetch and score guesses
  const guesses = await getGuessesForShow(showId);
  if (guesses === ResponseStatus.NotFound) {
    res.status(500).json('Unknown internal error');
    return;
  }
  const result = await scoreGuesses(guesses, scoredSongs);
  if (result === ResponseStatus.Success) {
    res.status(200).json('success');
  } else {
    res.status(500).json('Unknown internal error');
  }
};

export default handler;
