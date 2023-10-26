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

module.exports = {
  createNewClinic: createNewClinic,
}