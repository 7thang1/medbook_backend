const {
    createDoctor,

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

module.exports = {
    CreateDoctor,
};