
const backendDomin = process.env.REACT_APP_BACKEND_URL; //"http://localhost:8080"

const SummaryApi = {
  signUP: {
    url: `${backendDomin}/api/signup`,
    method: "post",
  },
  signIn: {
    url: `${backendDomin}/api/signin`,
    method: "post",
  },
  current_user: {
    url: `${backendDomin}/api/user-details`,
    method: "get",
  },
  logout_user: {
    url: `${backendDomin}/api/userLogout`,
    method: "get",
  },
  allUser: {
    url: `${backendDomin}/api/all-user`,
    method: "get",
  },
  userSearch: {
    url: `${backendDomin}/api/user-search`,
    method: "post",
  },
  updateUser: {
    url: `${backendDomin}/api/update-user`,
    method: "post",
  },
  updateProfile: {
    url: `${backendDomin}/api/update-profile`,
    method: "post",
  },
  deleteUser: {
    url: `${backendDomin}/api/delete-user`,
    method: "post",
  },
  uploadDoctor: {
    url: `${backendDomin}/api/upload-doctor`,
    method: "post",
  },
  allDoctors: {
    url: `${backendDomin}/api/get-doctors`,
    method: "get",
  },
  updateDoctor: {
    url: `${backendDomin}/api/update-doctor`,
    method: "post",
  },
  categoryDoctors: {
    url: `${backendDomin}/api/get-categoryDoctors`,
    method: "get",
  },
  deleteDoctors: {
    url: `${backendDomin}/api/delete-doctor`,
    method: "delete",
  },
  getReview: {
    url: `${backendDomin}/api/get-review`,
    method: "get",
  },
  addReview: {
    url: `${backendDomin}/api/create-review`,
    method: "post",
  },
  updateReview: {
    url: `${backendDomin}/api/update-review`,
    method: "put",
  },
  deleteReview: {
    url: `${backendDomin}/api/delete-review`,
    method: "delete",
  },
  addPrescription: {
    url: `${backendDomin}/api/create-prescription`,
    method: "post",
  },
  updatePrescription: {
    url: `${backendDomin}/api/update-prescription`,
    method: "put",
  },
  deletePrescription: {
    url: `${backendDomin}/api/delete-prescription`,
    method: "delete",
  },
  getPrescriptionById: {
    url: `${backendDomin}/api/get-prescription`, 
    method: "get",
  },
  createHealthTip: {
    url: `${backendDomin}/api/create-health-tip`,
    method: "post",
  },
  getHealthTipsByPatientDoctor: {
    url: `${backendDomin}/api/get-health-tips-by-patient-doctor`,
    method: "post",
  },
  getHealthTipsByPatient: {
    url: `${backendDomin}/api/get-health-tips-by-patient`,
    method: "post",
  },
  getHealthTipsByDoctor: {
    url: `${backendDomin}/api/get-health-tips-by-doctor`,
    method: "post",
  },
  updateHealthTip: {
    url: `${backendDomin}/api/update-health-tip`,
    method: "put",
  },
  deleteHealthTip: {
    url: `${backendDomin}/api/delete-health-tip`,
    method: "delete",
  },
    createAppointment: {
    url: `${backendDomin}/api/create-appointment`,
    method: "post",
  },
  confirmAppointment: {
    url: `${backendDomin}/api/confirm-appointment`,
    method: "put",
  },
  cancelAppointment: {
    url: `${backendDomin}/api/cancel-appointment`,
    method: "put",
  },
  getAppointmentsByPatient: {
    url: `${backendDomin}/api/get-appointments-by-patient`,
    method: "post",
  },
  getAppointmentsByDoctor: {
    url: `${backendDomin}/api/get-appointments-by-doctor`,
    method: "post",
  },
};

export default SummaryApi;
