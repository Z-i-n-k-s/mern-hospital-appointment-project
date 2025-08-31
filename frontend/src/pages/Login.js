import React, { useContext, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import Context from "../context";
import { FiUser } from "react-icons/fi";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { fetchUserDetails } = useContext(Context);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => ({ ...preve, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const dataResponse = await fetch(SummaryApi.signIn.url, {
        method: SummaryApi.signIn.method,
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const dataApi = await dataResponse.json();

      if (dataApi.success) {
        toast.success(dataApi.message);

        // Fetch and store user details
        await fetchUserDetails();

        // Get user from your state (replace with Redux/Context selector if needed)
        const user = dataApi?.data || null; // optional fallback
        console.log(dataApi);

        // Determine role for redirect
        const role = user?.role; // should be "ADMIN", "DOCTOR", or undefined/other
        console.log(role);

        if (role === "ADMIN") {
          navigate("/admin-panel/all-users");
        } else if (role === "DOCTOR") {
          navigate("/doctor-panel/all-patients-appointments");
        } else {
          navigate("/"); // regular user
        }
      }

      if (dataApi.error) {
        toast.error(dataApi.message);
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="login"
      className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 flex items-center justify-center p-6 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-red-100 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-rose-100 rounded-full opacity-20 blur-3xl"></div>
      
      <div className="bg-white/80 backdrop-blur-sm p-12 max-w-md w-full rounded-2xl shadow-2xl border border-red-100 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-red-100 to-rose-100 text-red-500 text-5xl rounded-2xl shadow-lg">
            <FiUser />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-red-700 font-semibold text-sm">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleOnChange}
              required
              placeholder="Enter your email"
              className="w-full p-4 rounded-xl border-2 border-red-200 focus:border-red-400 outline-none bg-red-50/50 transition-all duration-300 placeholder:text-red-300 hover:border-red-300"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-red-700 font-semibold text-sm">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={data.password}
                onChange={handleOnChange}
                required
                placeholder="Enter your password"
                className="w-full p-4 pr-12 rounded-xl border-2 border-red-200 focus:border-red-400 outline-none bg-red-50/50 transition-all duration-300 placeholder:text-red-300 hover:border-red-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700 transition-colors duration-200 p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-red-600 hover:text-red-800 hover:underline transition-colors duration-200"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="
              bg-gradient-to-r from-red-500 via-red-600 to-red-700
              hover:from-red-600 hover:via-red-700 hover:to-red-800
              disabled:from-red-300 disabled:via-red-400 disabled:to-red-500
              text-white font-bold py-4 px-6
              rounded-xl shadow-lg
              transition-all duration-300 transform
              hover:scale-[1.02] hover:shadow-xl
              focus:outline-none focus:ring-4 focus:ring-red-300
              disabled:hover:scale-100 disabled:cursor-not-allowed
              relative overflow-hidden
            "
          >
            <span className={`transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
              Sign In
            </span>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-1 border-t border-red-200"></div>
          <span className="px-4 text-gray-500 text-sm">or</span>
          <div className="flex-1 border-t border-red-200"></div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/sign-up"
              className="text-red-600 font-semibold hover:text-red-800 hover:underline transition-colors duration-200"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;