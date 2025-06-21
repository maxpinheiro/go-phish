type ResetPasswordMailerProps = {
  token: string;
  username: string;
};

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function subject({ token, username }: ResetPasswordMailerProps) {
  return 'Your GoPhish Password Reset Request';
}

/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 */
function html({ token, username }: ResetPasswordMailerProps) {
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
        style="width: 100%; max-width: 600px; margin: auto; border-radius: 10px; background: ${color.mainBackground}; padding: 20px; box-sizing: border-box;">
        <p
          style="padding-top: 0px; font-size: 22px; font-weight: 300; color: ${color.text};">
          Hey ${username},
        </p>
        <p
          style="padding-top: 4px; padding-bottom: 24px; font-size: 14px; font-weight: 300; color: ${color.text};">
          Let's get you back into your account. Click the button below to reset your password.
        </p>
        <a href="https://www.phishingphun.com/reset-password?token=${token}" target="_blank"
          style="font-size: 16px; font-weight: 200; background-color: ${color.buttonBackground}; color: ${color.buttonText}; text-decoration: none; border-radius: 50px; padding: 8px 24px; border: 1px solid ${color.buttonBorder}; width: max-content;">
          Reset Your Password
        </a>
        <p
          style="padding-top: 25px; font-size: 14px; font-weight: 100; line-height: 18px; color: ${color.text};">
          This link will expire in 24 hours. If you did not request to reset your password, you can safely ignore this email.
        </p>
        <img src="https://phishingfun.com/images/go-phish-icon.large.png" alt="Go Phish" style="max-width: 50px; padding-top: 24px" />
      </div>
    </body>
  `;
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ token, username }: ResetPasswordMailerProps) {
  return `Reset your password: \nhttps://www.phishingphun.com/reset-password?token=${token}\n\n`;
}

const data = { subject, html, text };

export default data;
