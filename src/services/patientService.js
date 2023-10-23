import db from "../models/index";
require('dotenv').config();
import emailService from './emailService'


let postBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.doctorId || !data.timeType || !data.date) {
        resolve({
          errCode: 1,
          errMessage: 'Missing parameter'
        })
      } else {

        await emailService.sendSimpleEmail({
          receiversEmail: data.email,
          patientName: 'Long Lá',
          doctorName: 'Hình Tuấn Tú',
          time: '8:00 - 9:00 - Thứ 3 12/10/2023',
          redirectLink: 'https://bookingcare.vn/'
        })

        //upsert patient
        let user = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            roleId: 'R3'
          },
        });

        //create a booking record
        if (user && user[0]) {
          await db.Booking.findOrCreate({
            where: { patientId: user[0].id },
            defaults: {
              statusId: 'S1',
              doctorId: data.doctorId,
              patientId: user[0].id,
              date: data.date,
              timeType: data.timeType
            }

          })
        }

        resolve({
          errCode: 0,
          errMessage: 'Save infor doctor succed'
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = {
  postBookAppointment: postBookAppointment
}