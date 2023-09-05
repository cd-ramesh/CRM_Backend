const nodemailer = require("nodemailer");

const sendMail = async ({subject, to, html}) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'rameshrajs.03.nov@gmail.com',
      pass: 'wluisfmfvvxflmej' 
    }
  });
  return await transporter.sendMail({
    from: 'rameshrajs.03.nov@gmail.com', 
    to, 
    subject, 
    html
  });
}

module.exports = sendMail;