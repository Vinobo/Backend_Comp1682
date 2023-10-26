import clinicService from "../services/clinicService"

let createNewClinic = async (req, res) => {
  try {
    let infor = await clinicService.createNewClinic(req.body);
    return res.status(200).json(
      infor
    )
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: `Error from the server`
    })
  }
}

// let getAllSpecialties = async (req, res) => {
//   try {
//     let infor = await specialtyService.getAllSpecialties();
//     return res.status(200).json(
//       infor
//     )
//   } catch (e) {
//     console.log(e);
//     return res.status(200).json({
//       errCode: -1,
//       errMessage: `Error from the server`
//     })
//   }
// }

// let getDetailSpecialtyById = async (req, res) => {
//   try {
//     let infor = await specialtyService.getDetailSpecialtyById(req.query.id, req.query.location);
//     return res.status(200).json(
//       infor
//     )
//   } catch (e) {
//     console.log(e);
//     return res.status(200).json({
//       errCode: -1,
//       errMessage: `Error from the server`
//     })
//   }
// }

module.exports = {
  createNewClinic: createNewClinic,
  // getAllSpecialties: getAllSpecialties,
  // getDetailSpecialtyById: getDetailSpecialtyById,
}