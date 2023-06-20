const express = require('express');
const router = express.Router();
const {
    CreateDoctor,

} = require("../controller/doctorController");

router.route("/createdoctor").post(CreateDoctor);
// router.route("/get/:id").get(GetDoctorInfor);
// router.route("/get/list").get(getAllDoctor);

module.exports = router;