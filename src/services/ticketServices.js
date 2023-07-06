const mysql = require("mysql2/promise");
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

const getMedicalTicketList = async () => {
    try {
        const connection = await mysql.createConnection(config);
        const [data] = await connection.query(`CALL getInforMedicalTicket()`);
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

const getMedicalTicketDetails = async (ticketID) => {
    try {
        const connection = await mysql.createConnection(config);
        const [data] = await connection.query(`CALL getMedicalTicketDetails(?)`, [ticketID]);
        connection.end();

        if (data && data.length > 0) {
            const ticketData = data.slice(0, -1).flat();
            return {
                EM: "Get ticket details success",
                EC: 1,
                DT: ticketData,
            }
        }
        else {
            return {
                EM: "Get ticket details failed",
                EC: 0,
                DT: [],
            }
        }
    } catch (error) {
        console.log("Get ticket details error: " + error);
        return {
            EM: "Error from service",
            EC: -1,
            DT: "",
        }
    }
}

const getMedicalTicketsByUserID = async (userID) => {
    try {
        const connection = await mysql.createConnection(config);
        const [data] = await connection.execute(`CALL getMedicalTicketsByUserID(?)`, [userID]);
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
    getMedicalTicketList,
    getMedicalTicketDetails,
    getMedicalTicketsByUserID,
    
}