require('dotenv').config();
import nodemailer from 'nodemailer';

let sendSimpleEmail = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD
    }
  });

  // async..await is not allowed in global scope, must use a wrapper

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"TrinhnkGCS18897 👻" <khoami123678@gmail.com>', // sender address
    to: dataSend.receiversEmail, // list of receivers
    subject: "Thông tin đặt lịch khám bệnh", // Subject line
    text: "Hello world?", // plain text body
    html: `
          <h3>Xin chào ${dataSend.patientName},</h3>
          <p>Booking care xin gửi thông tin lịch khám bệnh bạn đã đặt.</p>
          <p><b>Thông tin lịch khám bệnh:</b></p>
          <div><b>Bác sĩ:</b> ${dataSend.doctorName},</div>
          <div><b>Thời gian:</b> ${dataSend.time}</div>
          <p>Nếu thông tin trên đúng với thông tin bạn đặt, xin vui lòng click vào đường link bên dưới để xác nhận và 
          hoàn tất thử tục đặt lịch khám bệnh.</p>
          <div>
            <a href=${dataSend.redirectLink} target="_blank">Click here</a>
          </div>
          <h4>Xin chân thành cảm ơn!</h4>
          `, // html body
  });

}

module.exports = {
  sendSimpleEmail: sendSimpleEmail,
}