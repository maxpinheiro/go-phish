import { sendFeedbackEmail } from '@/services/mail.service';
import type { NextApiRequest, NextApiResponse } from 'next';

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

// POST /feedback : suggest feedback/bug
const handlePost = async (req: NextApiRequest, res: NextApiResponse<{}>) => {
  console.log('POST => /feedback');
  const body = req.body;
  if (!body.hasOwnProperty('feedback')) {
    res.status(400).json({ error: 'Missing feedback' });
    return;
  }
  const feedback = body.feedback?.toString();
  const contactInfo = body.contactInfo?.toString();
  const success = await sendFeedbackEmail(feedback, contactInfo);
  if (success) {
    res.status(200).send('success');
  } else {
    res.status(500).json({ error: 'Unknown error.' });
  }
};

export default handler;
