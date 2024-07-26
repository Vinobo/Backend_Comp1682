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
    <p>Livecare would like to send you information about the medical examination schedule you have booked.</p>
    <p><b>Medical examination schedule information:</b></p>
    <p><b>Doctor:</b> ${dataSend.doctorName},</p>
    <p><b>Timen:</b> ${dataSend.time}</p>
    <div>If the above information is correct with the information you placed, 
    please click on the link below to confirm and complete the medical appointment booking process in 10 minutes.</div>
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
    hoàn tất thử tục đặt lịch khám bệnh trong vòng 10 phút.</div>
    <div>
      <a href=${dataSend.redirectLink} target="_blank">Click here</a>
    </div>
    <h4>Xin chân thành cảm ơn!</h4>
    `
  }

  return result;
}

let sendAttachment = async (dataSend) => {
  return new Promise(async (resolve, reject) => {
    try {
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
        to: dataSend.email, // list of receivers
        subject: "Kết quả khám bệnh", // Subject line
        html: getBodyHTMLEmailRemedy(dataSend), // html body
        attachments: [{
          filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
          content: dataSend.imgBase64.split("base64,")[1],
          encoding: 'base64'
        }],
      });

      resolve({
        errCode: 0,
        errMessage: 'Ok'
      })
    }
    catch (e) {
      reject(e);
    }
  })
}

let getBodyHTMLEmailRemedy = (dataSend) => {
  let result = '';
  if (dataSend.language === 'en') {
    result =
      `
    <h3>Dear ${dataSend.patientName},</h3>
    <p>Livecare would like to send you information about the medical examination schedule you have booked.</p>
    <p> bla bala bala</p>
    <h4>Sincerely thank!</h4>
    `
  }

  if (dataSend.language === 'vi') {
    result =
      `
    <h3>Xin chào ${dataSend.patientName},</h3>
    <p>Livecare xin gửi thông tin khám bệnh của bạn.</p>
    <p>Thông tin đơn thuốc/hóa đơn được gửi trong file đính kèm.</p>
    <h4>Xin chân thành cảm ơn!</h4>
    `
  }

  return result;
}

module.exports = {
  sendSimpleEmail: sendSimpleEmail,
  sendAttachment: sendAttachment,
}