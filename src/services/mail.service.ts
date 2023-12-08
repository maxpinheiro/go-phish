import { Theme } from 'next-auth';
import { SendVerificationRequestParams } from 'next-auth/providers';
import { createTransport } from 'nodemailer';

export async function sendVerificationRequest(params: SendVerificationRequestParams) {
  const { identifier, url, provider, theme } = params;
  const { host } = new URL(url);

  const transport = createTransport(provider.server);
  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: `Sign in to ${host}`,
    text: text({ url, host }),
    html: html({ url, host, theme }),
  });
  const failed = result.rejected.concat(result.pending).filter(Boolean);
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(', ')}) could not be sent`);
  }
}

/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */
function html(params: { url: string; host: string; theme: Theme }) {
  const { url, host, theme } = params;

  const escapedHost = host.replace(/\./g, '&#8203;.');

  const brandColor = theme.brandColor || '#cc4e4e';
  const color = {
    background: '#f9f9f9',
    text: '#444',
    mainBackground: '#fff',
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: theme.buttonText || '#fff',
  };

  return `
    <body style="background: ${color.background};">
      <table width="100%" border="0" cellspacing="20" cellpadding="0"
        style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
        <tr>
          <td align="center"
            style="padding-top: 10px;">
            <img src="https://phishingfun.com/images/go-phish-icon.large.png" alt="Go Phish" style="max-height: 100px;" />
          </td>
        </tr>
        <tr>
          <td align="center"
            style="padding: 6px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
            Sign in to <strong style="color: #2868C7;">Go Phish</strong>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 10px 0;">
            <table border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
                    target="_blank"
                    style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Sign
                    in</a></td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center"
            style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
            If you did not request this email you can safely ignore it.
          </td>
        </tr>
      </table>
    </body>
  `;
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`;
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

export async function sendFeedbackEmail(feedback: string): Promise<boolean> {
  const emailBody = `Feedback: ${feedback}`;
  const emailHtml = `<p>Feedback: <b>${feedback}</b></p>`;

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
      subject: `GoPhish Feedback Submitted`,
      text: emailBody,
      html: emailHtml,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
