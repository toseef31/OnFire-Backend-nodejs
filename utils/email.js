const nodemailer = require("nodemailer");
// Use mailtrap.io for fevelopment not gmail services
const sendEmail = async (options) => {
  // 1) Create a transporter
  // const transporter = nodemailer.createTransport({
  //   host: process.env.EMAIL_HOST,
  //   port: process.env.EMAIL_PORT,
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL_PASSWORD
  //   }
  // });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "peekfire33056",
      pass: "mltfmoabwmltkcwx",
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: "peekfire33056",
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
