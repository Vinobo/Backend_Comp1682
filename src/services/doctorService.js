import _ from "lodash";
import db from "../models/index";
require('dotenv').config();
import emailService from './emailService'

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        limit: limit,
        where: { roleId: 'R2' },
        order: [['createdAt', 'DESC']],
        attributes: {
          exclude: ['password']
        },
        include: [
          { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
          { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },

          {
            model: db.Doctor_Infor,
            include: [
              { model: db.Specialty, as: 'specialtyData', attributes: ['name'] }
            ]
          },

        ],
        raw: false,
        nest: true
      })
      if (users && users.length > 0) {
        users.map(item => {
          item.image = new Buffer.from(item.image, 'base64').toString('binary');
          return item;
        })
      }

      resolve({
        errCode: 0,
        data: users
      })

    } catch (e) {
      reject(e)
    }
  })
}

let getAllDoctors = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: {
          roleId: 'R2'
        },
        attributes: {
          exclude: ['password']
        },
        include: [
          { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },

          {
            model: db.Doctor_Infor,
            include: [
              { model: db.Specialty, as: 'specialtyData', attributes: ['name'] }
            ]
          },
        ],
        raw: false,
        nest: true
      })
      if (doctors && doctors.length > 0) {
        doctors.map(item => {
          item.image = new Buffer.from(item.image, 'base64').toString('binary');
          return item;
        })
      }

      resolve({
        errCode: 0,
        data: doctors
      })
    } catch (e) {
      reject(e)
    }
  })
}

let checkRequiredFields = (inputData) => {
  let arrFields = ['doctorId', 'contentHTML', 'contentMarkdown', 'action',
    'selectedPrice', 'selectedPayment', 'selectedProvince',
    'specialtyId'
  ];

  let isValid = true;
  let element = '';
  for (let i = 0; i < arrFields.length; i++) {
    if (!inputData[arrFields[i]]) {
      isValid = false;
      element = arrFields[i]
      break;
    }
  }

  return {
    isValid: isValid,
    element: element
  }
}

let saveInforDoctor = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkObj = checkRequiredFields(inputData)

      if (checkObj.isValid === false) {
        resolve({
          errCode: 1,
          errMessage: `Missing parameter: ${checkObj.element}`
        })
      } else {
        //upsert to Markdown table
        if (inputData.action === 'CREATE') {
          await db.Markdown.create({
            contentHTML: inputData.contentHTML,
            contentMarkdown: inputData.contentMarkdown,
            description: inputData.description,
            doctorId: inputData.doctorId
          })
        } else if (inputData.action === 'EDIT') {
          let doctorMarkdown = await db.Markdown.findOne({
            where: { doctorId: inputData.doctorId },
            raw: false
          })

          if (doctorMarkdown) {
            doctorMarkdown.contentHTML = inputData.contentHTML;
            doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
            doctorMarkdown.description = inputData.description;
            await doctorMarkdown.save()
          }
        }

        //upsert to Doctor_infor table
        let doctorInfor = await db.Doctor_Infor.findOne({
          where: {

            doctorId: inputData.doctorId,
          },
          raw: false
        })
        if (doctorInfor) {
          //update
          doctorInfor.doctorId = inputData.doctorId;
          doctorInfor.priceId = inputData.selectedPrice;
          doctorInfor.paymentId = inputData.selectedPayment;
          doctorInfor.provinceId = inputData.selectedProvince;
          doctorInfor.note = inputData.note;
          doctorInfor.specialtyId = inputData.specialtyId;
          doctorInfor.clinicId = inputData.clinicId;
          await doctorInfor.save()
        } else {
          //create
          await db.Doctor_Infor.create({
            doctorId: inputData.doctorId,
            priceId: inputData.selectedPrice,
            paymentId: inputData.selectedPayment,
            provinceId: inputData.selectedProvince,
            note: inputData.note,
            specialtyId: inputData.specialtyId,
            clinicId: inputData.clinicId,
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

let getAllDoctorInfor = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.User.findAll({
        where: {
          roleId: 'R2'
        },
        attributes: {
          exclude: ['password']
        },
        include: [
          {
            model: db.Markdown,
            attributes: ['contentHTML', 'contentMarkdown', 'description']
          },

          { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },

          {
            model: db.Doctor_Infor,
            attributes: {
              exclude: ['id', 'doctorId']
            },
            include: [
              { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
              { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
              { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },

              { model: db.Specialty, as: 'specialtyData', attributes: ['name'] },
            ]
          },
        ],
        raw: false,
        nest: true
      })

      if (data && data.length > 0) {
        data.map(item => {
          item.image = new Buffer.from(item.image, 'base64').toString('binary');
          return item;
        })
      }

      if (!data) data = {};

      resolve({
        errCode: 0,
        data: data
      })
    } catch (e) {
      reject(e);
    }
  })
}

let handleDeleteDoctorInfor = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctor = await db.Doctor_Infor.findOne({
        where: {
          doctorId: doctorId
        },
      })

      if (!doctor) {
        resolve({
          errCode: 2,
          errMessage: `The doctor-infor isn't exist`
        })
      }

      await db.Doctor_Infor.destroy({
        where: { doctorId: doctorId }
      })

      let user = await db.User.findOne({
        where: { id: doctorId }
      })

      if (!user) {
        resolve({
          errCode: 2,
          errMessage: `The user isn't exist`
        })
      }

      await db.User.destroy({
        where: { id: doctorId }
      })

      let markdown = await db.Markdown.findOne({
        where: {
          doctorId: doctorId
        },
      })

      if (!markdown) {
        resolve({
          errCode: 2,
          errMessage: `The markdown isn't exist`
        })
      }

      await db.Markdown.destroy({
        where: { doctorId: doctorId }
      })

      resolve({
        errCode: 0,
        message: 'The doctor-infor is deleted'
      })
    } catch (e) {
      reject(e)
    }
  })
}

