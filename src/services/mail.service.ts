import { SendVerificationRequestParams } from 'next-auth/providers';
import { createTransport } from 'nodemailer';
import verificationRequestMailer from '@/mailers/verification_request';
import feedbackMailer from '@/mailers/feedback';
import resetPasswordMailer from '@/mailers/resetPassword.mailer';

/**
 * Sends an sign-in email with a magic link.
 */
export async function sendVerificationRequest(params: SendVerificationRequestParams) {
  const { identifier, url, provider, theme } = params;
  const { host } = new URL(url);

  const transport = createTransport(provider.server);
  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: verificationRequestMailer.subject({ url, host }),
    text: verificationRequestMailer.text({ url, host }),
    html: verificationRequestMailer.html({ url, host, theme }),
  });
  const failed = result.rejected.concat(result.pending).filter(Boolean);
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(', ')}) could not be sent`);
  }
}

export async function sendRecoveryCode(email: string, code: string): Promise<boolean> {
  const emailBody = `Enter this code in the app to recover your account info: ${code}`;
  const emailHtml = `<p>Enter this code in the app to recover your account info: <b>${code}</b></p>`;

  // create reusable transporter object using the default SMTP transport
  let transporter = createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '25'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SERVER_USERNAME,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  try {
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"The Helping Friendly Bot" <help@phishingfun.com>',
      to: email,
      subject: 'Your Account Recovery Code',
      text: emailBody,
      html: emailHtml,
    });

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function sendSongSuggestEmail(song: string): Promise<boolean> {
  const emailBody = `Suggested Song: ${song}`;
  const emailHtml = `<p>Suggested Song: <b>${song}</b></p>`;

  // create reusable transporter object using the default SMTP transport
  let transporter = createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '25'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SERVER_USERNAME,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  try {
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"The Helping Friendly Bot" <help@phishingfun.com>',
      to: 'maxpinheiro181@gmail.com',
      subject: `GoPhish Song Suggestion: ${song}`,
      text: emailBody,
      html: emailHtml,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function sendFeedbackEmail(feedback: string, contactInfo?: string): Promise<boolean> {
  // create reusable transporter object using the default SMTP transport
  let transporter = createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '25'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SERVER_USERNAME,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  try {
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: 'maxpinheiro181@gmail.com',
      subject: feedbackMailer.subject(feedback, contactInfo),
      text: feedbackMailer.text(feedback, contactInfo),
      html: feedbackMailer.html(feedback, contactInfo),
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function sendPasswordResetEmail(email: string, token: string, username: string): Promise<boolean> {
  // create reusable transporter object using the default SMTP transport
  let transporter = createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '25'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SERVER_USERNAME,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  try {
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: resetPasswordMailer.subject({ token, username }),
      text: resetPasswordMailer.text({ token, username }),
      html: resetPasswordMailer.html({ token, username }),
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
