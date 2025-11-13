import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "fakomohale793@gmail.com",      // your gmail
      pass: "gxta bzgi lwvw lbwc",          // your app password
    },
  });

  await transporter.sendMail({
    from: "fakomohale793@gmail.com",  // MUST be same as auth user
    to,
    subject,
    html,
  });
};
