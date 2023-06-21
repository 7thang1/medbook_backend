const express = require('express');
const router = express.Router();
const {
    CreateDoctor,
    CreateDoctorSchedule,
    GetDoctorList,
    GetSpecialtyList,
    GetDoctorSchedule,
    GetDoctorsBySpecialtyAndDate,

} = require("../controller/doctorController");

router.route("/createdoctor").post(CreateDoctor);
router.route("/createdoctorschedule").post(CreateDoctorSchedule);
// router.route("/get/:id").get(GetDoctorInfor);
router.route("/get/list").get(GetDoctorList);
router.route("/get/specialtylist").get(GetSpecialtyList);
router.route("/get/schedule").get(GetDoctorSchedule);
router.route("/get/schedulebydate").get(GetDoctorsBySpecialtyAndDate);

module.exports = router;