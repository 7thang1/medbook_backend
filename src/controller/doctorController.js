const {
    createDoctor,
    createDoctorSchedule,
    getDoctorList,
    getSpecialtyList,
} = require("../services/doctorServices");

const CreateDoctor = async (req, res) => {
    try {
        const {
            doctorName,
            doctorGender,
            doctorRoom,
            doctorSpecialtyList,
        } = req.body;
        const data = await createDoctor(doctorName, doctorGender, doctorRoom, doctorSpecialtyList);
        
        if (data && data.EC == 1) {
            res.status(200).json({
                EM: data.EM,
                EC: data.EC,
            });
        }
        if (data && data.EC != 1) {
            res.status(200).json({
                EM: data.EM,
                EC: data.EC,
            });
        }
    } catch (error) {
        console.log(error);   
        res.status(500).json({
            EM: "Error from server",
            EC: -1,
        });
    }
};

const CreateDoctorSchedule = async (req, res) => {
    try {
        const {
            doctorID,
            doctorSpecialtyID,
            doctorScheduleDate,
            doctorStartTimeslot,
            doctorEndTimeslot,
        } = req.body;
        const data = await createDoctorSchedule(doctorID, doctorSpecialtyID, doctorScheduleDate, doctorStartTimeslot, doctorEndTimeslot);

        if (data && data.EC == 1) {
            res.status(200).json({
                EM: data.EM,
                EC: data.EC,
            });
        }
        if (data && data.EC != 1) {
            res.status(200).json({
                EM: data.EM,
                EC: data.EC,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            EM: "Error from server",
            EC: -1,
        });
    }
};

const GetDoctorList = async (req, res) => {
    try {
        const data = await getDoctorList();
        
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

const GetSpecialtyList = async (req, res) => {
    try {
        const data = await getSpecialtyList();

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
    CreateDoctor,
    CreateDoctorSchedule,
    GetDoctorList,
    GetSpecialtyList,
};