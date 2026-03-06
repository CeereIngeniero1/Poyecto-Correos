const { createTransport } = require("../config/Mail");

async function sendMail({ to, subject, html, attachments }) {
  const transporter = createTransport();

  const info = await transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
    to,
    subject,
    html,
    attachments,
  });

  return info;
}

module.exports = { sendMail };