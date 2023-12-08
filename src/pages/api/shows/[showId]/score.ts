import type { NextApiRequest, NextApiResponse } from 'next';
import { ResponseStatus } from '@/types/main';
import { getGuessesForShow, scoreGuesses } from '@/services/guess.service';
import { getSongsByIds } from '@/services/song.service';
import { Song } from '@prisma/client';

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

// POST /shows/:showId/score : score guesses for a show
const handlePost = async (req: NextApiRequest, res: NextApiResponse<{}>) => {
  console.log('POST => /shows/:showId/score');
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
  const songs = await getSongsByIds(setlistSongs.map((s) => s.id));
  console.dir(songs);
  if (songs === ResponseStatus.NotFound) {
    res.status(500).json({ error: 'Could not get songs' });
    return;
  }
  let songLookup: Record<string, Song> = {};
  songs.forEach((s) => (songLookup[s.id] = s));

  const scoredSongs: { id: string; name: string; encore: boolean; points: number }[] = setlistSongs.map(
    ({ id, encore }) => {
      return { id, encore, name: songLookup[id]?.name || id, points: songLookup[id]?.points || 0 };
    }
  );
  console.dir(scoredSongs);
  // songs should be array of {id: string, encore: boolean}
  getGuessesForShow(showId).then((guesses) => {
    if (guesses !== ResponseStatus.NotFound) {
      scoreGuesses(guesses, scoredSongs).then((result) => {
        if (result === ResponseStatus.Success) {
          res.status(200).json('success');
        } else {
          res.status(500).json('Unknown internal error');
        }
      });
    } else {
      res.status(500).json('Unknown internal error');
    }
  });
};

export default handler;
