const mysql = require('mysql2/promise');
const config = require('../config/configDatabase');

const createPatientProfile = async (
    user_id,
    full_name,
    date_of_birth,
    gender,
    phone_number,
    address,
    occupation,
    ethnicity,
) => {
    try {
        const connection = await mysql.createConnection(config);
        let data = await connection.query(
            `CALL createPatientProfile('${user_id}', '${full_name}', '${date_of_birth}', '${gender}', '${phone_number}', '${address}', '${occupation}', '${ethnicity}')`
        );
        connection.end();
        if (data) {
            return {
                EM: "Create patient profile success",
                EC: 1,
            };
        }
        else {
            return {
                EM: "Create patient profile fail",
                EC: 0,
            };
        }
    } catch (error) {
        console.log("Create patient profile error: " + error);
        return {
            EM: "Error from service",
            EC: -1,
            DT: ""
        };
        
    }
};

const getPatientProfileList = async (user_id) => {
    try {
        const connection = await mysql.createConnection(config);
        const [data] = await connection.query(`CALL getUserPatientProfiles('${user_id}')`);
        connection.end();
        if (data && data.length > 0) {
            const patientProfilesListData = data.slice(0, -1).flat();
            return {
                EM: "Get patient profile list success",
                EC: 1,
                DT: patientProfilesListData,
            };
        } else {
            return {
                EM: "Get patient profile list fail",
                EC: 0,
                DT: "",
            };
        }
    } catch (error) {
        console.log("Get patient profile list error: " + error);
        return {
            EM: "Get patient profile list fail",
            EC: -1,
            DT: "",
        };
    }
};

const deletePatientProfile = async (patientID, userID) => {
    try {
        const connection = await mysql.createConnection(config);
        const data = await connection.query(`CALL deletePatientProfile('${patientID}', '${userID}', @p_state)`);
        const results = await connection.query('SELECT @p_state AS state');
        connection.end();
        if (results && results.length > 0) {
            const value = results.slice(0, -1).flat();
            return {
                EM: "Delete patient profile success",
                EC: 1,
                DT: value,
            };
        } else {
            return {
                EM: "Delete patient profile fail",
                EC: 0,
                DT: "",
            };
        }
    } catch (error) {
    }
};

const getPatientProfilesList = async () => {
    try {
        const connection = await mysql.createConnection(config);
        const [data] = await connection.query(`CALL getAllPatientProfiles()`);
        connection.end();
        if (data && data.length > 0) {
            const patientProfilesListData = data.slice(0, -1).flat();
            return {
                EM: "Get patient profile list success",
                EC: 1,
                DT: patientProfilesListData,
            };
        } else {
            return {
                EM: "Get patient profile list fail",
                EC: 0,
                DT: [],
            };
        }
    } catch (error) {
        console.log("Get patient profile list error: " + error);
        return {
            EM: "Get patient profile list fail",
            EC: -1,
            DT: "",
        };
    }
};

const updatePatientProfile = async (profileID, fullName, dateOfBirth, gender, phoneNum, occupation, ethnicity) => {
    try {
        const connection = await mysql.createConnection(config);
        const data = await connection.execute(`CALL updatePatientProfile('${profileID}', '${fullName}', '${dateOfBirth}', '${gender}', '${phoneNum}', '${occupation}', '${ethnicity}')`);
        connection.end();
        if (data) {
            return {
                EM: "Update patient profile success",
                EC: 1,
            };
        }
        else {
            return {
                EM: "Update patient profile fail",
                EC: 0,
            };
        }
    } catch (error) {
        console.log("Update patient profile error: " + error);
        return {
            EM: "Error from service",
            EC: -1,
            DT: ""
        };
    }
};

const getPatientProfileDetails = async (profileID) => {
    try {
        const connection = await mysql.createConnection(config);
        const [data] = await connection.query(`CALL getPatientDetails('${profileID}')`);
        connection.end();

        if (data && data.length > 0){
            const profileData = data.slice(0, -1).flat();

            return {
                EM: 'Get profile details success',
                EC: 1,
                DT: profileData
            }
        }
        else {
            return {
                EM: 'Get profile details fail',
                EC: 0,
                DT: []
            }
        }
    } catch (error){
        console.log('Get profile details error:'+ error);
        return {
            EM: 'Error from service',
            EC: -1,
            DT: ""
        }
    }
};

module.exports = {
    createPatientProfile,
    getPatientProfileList,
    getPatientProfileDetails,
    deletePatientProfile,
    getPatientProfilesList,
    updatePatientProfile,
};