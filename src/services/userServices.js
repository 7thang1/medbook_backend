const mysql = require("mysql2/promise");
const config = require("../config/configDatabase");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);

// const hashPassword = (userPassword) => {
//     let hashPassword = bcrypt.hashSync(userPassword, salt);
//     return hashPassword;
// };

const createNewUser = async (
    userName,
    fullName,
    passwd
) => {
    try {
        // let hashPasswordUser = hashPassword(passwd);
        const connection = await mysql.createConnection(config);

        let checkUserExists = await connection.query(
            `CALL CheckUserExists('${userName}', @exists)`
        );
        
        // Lấy kết quả kiểm tra từ biến @exists
        let result = await connection.query(`SELECT @exists`);
        let exists = result[0][0]['@exists'];
        
        if (exists) {
            return {
                EM: "User already exists",
                EC: 0,
            };
        }
        let data = await connection.query(
            `CALL createUser('${userName}', '${fullName}', '${passwd}')`
        );
        connection.end();
        if (data) {
            return {
                EM: "Create user success",
                EC: 1,
            };
        } else {
            return {
                EM: "Create user fail",
                EC: 0,
            };
        }
    } catch (error) {
        console.log("Create new user error: " + error);
        return {
            EM: "Error from service",
            EC: -1,
            DT: ""
        };
    }
};


const checkUser = async (userName) => {
    try {
        const connection = await mysql.createConnection(config);
        const [rows] = await connection.query('CALL checkUserExists(?, @exists)', [userName]);
        const [result] = await connection.query('SELECT @exists AS user_exists');
        connection.end();
        
        const userExists = result[0].user_exists;
        
        return {
            EM: "Check user success",
            EC: userExists ? 1 : 0,
            DT: userExists,
        };
    } catch (error) {
        console.log("Check user error: " + error);
        return {
            EM: "Check user fail",
            EC: -1,
            DT: "",
        };
    }
};

const getUserList = async () => {
    try {
        const connection = await mysql.createConnection(config);
        const [data] = await connection.execute('CALL getUserList()');
        connection.end();
        
        if (data && data.length > 0) {
            // Loại bỏ phần metadata
            const userList = data.slice(0, -1).flat();
            
            return {
                EM: 'Get all user success',
                EC: 1,
                DT: userList,
            };
        } else {
            return {
                EM: 'Get all user fail',
                EC: 0,
                DT: [],
            };
        }
    } catch (error) {
        console.log('Get all user error: ' + error);
        return {
            EM: 'Get data fail',
            EC: -1,
            DT: '',
        };
    }
};


const getUserbyUsername = async (userName) => {
    try {
        // console.log(userName);
        const connection = await mysql.createConnection(config);
        let [data] = await connection.execute(`CALL getUserbyUsername('${userName}')`);
        connection.end();
        if (data && data.length > 0) {
            return {
                EM: "Get user success",
                EC: 1,
                DT: data.slice(0, -1).flat(),
            };
        } else {
            return {
                EM: "Get user fail",
                EC: 0,
                DT: [],
            };
        }
    } catch (error) {
        console.log("Get user by email error: " + error);
        return {
            EM: "Get data fail",
            EC: -1,
            DT: "",
        };
    }
};


const getInforLoginUser = async()=> {
    try {
        const connection = await mysql.createConnection(config);
        const [data] = await connection.execute(`CALL getInforLoginUser()`);
        connection.end();
        const loginUserData = data.slice(0, -1).flat();
        console.log(loginUserData);
        if (loginUserData && loginUserData.length > 0) {
            return {
                EM: "Get user success",
                EC: 1,
                DT: loginUserData,
            };
        } else {
            return {
                EM: "Get user fail",
                EC: 0,
                DT: [],
            };
        }
    } catch (error) {
        console.log("Get infor login user error: " + error);
        return {
            EM: "Get data fail",
            EC: 0,
            DT: "",
        };
    }
};

