const express = require('express');
const router = express.Router();
const {
    CreateTicket,
    GetInforMedicalTicket,
} = require("../controller/ticketController");

router.route("/create").post(CreateTicket);
router.route("/get/informticket").get(GetInforMedicalTicket);

module.exports = router;