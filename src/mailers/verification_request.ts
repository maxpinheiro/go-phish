import { Theme } from 'next-auth';

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function subject({ url, host }: { url: string; host: string }) {
  return 'Sign in to GoPhish';
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

  const brandColor = theme.brandColor || '#D45252';
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
        style="width: 100%; max-width: 600px; margin: auto; border-radius: 10px; background: ${color.mainBackground}; padding: 20px; box-sizing: border-box;">
        <img src="https://phishingfun.com/images/go-phish-icon.large.png" alt="Go Phish" style="max-width: 50px;" />
        <p
          style="padding-top: 25px; font-size: 24px; font-weight: 500; color: ${color.text};">
          Sign in to GoPhish
        </p>
        <p
          style="padding: 18px 0px; font-size: 16px; font-weight: 200; color: ${color.text};">
          Click the button below to securely log in. This magic link will expire in 1 hour.
        </p>
        <a href="${url}" target="_blank"
          style="font-size: 18px; font-weight: 200; background-color: ${color.buttonBackground}; color: ${color.buttonText}; text-decoration: none; border-radius: 50px; padding: 8px 24px; border: 1px solid ${color.buttonBorder}; width: max-content;">
          Sign in
        </a>
        <p
          style="padding-top: 25px; font-size: 14px; font-weight: 100; line-height: 18px; color: ${color.text};">
          If you did not request this email, you can safely ignore it.
        </p>
      </div>
    </body>
  `;
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`;
}

const data = { subject, html, text };

export default data;
