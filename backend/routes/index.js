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
const createReviewController = require('../controller/Review/createReviewController')
const getReviewsController = require('../controller/Review/getReviewsController')
const updateReviewController = require('../controller/Review/updateReviewController')
const deleteReviewController = require('../controller/Review/deleteReviewController')
const createPrescriptionController = require('../controller/Prescriptions/createPrescriptionController')
const getPrescriptionByIdController = require('../controller/Prescriptions/getPrescriptionByIdController')
const updatePrescriptionController = require('../controller/Prescriptions/updatePrescriptionController')
const deletePrescriptionController = require('../controller/Prescriptions/deletePrescriptionController')
const createHealthTipController = require('../controller/HealthTips/createHealthTipController')
const getHealthTipsByPatientAndDoctor = require('../controller/HealthTips/getHealthTipsByPatientAndDoctorControlle')
const getHealthTipsByPatient = require('../controller/HealthTips/getHealthTipsByPatientController')
const getHealthTipsByDoctor = require('../controller/HealthTips/getHealthTipsByDoctorController')
const updateHealthTipController = require('../controller/HealthTips/updateHealthTipController')
const deleteHealthTipController = require('../controller/HealthTips/deleteHealthTipController')


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


//Review


router.post("/create-review",authToken, createReviewController);
router.get("/get-review", getReviewsController); 
router.put("/update-review",authToken, updateReviewController);
router.delete("/delete-review",authToken, deleteReviewController);

//Prescriptions


router.post("/create-prescription", authToken, createPrescriptionController);
router.get("/get-prescription", authToken, getPrescriptionByIdController);
router.put("/update-prescription/:id", authToken, updatePrescriptionController);
router.delete("/delete-prescription/:id", authToken, deletePrescriptionController);


// Health Tips Routes
router.post("/create-health-tip", authToken, createHealthTipController);
router.post("/get-health-tips-by-patient-doctor", getHealthTipsByPatientAndDoctor);
router.post("/get-health-tips-by-patient", getHealthTipsByPatient);
router.post("/get-health-tips-by-doctor", getHealthTipsByDoctor);
router.put("/update-health-tip", authToken, updateHealthTipController);
router.delete("/delete-health-tip", authToken, deleteHealthTipController);

module.exports = router