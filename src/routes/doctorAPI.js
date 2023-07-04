const express = require('express');
const router = express.Router();
const {
    CreateDoctor,
    CreateDoctorSchedule,
    GetDoctorList,
    GetDoctorListPagination,
    GetSpecialtyList,
    GetDoctorSchedule,
    GetDoctorsBySpecialtyAndDate,
    GetListDate,
    GetDoctorWorkingDates,
} = require("../controller/doctorController");

router.route("/createdoctor").post(CreateDoctor);
router.route("/createdoctorschedule").post(CreateDoctorSchedule);
// router.route("/get/:id").get(GetDoctorInfor);
router.route("/get/list").get(GetDoctorList);
router.route("/get/listpagination").get(GetDoctorListPagination);
router.route("/get/specialtylist").get(GetSpecialtyList);
router.route("/get/schedule/:doctorID/:doctorSpecialtyID/:doctorScheduleDate").get(GetDoctorSchedule);
router.route("/get/schedulebydate").get(GetDoctorsBySpecialtyAndDate);
router.route("/get/listdate").get(GetListDate);
router.route("/get/workingdates/:doctorID/:doctorSpecialtyID").get(GetDoctorWorkingDates);

module.exports = router;