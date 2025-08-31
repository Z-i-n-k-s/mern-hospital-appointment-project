import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaUserDoctor } from "react-icons/fa6";
import { Link, Outlet, useNavigate } from 'react-router-dom';
import ROLE from '../common/role.js';

const DoctorPanel = () => {
  const user = useSelector((state) => state?.user?.user);
  const navigate = useNavigate();
  console.log(user)

  useEffect(() => {
    if (user?.role !== ROLE.DOCTOR) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-[calc(100vh-120px)] md:flex hidden">
      {/* Sidebar */}
      <aside className="bg-white min-h-full w-full max-w-60 customShadow">
        <div className="h-32 flex justify-center items-center flex-col">
          <div className="text-5xl cursor-pointer relative flex justify-center">
            {user?.profilePic ? (
              <img
                src={user?.profilePic}
                className="w-20 h-20 rounded-full"
                alt={user?.name}
              />
            ) : (
              <FaUserDoctor />
            )}
          </div>
          <p className="capitalize text-lg font-bold">{user?.name}</p>
          <p className="text-sm">{user?.role}</p>
        </div>

        {/* Navigation */}
        <div>
          <nav className="grid p-4">
            <Link
              to={"all-patients-appointments"}
              className="px-2 py-1 hover:bg-slate-100"
            >
              All Patients Appointments
            </Link>
            <Link
              to={"all-health-tips"}
              className="px-2 py-1 hover:bg-slate-100"
            >
              Asked Health Tips
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-full h-full p-2">
        <Outlet />
      </main>
    </div>
  );
};

export default DoctorPanel;
