import db from "../models/index";
require('dotenv').config();

let createNewSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.nameSpecialty || !data.descriptionHTML
        || !data.descriptionMarkdown
      ) {
        resolve({
          errCode: 1,
          errMessage: 'Missing parameter'
        })
      } else {
        if (data.action === 'CREATE') {
          await db.Specialty.create({
            name: data.nameSpecialty,
            image: data.imageBase64,
            descriptionHTML: data.descriptionHTML,
            descriptionMarkdown: data.descriptionMarkdown
          })
        } else if (data.action === 'EDIT') {
          let specialtyData = await db.Specialty.findOne({
            where: { id: data.id },
            raw: false
          })

          if (specialtyData) {
            specialtyData.name = data.nameSpecialty;
            specialtyData.image = data.imageBase64;
            specialtyData.descriptionHTML = data.descriptionHTML;
            specialtyData.descriptionMarkdown = data.descriptionMarkdown;
            await specialtyData.save()
          }
        }

        resolve({
          errCode: 0,
          errMessage: 'Save specialty succed'
        })
      }

    } catch (e) {
      reject(e);
    }
  })
}

let getAllSpecialties = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Specialty.findAll();
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

let getDetailSpecialtyById = (inputId, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId || !location) {
        resolve({
          errCode: 1,
          errMessage: 'Missing parameter'
        })
      } else {

        let data = await db.Specialty.findOne({
          where: {
            id: inputId
          },
          attributes: ['name', 'image', 'descriptionHTML', 'descriptionMarkdown']
        })

        if (data && data.image) {
          data.image = new Buffer.from(data.image, 'base64').toString('binary');
        }

        if (data) {
          let doctorSpecialty = [];
          if (location === 'ALL') {
            doctorSpecialty = await db.Doctor_Infor.findAll({
              where: {
                specialtyId: inputId
              },
              attributes: ['doctorId', 'provinceId']
            })
          } else {
            //find by location
            doctorSpecialty = await db.Doctor_Infor.findAll({
              where: {
                specialtyId: inputId,
                provinceId: location
              },
              attributes: ['doctorId', 'provinceId']
            })
          }

          data.doctorSpecialty = doctorSpecialty;

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

let handleDeleteSpecialty = (specialtyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let specialty = await db.Specialty.findOne({
        where: {
          id: specialtyId
        },
      })
      if (!specialty) {
        resolve({
          errCode: 2,
          errMessage: `The specialty isn't exist`
        })
      }

      await db.Specialty.destroy({
        where: { id: specialtyId }
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
  createNewSpecialty: createNewSpecialty,
  getAllSpecialties: getAllSpecialties,
  getDetailSpecialtyById: getDetailSpecialtyById,
  handleDeleteSpecialty: handleDeleteSpecialty
}