const checkLogin = async (userName, userPassword) => {
    try {
        // console.log(userName, userPassword);
        const connection = await mysql.createConnection(config);
        const [rows] = await connection.query('CALL getInforLoginUser()');
        connection.end();
        // console.log(rows);
        const data = rows.slice(0, -1).flat();
        // a = data.slice(0, -1);
        // nestedArray = a.flat();
        console.log(data);
        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              
            //   console.log(data);
              if (data[i].user_name == userName && data[i].password == userPassword) {
                return {
                  EM: 'Login success',
                  EC: 1,
                  DT: data[i],
                };
              }
            }
          }
          return {
            EM: 'Login fail, username or password is incorrect',
            EC: -1,
            DT: [],
          };
        } catch (error) {
          console.log('Check login error: ' + error);
          return {
            EM: 'Service error',
            EC: -1,
            DT: '',
          };
        }
      };

const updatePassword = async (userName, currentPassword, newPassword) => {
    try {
        const connection = await mysql.createConnection(config);
        // let hashPasswordUser = hashPassword(passwd);
        const data = await connection.execute(`CALL updateUserPassword('${userName}', '${currentPassword}', '${newPassword}')`);
        connection.end();
        // console.log(data);
        if (data) {
            return {
                EM: "Update password success",
                EC: 1,
                DT: data,
            };
        } else {
            return {
                EM: "Update password fail",
                EC: 0,
                DT: [],
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: "Service error",
            EC: -1,
            DT: "",
        };
    }
};

const validateUser = async (userName, fullName) => {
    try {
        const connection = await mysql.createConnection(config);
        const data = await connection.execute(`CALL validateUser('${userName}', '${fullName}', @p_user_id)`);
        const results = await connection.query('SELECT @p_user_id AS user_id');
        connection.end();
        // console.log(results);
        if (results && results.length > 0) {
            const userId = results.slice(0, -1).flat();
            // console.log(userId);
            return {
                EM: "Validate user success",
                EC: 1,
                DT: userId,
            };
        }
        else {
            return {
                EM: "Validate user fail",
                EC: 0,
                DT: [],
            }
        }
    } catch (error){
        console.log(error);
        return {
            EM: "Service error",
            EC: -1,
            DT: "",
        }
    }
};

const resetPassword = async (userID, resetPassword) => {
    try {
        const connection = await mysql.createConnection(config);
        const [data] = await connection.execute(`CALL resetPassword('${userID}', '${resetPassword}')`);
        connection.end();
        if (data) {
            return {
                EM: "Reset password success",
                EC: 1,
            };
        }
        else {
            return {
                EM: "Reset password fail",
                EC: 0,
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: "Service error",
            EC: -1,
        };
    }
};

const updateUserInfor = async (userID, fullName, phoneNumber, email) => {
    try {
        const connection = await mysql.createConnection(config);
        const data = await connection.execute(`CALL updateUserInfor('${userID}', '${fullName}', '${phoneNumber}', '${email}')`);
        connection.end();
        if (data) {
            return {
                EM: "Update user information success",
                EC: 1,
            };
        }
        else {
            return {
                EM: "Update user information fail",
                EC: 0,
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: "Service error",
            EC: -1,
        };
    }
};

const deleteUser = async (userID) => {
    try {
        const connection = await mysql.createConnection(config);
        const data = await connection.execute(`CALL deleteUser('${userID}')`);
        connection.end();
        if (data) {
            return {
                EM: "Delete user success",
                EC: 1,
            };
        }
        else {
            return {
                EM: "Delete user fail",
                EC: 0,
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: "Service error",
            EC: -1,
        };
    }

};

module.exports = {
    createNewUser,
    checkUser,
    getUserList,
    getUserbyUsername,
    checkLogin,
    getInforLoginUser,
    updatePassword,
    validateUser,
    resetPassword,
    updateUserInfor,
    deleteUser,
};
