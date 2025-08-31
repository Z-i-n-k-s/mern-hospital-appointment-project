import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ForgotPassword from "../pages/ForgotPassword";
import Home from "../pages/Home";
import Login from "../pages/Login";
import SignUP from "../pages/SignUP";
import Adminpanel from "../pages/Adminpanel";
import AllUsers from "../pages/AllUsers";
import AllDoctors from "../pages/AllDoctors";
import DoctorDetails from "../components/DoctorDetails";
import Prescriptions from "../pages/Prescriptions";
import AllAppointments from "../pages/AllAppointments";
import AllAnnouncement from "../pages/AllAnnouncement";

// New Doctor Panel Imports
import DoctorPanel from "../pages/DoctorPanel";
import AllPatientsAppointments from "../pages/AllPatientsAppointments";
import AllHealthTips from "../pages/AllHealthTips";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "sign-up",
        element: <SignUP />,
      },
      {
        path: "doctors/:id",
        element: <DoctorDetails />,
      },
      {
        path: "prescriptions",
        element: <Prescriptions />,
      },
      {
        path: "appointment",
        element: <AllAppointments />,
      },
      // Admin Panel Routes
      {
        path: "admin-panel",
        element: <Adminpanel />,
        children: [
          {
            path: "all-users",
            element: <AllUsers />,
          },
          {
            path: "all-doctors",
            element: <AllDoctors />,
          },
          {
            path: "all-announcement",
            element: <AllAnnouncement />,
          },
        ],
      },
      // Doctor Panel Routes
      {
        path: "doctor-panel",
        element: <DoctorPanel />,
        children: [
          {
            path: "all-patients-appointments",
            element: <AllPatientsAppointments />,
          },
          {
            path: "all-health-tips",
            element: <AllHealthTips />,
          },
        ],
      },
    ],
  },
]);

export default router;
