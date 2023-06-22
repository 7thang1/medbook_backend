const mysql = require("mysql2");
const config = require("../config/configDatabase");

const createTicket = async (
    patientID,
    doctorID,
    doctorSpecialtyID,
    doctorRoomID,
    dateID,
    timeslotID
) => {
    try {
        const connection = await mysql.createConnection(config);
        const [data] = await connection.execute(`CALL addMedicalTicket(?, ?, ?, ?, ?, ?)`,
        [patientID, doctorID, doctorSpecialtyID, doctorRoomID, dateID, timeslotID]);
        connection.end();

        if (data && data.length > 0) {
            const dataReturn = data.slice(0, 1).flat();
            return {
                EM: "Create ticket success",
                EC: 1,
                DT: dataReturn,
            }
        }
        else {
            return {
                EM: "Create ticket failed",
                EC: 0,
                DT: [],
            }
        }
    } catch (error) {
        console.log("Create ticket error: " + error);
        return {
            EM: "Error from service",
            EC: -1,
            DT: "",
        }
    }
};

const getInforMedicalTicket = async () => {
    try {
        const connection = await mysql.createConnection(config);
        const [data] = await connection.execute(`CALL getInforMedicalTicket()`);
        connection.end();

        if (data && data.length > 0) {
            const ticketData = data.slice(0, -1).flat();
            return {
                EM: "Get ticket list success",
                EC: 1,
                DT: ticketData,
            }
        }
        else {
            return {
                EM: "Get ticket list failed",
                EC: 0,
                DT: [],
            }
        }
    } catch (error) {
        console.log("Get ticket list error: " + error);
        return {
            EM: "Error from service",
            EC: -1,
            DT: "",
        }
    }
};


module.exports = {
    createTicket,
    getInforMedicalTicket,
}