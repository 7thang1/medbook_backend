const express = require('express');
const router = express.Router();
const {
    CreateTicket,
    GetMedicalTicketList,
    GetMedicalTicketDetails,
    GetMedicalTicketsByUserID,
} = require("../controller/ticketController");

router.route("/create").post(CreateTicket);
router.route("/get/informticket").get(GetMedicalTicketList);
router.route("/get/informticket/:ticketID").get(GetMedicalTicketDetails);
router.route("/get/informticket/user/:userID").get(GetMedicalTicketsByUserID);

module.exports = router;