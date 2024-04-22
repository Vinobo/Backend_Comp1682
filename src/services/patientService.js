import { where } from "sequelize";
import db from "../models/index";
require('dotenv').config();
import emailService from './emailService';
import { v4 as uuidv4 } from 'uuid';


let buildUrlEmail = (doctorId, token) => {

  let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`

  return result;
}

let postBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.doctorId || !data.timeType || !data.reason || !data.date
        || !data.fullName || !data.selectedGender || !data.phoneNumber || !data.address
      ) {
        resolve({
          errCode: 1,
          errMessage: 'Missing parameter'
        })
      } else {
        let token = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';

        await emailService.sendSimpleEmail({
          receiversEmail: data.email,
          patientName: data.fullName,
          doctorName: data.doctorName,
          time: data.timeString,
          language: data.language,
          redirectLink: buildUrlEmail(data.doctorId, token)
        })

        //upsert patient
        let user = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            roleId: 'R3',
            gender: data.selectedGender,
            address: data.address,
            firstName: data.fullName,
            phoneNumber: data.phoneNumber
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
              timeType: data.timeType,
              reason: data.reason,
              token: token
            }
          })
        }

        //change status hasBooking of Schedule
        let schedule = await db.Schedule.findOne({
          where: {
            doctorId: data.doctorId,
            date: data.date,
            timeType: data.timeType
          },
          raw: false
        })

        if (schedule) {
          schedule.hasBooking = true;
          await schedule.save();
        }

        //Check that the patient has confirmed the appointment within 10 minutes. Cancel the patient's appointment if it has not been confirmed.
        setTimeout(async () => {
          let booking = await db.Booking.findOne({
            where: {
              patientId: user[0].id,
              date: data.date,
              timeType: data.timeType,
            }
          })

          if (booking && schedule) {
            if (booking.statusId && booking.statusId === "S1") {
              schedule.hasBooking = false;
              await schedule.save();
              await db.Booking.destroy({
                where: {
                  patientId: user[0].id,
                  date: data.date,
                  timeType: data.timeType,
                  statusId: "S1"
                }
              });
            }
          }
        }, 600000)

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

let postVerifyAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.doctorId || !data.token) {
        resolve({
          errCode: 1,
          errMessage: 'Missing parameter'
        })
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            token: data.token,
            statusId: 'S1'
          },
          raw: false
        })

        if (appointment) {
          appointment.statusId = 'S2';
          await appointment.save();


          resolve({
            errCode: 0,
            errMessage: 'Update the appointment succed'
          })
        } else {
          resolve({
            errCode: 2,
            errMessage: 'Appointment has been activated or does not exist!'
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = {
  postBookAppointment: postBookAppointment,
  postVerifyAppointment: postVerifyAppointment
}