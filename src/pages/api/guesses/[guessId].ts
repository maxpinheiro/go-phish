import { ResponseStatus } from '@/types/main';
import type { NextApiRequest, NextApiResponse } from 'next';

import { deleteGuess, getGuessById } from '@/services/guess.service';

const handler = async (req: NextApiRequest, res: NextApiResponse<{}>) => {
  switch (req.method) {
    case 'GET':
      await handleGet(req, res);
      break;
    case 'DELETE':
      await handleDelete(req, res);
      break;
    default:
      res.status(503).json({ error: 'Invalid request method.' });
      break;
  }
};

// GET /guesses/:guessId : get specific guess
const handleGet = async (req: NextApiRequest, res: NextApiResponse<{}>) => {
  const guessId = parseInt(req.query.guessId?.toString() || '');
  if (isNaN(guessId)) {
    res.status(400).json({ error: 'Missing/invalid guess id.' });
    return;
  }
  console.log(`GET => /guesses/${guessId}`);
  const guess = await getGuessById(guessId);
  if (guess) {
    res.status(200).json({ guess });
  } else {
    res.status(500).json('Unknown internal error');
  }
};

// DELETE /guesses/:guessId : delete existing guess
const handleDelete = async (req: NextApiRequest, res: NextApiResponse<{}>) => {
  const guessId = parseInt(req.query.guessId?.toString() || '');
  if (isNaN(guessId)) {
    res.status(400).json({ error: 'Missing/invalid guess id.' });
    return;
  }
  console.log(`DELETE => /guesses/${guessId}`);
  const result = await deleteGuess(guessId);
  if (result === ResponseStatus.NotFound) {
    res.status(404).json({ error: 'Guess not found.' });
    return;
  }

  res.status(200).send('Succesfully deleted guess.');
};

export default handler;
