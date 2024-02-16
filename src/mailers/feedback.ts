import { Theme } from 'next-auth';

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function subject(feedback: string, contactInfo?: string) {
  return 'GoPhish Feedback Submitted';
}

/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */
function html(feedback: string, contactInfo?: string) {
  const brandColor = '#D45252';
  const color = {
    background: '#f9f9f9',
    text: '#444',
    mainBackground: '#fff',
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: '#fff',
  };

  return `
    <body style="background: ${color.background};">
      <style>
        @import url('https://fonts.googleapis.com/css?family=Roboto');
        * {
          font-family: 'Roboto', helvetica, sans-serif;
        }
      </style>
      <div
        style="width: 100%; max-width: 600px; margin: auto; border-radius: 10px; background: ${
          color.mainBackground
        }; padding: 20px; box-sizing: border-box;">
        <p
          style="padding-top: 4px; font-size: 22px; font-weight: 500; color: ${color.text};">
          Feedback Received:
        </p>
        <p
          style="padding-top: 8px; font-size: 14px; font-weight: 300; color: ${color.text};">
          ${feedback}
        </p>
        <p
          style="padding-top: 24px; font-size: 14px; font-weight: 300; color: ${color.text};">
          <b>Contact Info</b>: ${contactInfo || '(Not provided)'}
        </p>
        <img src="https://phishingfun.com/images/go-phish-icon.large.png" alt="Go Phish" style="max-width: 50px; padding-top: 24px" />
      </div>
    </body>
  `;
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text(feedback: string, contactInfo?: string) {
  return `Feedback Received: \n${feedback}\n\nContact Info: \n${contactInfo || '(Not provided)'}\n\n`;
}

export default { subject, html, text };
