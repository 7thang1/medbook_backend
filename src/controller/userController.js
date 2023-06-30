const {
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
} = require("../services/userServices");

const createUser = async (req, res) => {
    try {
        const {
            user_name,
            full_name,
            user_password
        } = req.body;
        const data = await createNewUser(
            user_name,
            full_name,
            user_password
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

const checkUserExists = async (req, res) => {
    try {
        const username = req.params.user_name;
        const result = await checkUser(username);
        
        res.status(200).json(result);
    } catch (error) {
        console.log("Check user error: " + error);
        res.status(500).json({
            EM: "Check user fail",
            EC: -1,
            DT: "",
        });
    }
};

const getAllUser = async (req, res) => {
    try {
        const data = await getUserList();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            EM: "Error from server",
            EC: -1,
            DT: "",
        });
    }
};

const getInforLogin = async (req, res) => {
    try {
        const data = await getInforLoginUser();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({
            EM: "Error from server",
            EC: -1,
            DT: "",
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { userName, userPassword } = req.body;
        const data = await checkLogin(userName, userPassword);
        if (data && +data.EC != 1){
            return res.status (200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: "Error from server",
            EC: -1,
            DT: "",
        });
    }
};

const getUserByUsername = async (req, res) => {
    try {
        const user_name = req.params.user_name;
        // console.log(user_name);
        const data = await getUserbyUsername(user_name);
        if (data && +data.EC == 1){
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
        if (data && +data.EC != 1){
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

const passwordUpdate = async (req, res) => {
    try {
        const user_name = req.params.user_name;
        const { currentPass,
                newPass } = req.body;
        // console.log(user_name,password);
        const data = await updatePassword(user_name, currentPass, newPass);
        if (data && +data.EC == 1){
            return res.status(201).json({
                EM: data.EM,
                EC: 1,
                DT: data.DT,
            });
        }
        if (data && +data.EC != 1){
            return res.status(201).json({
                EM: data.EM,
                EC: data.EC,
            });
        }
    } catch (error){
        console.log(error);
        return res.status(500).json({
            EM: "Error from server",
            EC: -1,
        });
    }
};

const validateUserAccount = async (req, res) => {
    try {
        const { user_name, user_fullname } = req.body;
        const data = await validateUser(user_name, user_fullname);
        if (data && +data.EC == 1){
            return res.status(201).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
        if (data && +data.EC != 1){
            return res.status(201).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        }
    } catch (error){
        console.log(error);
        return res.status(500).json({
            EM: "Error from server",
            EC: -1,
        });
    }
};

const resetPasswordAccount = async (req, res) => {
    try {
        const { user_id, reset_password } = req.body;
        const data = await resetPassword(user_id, reset_password);
        if (data && +data.EC == 1){
            return res.status(201).json({
                EM: data.EM,
                EC: data.EC,
            });
        }
        if (data && +data.EC != 1){
            return res.status(201).json({
                EM: data.EM,
                EC: data.EC,
            });
        }
    } catch (error){
        console.log(error);
        return res.status(500).json({
            EM: "Error from server",
            EC: -1,
        });
    }
};

const handleUpdateUser = async (req, res) => {
    try {
        const { user_id, user_fullname, user_phone, user_email } = req.body;
        const data = await updateUserInfor(user_id, user_fullname, user_phone, user_email);
        if (data && +data.EC == 1){
            return res.status(201).json({
                EM: data.EM,
                EC: data.EC,
            });
        }
        if (data && +data.EC != 1){
            return res.status(201).json({
                EM: data.EM,
                EC: data.EC,
            });
        }
    } catch (error){
        console.log(error);
        return res.status(500).json({
            EM: "Error from server",
            EC: -1,
        });
    }
};

const handleDeleteUser = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const data = await deleteUser(user_id);
        if (data && +data.EC == 1){
            return res.status(201).json({
                EM: data.EM,
                EC: data.EC,
            });
        }
        if (data && +data.EC != 1){
            return res.status(201).json({
                EM: data.EM,
                EC: data.EC,
            });
        }
    } catch (error){
        console.log(error);
        return res.status(500).json({
            EM: "Error from server",
            EC: -1,
        });
    }
};

module.exports = {
    createUser,
    checkUserExists,
    getAllUser,
    getUserByUsername,
    loginUser,
    getInforLogin,
    passwordUpdate,
    validateUserAccount,
    resetPasswordAccount,
    handleUpdateUser,
    handleDeleteUser
};