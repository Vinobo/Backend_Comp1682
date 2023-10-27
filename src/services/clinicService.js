import db from "../models/index";

let createNewClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.name || !data.imageBase64 || !data.address
        || !data.introHTML || !data.introMarkdown
      ) {
        resolve({
          errCode: 1,
          errMessage: 'Missing parameter'
        })
      } else {
        await db.Clinic.create({
          name: data.name,
          image: data.imageBase64,
          address: data.address,
          introHTML: data.introHTML,
          introMarkdown: data.introMarkdown
        })

        resolve({
          errCode: 0,
          errMessage: 'Save clinic succeed'
        })
      }

    } catch (e) {
      reject(e);
    }
  })
}

let getAllClinic = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Clinic.findAll();
      if (data && data.length > 0) {
        data.map(item => {
          item.image = new Buffer.from(item.image, 'base64').toString('binary');
          return item;
        })
      }
      resolve({
        errCode: 0,
        errMessage: 'Ok',
        data
      })

    } catch (e) {
      reject(e);
    }
  })
}

let getDetailClinicById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: 'Missing parameter'
        })
      } else {

        let data = await db.Clinic.findOne({
          where: {
            id: inputId
          },
          attributes: ['name', 'address', 'image', 'introHTML', 'introMarkdown']
        })

        if (data && data.image) {
          data.image = new Buffer.from(data.image, 'base64').toString('binary');
        }

        if (data) {
          let doctorClinic = [];

          doctorClinic = await db.Doctor_Infor.findAll({
            where: {
              clinicId: inputId
            },
            attributes: ['doctorId']
          })

          data.doctorClinic = doctorClinic;

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
  createNewClinic: createNewClinic,
  getAllClinic: getAllClinic,
  getDetailClinicById: getDetailClinicById,
}