let getDetailDoctorById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameter!'
        })
      } else {
        let data = await db.User.findOne({
          where: {
            id: inputId
          },
          attributes: {
            exclude: ['password']
          },
          include: [
            {
              model: db.Markdown,
              attributes: ['contentHTML', 'contentMarkdown', 'description']
            },

            { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },

            {
              model: db.Doctor_Infor,
              attributes: {
                exclude: ['id', 'doctorId']
              },
              include: [
                { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
              ]
            },
          ],
          raw: false,
          nest: true
        })

        if (data && data.image) {
          data.image = new Buffer.from(data.image, 'base64').toString('binary');
        }

        if (!data) data = {};

        resolve({
          errCode: 0,
          data: data
        })
      }

    } catch (e) {
      reject(e);
    }
  })
}

let bulkCreateSchedule = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required param !'
        })
      } else {
        let schedule = data.arrSchedule;
        if (schedule && schedule.length > 0) {
          schedule = schedule.map(item => {
            item.maxNumber = MAX_NUMBER_SCHEDULE;
            return item;
          })
        }

        //get all existing data
        let existing = await db.Schedule.findAll({
          where: { doctorId: data.doctorId, date: data.formatedDate },
          attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
          raw: true
        });

        //compare different
        let toCreate = _.differenceWith(schedule, existing, (a, b) => {
          return a.timeType === b.timeType && +a.date === +b.date;
        });

        //create data
        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate)
        }

        resolve({
          errCode: 0,
          errMessage: 'Ok'
        });
      }

    } catch (e) {
      reject(e);
    }
  })
}



let getScheduleByDate = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters !'
        })
      } else {
        let dataSchedule = await db.Schedule.findAll({
          where: {
            doctorId: doctorId,
            date: date
          },
          include: [
            {
              model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi']
            },
            {
              model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName']
              // include: { model: db.Booking, as: 'bookData' }
            },
            // {
            //   model: db.Booking, as: 'bookingData', attributes: ["date", 'timeType']
            // },
          ],
          raw: false,
          nest: true
        })

        if (!dataSchedule) dataSchedule = [];

        resolve({
          errCode: 0,
          data: dataSchedule
        })
      }
    } catch (e) {
      reject(e);
    }
  })
}

let handleDeleteSchedule = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let schedule = await db.Schedule.findOne({
        where: { id: id }
      })

      if (!schedule) {
        resolve({
          errCode: 2,
          errMessage: `The schedule isn't exist`
        })
      }

      await db.Schedule.destroy({
        where: { id: id }
      })

      resolve({
        errCode: 0,
        message: 'The schedule is deleted'
      })
    } catch (e) {
      reject(e);
    }
  })
}

let getAddressFeeDoctorById = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters !'
        })
      } else {
        let data = await db.Doctor_Infor.findOne({
          where: {
            doctorId: doctorId
          },
          attributes: {
            exclude: ['id', 'doctorId']
          },
          include: [
            { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
            { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
            { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },

            { model: db.Clinic, as: 'clinicData', attributes: ['name', 'address'] },
          ],
          raw: false,
          nest: true
        })

        if (!data) data = {};
        resolve({
          errCode: 0,
          data: data
        })
      }
    } catch (e) {
      reject(e);
    }
  })
}

