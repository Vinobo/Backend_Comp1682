import db from "../models/index";

let createNewSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.nameSpecialty || !data.imageBase64 || !data.descriptionHTML
        || !data.descriptionMarkdown
      ) {
        resolve({
          errCode: 1,
          errMessage: 'Missing parameter'
        })
      } else {
        await db.Specialty.create({
          name: data.nameSpecialty,
          image: data.imageBase64,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkdown: data.descriptionMarkdown
        })

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

module.exports = {
  createNewSpecialty: createNewSpecialty,
  getAllSpecialties: getAllSpecialties,
}