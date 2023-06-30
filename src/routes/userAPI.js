const express = require('express');
const router = express.Router();
const {
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
    handleDeleteUser,
} = require("../controller/userController");

router.route("/register").post(createUser);                     //1
router.route("/usercheck/:username").get(checkUserExists);                //2
router.route("/login").post(loginUser);                         //3
router.route("/get/list").get(getAllUser);                      //4
router.route("/get/login").get(getInforLogin);                  //5
router.route("/get/username/:user_name").get(getUserByUsername);//6
router.route("/update/password/:user_name").put(passwordUpdate);//7
router.route("/validateuser").post(validateUserAccount);        //8
router.route("/resetpassword").put(resetPasswordAccount);       //9
router.route("/updateuserinfor").put(handleUpdateUser);         //10
router.route("/deleteuser/:user_id").delete(handleDeleteUser);  //11

module.exports = router;