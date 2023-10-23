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
    html: getBodyHTMLEmail(dataSend), // html body
  });

}

let getBodyHTMLEmail = (dataSend) => {
  let result = '';
  if (dataSend.language === 'en') {
    result =
      `
    <h3>Dear ${dataSend.patientName},</h3>
    <p>Bookingcare would like to send you information about the medical examination schedule you have booked.</p>
    <p><b>Medical examination schedule information:</b></p>
    <p><b>Doctor:</b> ${dataSend.doctorName},</p>
    <p><b>Timen:</b> ${dataSend.time}</p>
    <div>If the above information is correct with the information you placed, 
    please click on the link below to confirm and complete the medical appointment booking process..</div>
    <div>
      <a href=${dataSend.redirectLink} target="_blank">Click here</a>
    </div>
    <h4>Sincerely thank!</h4>
    `
  }

  if (dataSend.language === 'vi') {
    result =
      `
    <h3>Xin chào ${dataSend.patientName},</h3>
    <p>Booking care xin gửi thông tin lịch khám bệnh bạn đã đặt.</p>
    <p><b>Thông tin lịch khám bệnh:</b></p>
    <p><b>Bác sĩ:</b> ${dataSend.doctorName},</p>
    <p><b>Thời gian:</b> ${dataSend.time}</p>
    <div>Nếu thông tin trên đúng với thông tin bạn đặt, xin vui lòng click vào đường link bên dưới để xác nhận và 
    hoàn tất thử tục đặt lịch khám bệnh.</div>
    <div>
      <a href=${dataSend.redirectLink} target="_blank">Click here</a>
    </div>
    <h4>Xin chân thành cảm ơn!</h4>
    `
  }

  return result;
}

module.exports = {
  sendSimpleEmail: sendSimpleEmail,
}