let getProfileDoctorById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters !'
        })
      } else {
        let data = await db.User.findOne({
          where: {
            id: inputId
          },
          attributes: {
            exclude: ['password']
          },
          include: [
            {
              model: db.Markdown,
              attributes: ['contentHTML', 'contentMarkdown', 'description']
            },

            { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },

            {
              model: db.Doctor_Infor,
              attributes: {
                exclude: ['id', 'doctorId']
              },
              include: [
                { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },

                { model: db.Clinic, as: 'clinicData' },

                { model: db.Specialty, as: 'specialtyData', attributes: ['name'] },

              ]
            },
          ],
          raw: false,
          nest: true
        })

        if (data && data.image) {
          data.image = new Buffer.from(data.image, 'base64').toString('binary');
        }

        if (!data) data = {};

        resolve({
          errCode: 0,
          data: data
        })
      }
    } catch (e) {
      reject(e);
    }
  })
}

let getListPatientForDoctor = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters !'
        })
      } else {
        let data = await db.Booking.findAll({
          where: {
            statusId: 'S2',
            doctorId: doctorId,
            date: date
          },
          include: [
            {
              model: db.User, as: 'patientData',
              attributes: ['email', 'firstName', 'address', 'gender'],
              include: [
                { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
              ]
            },
            { model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi'] },

          ],
          raw: false,
          nest: true
        })

        if (data && data.image) {
          data.image = new Buffer.from(data.image, 'base64').toString('binary');
        }

        if (!data) data = {};

        resolve({
          errCode: 0,
          data: data
        })
      }
    } catch (e) {
      reject(e);
    }
  })
}

let sendRemedy = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.doctorId || !data.patientId || !data.timeType
        || !data.imgBase64) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters !'
        })
      } else {
        //update patient status
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            patientId: data.patientId,
            timeType: data.timeType,
            statusId: 'S2'
          },
          raw: false
        })

        if (appointment) {
          appointment.statusId = 'S3';
          await appointment.save()
        }

        //send email remedy
        await emailService.sendAttachment(data)

        // if (data && data.image) {
        //   data.image = new Buffer.from(data.image, 'base64').toString('binary');
        // }

        // if (!data) data = {};

        resolve({
          errCode: 0,
          errMessage: 'Ok'
          // data: data
        })
      }
    } catch (e) {
      reject(e);
    }
  })
}

let getDetailDoctorByLocation = (location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!location) {
        resolve({
          errCode: 1,
          errMessage: 'Missing parameter'
        })
      } else {

        let data = await db.User.findAll({
          where: { roleId: 'R2' },
          order: [['createdAt', 'DESC']],
          attributes: {
            exclude: ['password']
          },
          include: [
            { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
            { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },

            {
              model: db.Doctor_Infor,
              include: [
                { model: db.Specialty, as: 'specialtyData', attributes: ['name'] },
                { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
              ]
            },

          ],
          raw: false,
          nest: true
        })

        if (data && data.image) {
          data.image = new Buffer.from(data.image, 'base64').toString('binary');
        }

        if (data) {
          let doctor = [];
          if (location === 'ALL') {
            doctor = await db.Doctor_Infor.findAll({
              attributes: ['provinceId']
            })
          } else {
            //find by location
            doctor = await db.Doctor_Infor.findAll({
              where: {
                provinceId: 'PRO1'
              },
              attributes: ['provinceId']
            })
          }

          data.doctor = doctor;

        } else data = {}

        resolve({
          errCode: 0,
          errMessage: 'Ok',
          data
        })

      }
    } catch (e) {
      reject(e);
    }
  })
}


module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  saveInforDoctor: saveInforDoctor,
  getAllDoctorInfor: getAllDoctorInfor,
  handleDeleteDoctorInfor: handleDeleteDoctorInfor,
  getDetailDoctorById: getDetailDoctorById,
  bulkCreateSchedule: bulkCreateSchedule,
  getScheduleByDate: getScheduleByDate,
  handleDeleteSchedule: handleDeleteSchedule,
  getAddressFeeDoctorById: getAddressFeeDoctorById,
  getProfileDoctorById: getProfileDoctorById,
  getListPatientForDoctor: getListPatientForDoctor,
  sendRemedy: sendRemedy,
  getDetailDoctorByLocation: getDetailDoctorByLocation
}