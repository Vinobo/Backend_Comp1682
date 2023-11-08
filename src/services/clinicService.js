import db from "../models/index";

let checkRequiredFields = (data) => {
  let arrFields = ['name', 'imageBase64', 'address', 'introHTML', 'introMarkdown'
  ];

  let isValid = true;
  let element = '';
  for (let i = 0; i < arrFields.length; i++) {
    if (!data[arrFields[i]]) {
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

let createNewClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkObj = checkRequiredFields(data)

      if (checkObj.isValid === false) {
        resolve({
          errCode: 1,
          errMessage: 'Missing parameter'
        })
      } else {
        if (data.action === 'CREATE') {
          await db.Clinic.create({
            name: data.name,
            image: data.imageBase64,
            address: data.address,
            introHTML: data.introHTML,
            introMarkdown: data.introMarkdown,
            specialtyHTML: data.specialtyHTML,
            specialtyMarkdown: data.specialtyMarkdown,
            deviceHTML: data.deviceHTML,
            deviceMarkdown: data.deviceMarkdown,
            locationHTML: data.locationHTML,
            locationMarkdown: data.locationMarkdown,
            processHTML: data.processHTML,
            processMarkdown: data.processMarkdown
          })
        } else if (data.action === 'EDIT') {
          let clinicData = await db.Clinic.findOne({
            where: { id: data.id },
            raw: false
          })

          if (clinicData) {
            clinicData.name = data.name;
            clinicData.image = data.imageBase64;
            clinicData.address = data.address;
            clinicData.introHTML = data.introHTML;
            clinicData.introMarkdown = data.introMarkdown;
            clinicData.specialtyHTML = data.specialtyHTML;
            clinicData.specialtyMarkdown = data.specialtyMarkdown;
            clinicData.deviceHTML = data.deviceHTML;
            clinicData.deviceMarkdown = data.deviceMarkdown;
            clinicData.locationHTML = data.locationHTML;
            clinicData.locationMarkdown = data.locationMarkdown;
            clinicData.processHTML = data.processHTML;
            clinicData.processMarkdown = data.processMarkdown
            await clinicData.save()
          }
        }

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
          attributes: ['name', 'address', 'image', 'introHTML', 'introMarkdown',
            'specialtyHTML', 'specialtyMarkdown', 'deviceHTML', 'deviceMarkdown',
            'locationHTML', 'locationMarkdown', 'processHTML', 'processMarkdown'
          ]
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

let handleDeleteClinic = (clinicId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let clinic = await db.Clinic.findOne({
        where: {
          id: clinicId
        },
      })
      if (!clinic) {
        resolve({
          errCode: 2,
          errMessage: `The specialty isn't exist`
        })
      }

      await db.Clinic.destroy({
        where: { id: clinicId }
      })

      resolve({
        errCode: 0,
        message: 'The specialty is deleted'
      })
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = {
  createNewClinic: createNewClinic,
  getAllClinic: getAllClinic,
  getDetailClinicById: getDetailClinicById,
  handleDeleteClinic: handleDeleteClinic
}