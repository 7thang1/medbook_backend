const {
    createTicket,
    getInforMedicalTicket,
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

const GetInforMedicalTicket = async (req, res) => {
    try {
        const data = await getInforMedicalTicket();

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

module.exports = {
    CreateTicket,
    GetInforMedicalTicket,
};