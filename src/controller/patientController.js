const {
    createPatientProfile,
    getPatientProfileList,
    deletePatientProfile,
    getPatientProfilesList,
    updatePatientProfile,
} = require('../services/patientServices');

const createPatient = async (req, res) => {
    try {
        const {
            user_id,
            patient_name,
            patient_dob,
            patient_gender,
            patient_phone_number,
            patient_address,
            patient_occupation,
            patient_ethnicity
    } = req.body;
        const data = await createPatientProfile(
            user_id,
            patient_name,
            patient_dob,
            patient_gender,
            patient_phone_number,
            patient_address,
            patient_occupation,
            patient_ethnicity
            );
            if (data && +data.EC == 1){
                return res.status(201).json({
                    EM: data.EM,
                    EC: 1,
                    DT: ""
                });
            }
            if (data && +data.EC != 1){
                return res.status(201).json({
                    EM: data.EM,
                    EC: data.EC,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: "Create account fail",
            EC: data.EC,
        });
    }
};

const getListPatient = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const data = await getPatientProfileList(user_id);
        if (data && +data.EC == 1) {
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
           });
        }
        if (data && +data.EC != 1) {
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: "Error from server",
            EC: -1,
            DT: "",
        });
    }
};

const handleDeletePatientProfile = async (req, res) => {
    try {
        const { patient_id, user_id } = req.body;
        const data = await deletePatientProfile(patient_id, user_id);
        
        if (data && +data.EC == 1) {
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
        if (data && +data.EC != 1) {
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: "Error from server",
            EC: -1,
            DT: "",
        });
    }
};

const getListPatientProfiles = async (req, res) => {
    try {
        const data = await getPatientProfilesList();
        if (data && +data.EC == 1) {
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
              });
            }
        if (data && +data.EC != 1) {
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: "Error from server",
            EC: -1,
            DT: "",
        });
    }
};

const handleUpdatePatientProfile = async (req, res) => {
    try {
        const { profile_id, full_name, dob, gender, phone_number, occupation, ethnicity } = req.body;
        const data = await handleUpdatePatientProfile(profile_id, full_name, dob, gender, phone_number, occupation, ethnicity);
        if (data && +data.EC == 1) {
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
                });
            }
        if (data && +data.EC != 1) {
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                EM: "Error from server",
                EC: -1,
                DT: "",
            });
        }
    };

module.exports = {
    createPatient,
    getListPatient,
    handleDeletePatientProfile,
    getListPatientProfiles,
    handleUpdatePatientProfile,
};