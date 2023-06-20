const mysql = require("mysql2/promise");
const config = require("../config/configDatabase");
const e = require("express");

const createDoctor = async (
    doctorName,
    doctorGender,
    doctorRoom,
    doctorSpecialtyList,
) => {
    try {
        const connection = await mysql.createConnection(config);
        const data = await connection.execute(`CALL addDoctorWithSpecialties(?, ?, ?, ?)`, [doctorName, doctorGender, doctorRoom, doctorSpecialtyList]);
        connection.end();
        
        if (data && data.length > 0) {
            return {
                EM: "Create doctor success",
                EC: 1,
            }
        }
        else {
            return {
                EM: "Create doctor failed",
                EC: 0,
            }
        }
    } catch (error) {
        console.log("Create doctor error: " + error);
        return {
            EM: "Error from service",
            EC: -1,
        }
    }
};

// const 

module.exports = {
    createDoctor,

};