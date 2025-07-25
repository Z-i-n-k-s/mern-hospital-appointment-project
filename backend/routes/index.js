const express = require('express')

const router = express.Router()

const userSignUpController = require("../controller/User/userSignUp")
const userSignInController = require("../controller/User/userSignIn")
const userDetailsController = require('../controller/User/userDetails')
const authToken = require('../middleware/authToken')
const userLogout = require('../controller/User/userLogout')
const allUsers = require('../controller/User/allUsers')
const updateUser = require('../controller/User/updateUser')
const userSearchController = require('../controller/User/userSearch')
const userDeleteController = require('../controller/User/userDelete')

const updateProfile = require('../controller/User/updateProfile')


const uploadDoctorController = require('../controller/Doctor/uploadDoctors')
const getDoctorsController = require('../controller/Doctor/getDoctors')
const updateDoctorController = require('../controller/Doctor/updateDoctors')
const getCategoryDoctors = require('../controller/Doctor/getCatagoryDoctors')
const deleteDoctorController = require('../controller/Doctor/deleteDoctorController')


router.post("/signup",userSignUpController)
router.post("/signin",userSignInController)
router.get("/user-details",authToken,userDetailsController)
router.get("/userLogout",userLogout)


//admin panel
router.get("/all-user",authToken,allUsers)
router.post("/user-search",userSearchController)
router.post("/update-user",authToken,updateUser)
router.post("/update-profile",authToken,updateProfile)
router.post("/delete-user",authToken,userDeleteController)



//Doctors

router.post("/upload-doctor", authToken, uploadDoctorController);
router.get("/get-doctors", getDoctorsController);
router.post("/update-doctor", authToken, updateDoctorController);
router.get("/get-categoryDoctors", getCategoryDoctors);
router.delete('/delete-doctor', authToken, deleteDoctorController);



module.exports = router