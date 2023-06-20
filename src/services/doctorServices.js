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


const createDoctorSchedule = async (
    doctorID,
    doctorSpecialtyID,
    doctorScheduleDate,
    doctorStartTimeslot,
    doctorEndTimeslot,
) => {
    try {
        const connection = await mysql.createConnection(config);
        const data = await connection.execute(`CALL addDoctorSchedule(?, ?, ?, ?, ?)`,
        [doctorID, doctorSpecialtyID, doctorScheduleDate, doctorStartTimeslot, doctorEndTimeslot]);
        connection.end();

        if (data && data.length > 0) {
            return {
                EM: "Create doctor schedule success",
                EC: 1,
            }
        }
        else {
            return {
                EM: "Create doctor schedule failed",
                EC: 0,
            }
        }
    } catch (error) {
        console.log("Create doctor schedule error: " + error);
        return {
            EM: "Error from service",
            EC: -1,
        }
    }
};


const getDoctorList = async () => {
    try {
        const connection = await mysql.createConnection(config);
        const [data] = await connection.execute(`CALL getDoctorSpecialties()`);
        connection.end();

        if (data && data.length > 0) {
            const doctorListData = data.slice(0, -1).flat();
            return {
                EM: "Get doctor specialty success",
                EC: 1,
                DT: doctorListData,
            }
        }
        else {
            return {
                EM: "Get doctor specialty failed",
                EC: 0,
                DT: [],
            }
        }
     } catch (error) {
        console.log("Get doctor specialty error: " + error);
        return {
            EM: "Error from service",
            EC: -1,
            DT: "",
        }
    }
};

const getSpecialtyList = async () => {
    try {
        const connection = await mysql.createConnection(config);
        const [data] = await connection.execute(`CALL getSpecialtyList()`);
        connection.end();

        if (data && data.length > 0) {
            const specialtyListData = data.slice(0, -1).flat();
            return {
                EM: "Get specialty list success",
                EC: 1,
                DT: specialtyListData,
            }
        }
        else {
            return {
                EM: "Get specialty list failed",
                EC: 0,
                DT: [],
            }
        }
    } catch (error) {
        console.log("Get specialty list error: " + error);
        return {
            EM: "Error from service",
            EC: -1,
            DT: "",
        }
    }
};

module.exports = {
    createDoctor,
    createDoctorSchedule,
    getDoctorList,
    getSpecialtyList,
};