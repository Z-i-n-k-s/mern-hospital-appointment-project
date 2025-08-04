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






const router  = createBrowserRouter([
    {
        path : "/",
        element : <App/>,
        children: [
            {
                path: "",
                element: <Home/>
            },
            {
                path: "login",
                element : <Login/>
            },
            {
                path: "forgot-password",
                element: <ForgotPassword/>
            },
            {
                path: "sign-up",
                element: <SignUP/>
            },
            {
                path: "doctors/:id",
                element: <DoctorDetails/>
            },
            {
                path: "admin-panel",
                element: <Adminpanel/>,
                children:[
                    {
                        path: "all-users",
                        element: <AllUsers/>
                    },
                    {
                        path: "all-doctors",
                        element: <AllDoctors/>
                    }
                ]
            },
          

        ]
        
    }
])

export default router