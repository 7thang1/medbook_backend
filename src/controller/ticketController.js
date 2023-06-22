const {
    createTicket,
    getMedicalTicketList,
    getMedicalTicketDetails,
    getMedicalTicketsByUserID,

} = require("../services/ticketServices");

const CreateTicket = async (req, res) => {
    try {
        const {
            patientID,
            doctorID,
            doctorSpecialtyID,
            doctorRoomID,
            dateID,
            timeslotID
        } = req.body;
        const data = await createTicket(patientID, doctorID, doctorSpecialtyID, doctorRoomID, dateID, timeslotID);

        if (data && data.EC == 1) {
            res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
        if (data && data.EC != 1) {
            res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            EM: "Error from server",
            EC: -1,
            DT: "",
        });
    }
};

const GetMedicalTicketList = async (req, res) => {
    try {
        const data = await getMedicalTicketList();

        if (data && data.EC == 1) {
            res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
        if (data && data.EC != 1) {
            res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            EM: "Error from server",
            EC: -1,
            DT: data.DT,
        });
    }
};

const GetMedicalTicketDetails = async (req, res) => {
    try {
        const ticketID = req.params.ticketID;
        const data = await getMedicalTicketDetails(ticketID);

        if (data && data.EC == 1) {
            res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
        if (data && data.EC != 1) {
            res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            EM: "Error from server",
            EC: -1,
            DT: "",
        });
    }
};

const GetMedicalTicketsByUserID = async (req, res) => {
    try {
        const userID = req.params.userID;
        const data = await getMedicalTicketsByUserID(userID);

        if (data && data.EC == 1) {
            res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
        if (data && data.EC != 1) {
            res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            EM: "Error from server",
            EC: -1,
            DT: "",
        });
    }
};

module.exports = {
    CreateTicket,
    GetMedicalTicketList,
    GetMedicalTicketDetails,
    GetMedicalTicketsByUserID,
};