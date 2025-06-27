const nodemailer = require('nodemailer');

const sendMail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // use true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `Jazzy Thredz <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });

  console.log('📤 Email sent:', info.messageId);
  return info;
};

module.exports = sendMail;
