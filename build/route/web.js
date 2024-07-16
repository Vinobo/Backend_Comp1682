"use strict";

var _express = _interopRequireDefault(require("express"));
var _homeController = _interopRequireDefault(require("../controllers/homeController"));
var _userController = _interopRequireDefault(require("../controllers/userController"));
var _doctorController = _interopRequireDefault(require("../controllers/doctorController"));
var _patientController = _interopRequireDefault(require("../controllers/patientController"));
var _specialtyController = _interopRequireDefault(require("../controllers/specialtyController"));
var _clinicController = _interopRequireDefault(require("../controllers/clinicController"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var router = _express["default"].Router();
var initWebRoutes = function initWebRoutes(app) {
  router.get('/', _homeController["default"].getHomePage);
  router.get('/about', _homeController["default"].getAboutPage);
  router.get('/crud', _homeController["default"].getCRUD);
  router.post('/post-crud', _homeController["default"].postCRUD);
  router.get('/get-crud', _homeController["default"].showCRUD);
  router.get('/edit-crud', _homeController["default"].getEditCRUD);
  router.post('/put-crud', _homeController["default"].putCRUD);
  router.get('/delete-crud', _homeController["default"].deleteCRUD);

  //rest API
  router.post('/api/login', _userController["default"].handleLogin);
  router.get('/api/get-all-users', _userController["default"].handleGetAllUsers);
  router.post('/api/create-new-user', _userController["default"].handleCreateNewUser);
  router.put('/api/edit-user', _userController["default"].handleEditUser);
  router["delete"]('/api/delete-user', _userController["default"].handleDeleteUser);
  router.get('/api/allcode', _userController["default"].getAllCode);

  //API doctor
  router.get('/api/top-doctor-home', _doctorController["default"].getTopDoctorHome);
  router.get('/api/get-all-doctors', _doctorController["default"].getAllDoctors);
  router.post('/api/save-infor-doctor', _doctorController["default"].postInforDoctor);
  router.get('/api/get-all-doctors-infor', _doctorController["default"].getAllDoctorInfor);
  router["delete"]('/api/delete-doctor-infor', _doctorController["default"].handleDeleteDoctorInfor);
  router.get('/api/get-detail-doctor-by-id', _doctorController["default"].getDetailDoctorById);
  router.get('/api/get-list-patient-for-doctor', _doctorController["default"].getListPatientForDoctor);
  router.post('/api/send-remedy', _doctorController["default"].sendRemedy);

  //API schedule
  router.post('/api/bulk-create-schedule', _doctorController["default"].bulkCreateSchedule);
  router.get('/api/get-schedule-doctor-by-date', _doctorController["default"].getScheduleByDate);
  router.get('/api/get-address-fee-doctor-by-id', _doctorController["default"].getAddressFeeDoctorById);
  router.get('/api/get-profile-doctor-by-id', _doctorController["default"].getProfileDoctorById);
  router["delete"]('/api/delete-schedule', _doctorController["default"].handleDeleteSchedule);

  //API booking
  router.post('/api/patient-book-appointment', _patientController["default"].postBookAppointment);
  router.post('/api/verify-booking', _patientController["default"].postVerifyAppointment);

  //API specialty
  router.post('/api/create-new-specialty', _specialtyController["default"].createNewSpecialty);
  router.get('/api/get-all-specialties', _specialtyController["default"].getAllSpecialties);
  router.get('/api/get-detail-specialty-by-id', _specialtyController["default"].getDetailSpecialtyById);
  router["delete"]('/api/delete-specialty', _specialtyController["default"].handleDeleteSpecialty);

  //API clinic
  router.post('/api/create-new-clinic', _clinicController["default"].createNewClinic);
  router.get('/api/get-all-clinic', _clinicController["default"].getAllClinic);
  router.get('/api/get-detail-clinic-by-id', _clinicController["default"].getDetailClinicById);
  router["delete"]('/api/delete-clinic', _clinicController["default"].handleDeleteClinic);
  return app.use("/", router);
};
module.exports = initWebRoutes;