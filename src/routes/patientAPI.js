const express = require('express');
const router = express.Router();
const {
    createPatient,
    getListPatient,
    handleDeletePatientProfile,
    getListPatientProfiles,
    handleUpdatePatientProfile,

} = require("../controller/patientController");

router.route("/register").post(createPatient);
router.route("/get/list/:user_id").get(getListPatient);
router.route("/delete").delete(handleDeletePatientProfile);
router.route("/get/list").get(getListPatientProfiles);
router.route("/update").put(handleUpdatePatientProfile);

module.exports = router;