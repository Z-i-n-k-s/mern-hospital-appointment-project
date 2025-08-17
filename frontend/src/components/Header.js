import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { setUserDetails } from "../store/userSlice";
import ROLE from "../common/role";
import ProfileDisplay from "./ProfileDisplay";

const Header = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

const handleLogout = async () => {
  try {
    const res = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: "include",
    });
    const data = await res.json();
    if (data.success) {
      toast.success(data.message);
      dispatch(setUserDetails(null));
      setMenuOpen(false);
      navigate("/");  
    } else if (data.error) {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error("Logout failed, please try again.");
  }
};

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-8">
        {/* Left: Logo + Project Name */}
        <Link to="/" className="flex items-center gap-3">
         
          <h1 className="text-2xl font-bold text-indigo-700 select-none">
            ChikitshaTrack
          </h1>
        </Link>

        {/* Right: User & Navigation */}
        <div className="flex items-center gap-6 relative">
          {user?._id ? (
            <>
              {/* User Avatar */}
              <button
                onClick={() => setMenuOpen((open) => !open)}
                className="relative flex items-center focus:outline-none"
                aria-haspopup="true"
                aria-expanded={menuOpen}
                aria-label="User menu"
              >
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-indigo-600 w-10 h-10" />
                )}
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div
                  className="absolute right-0 top-12 w-48 bg-white border border-gray-200 rounded shadow-lg py-2 text-sm"
                  role="menu"
                  aria-orientation="vertical"
                  aria-label="User menu options"
                >
                  {user.role === ROLE.ADMIN && (
                    <Link
                      to="/admin-panel/all-users"
                      className="block px-4 py-2 hover:bg-indigo-50"
                      onClick={() => setMenuOpen(false)}
                      role="menuitem"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setProfileOpen(true);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-indigo-50"
                    role="menuitem"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate("/prescriptions");
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-indigo-50"
                    role="menuitem"
                  >
                    Prescriptions
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Log In
            </Link>
          )}
        </div>

        {/* Profile Modal */}
        {profileOpen && user && (
          <ProfileDisplay
            onClose={() => setProfileOpen(false)}
            name={user.name}
            email={user.email}
            role={user.role}
            userId={user._id}
            profilePic={user.profilePic}
            callFunc={handleLogout}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
