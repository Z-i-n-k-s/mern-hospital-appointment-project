import React, { useState } from "react";
import { CgClose } from "react-icons/cg";
import doctorCategory from "../helpers/doctorCategory";
import imageTobase64 from "../helpers/imageTobase64";
import DisplayImage from "./DisplayImage";
import { FaCloudUploadAlt } from "react-icons/fa";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const UploadDoctor = ({ onClose, fetchData }) => {
  const [data, setData] = useState({
    fullName: "",
    category: "",
    specialization: "",
    gender: "",
    email: "",
    phone: "",
    qualification: "",
    experience: "",
    chamberAddress: "",
    availableDays: [],
    bio: "",
    fee: "",
    profileImage: "",
    password: "" // added
  });

  const [timeRange, setTimeRange] = useState({ from: "", to: "" });
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvailableDaysChange = (e) => {
    const { value, checked } = e.target;
    setData((prev) => {
      const days = new Set(prev.availableDays);
      checked ? days.add(value) : days.delete(value);
      return { ...prev, availableDays: [...days] };
    });
  };

  const handleUploadProfilePic = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const base64Pic = await imageTobase64(file);
    setData((prev) => ({ ...prev, profileImage: base64Pic }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.fullName || !data.category || !data.email || !data.phone || !data.password) {
      toast.error("Please fill all required fields");
      return;
    }

    if (data.fee && Number(data.fee) < 0) {
      toast.error("Fee cannot be negative");
      return;
    }

    const payload = {
      ...data,
      availableTime: timeRange.from && timeRange.to ? `${timeRange.from} - ${timeRange.to}` : ""
    };

    try {
      const res = await fetch(SummaryApi.uploadDoctor.url, {
        method: SummaryApi.uploadDoctor.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        toast.success(json.message);
        onClose();
        fetchData();
      } else {
        toast.error(json.message);
      }
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  const weekDays = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-semibold">Add New Doctor</h2>
          <CgClose className="text-2xl cursor-pointer hover:text-red-600" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Required Fields */}
          <div className="space-y-2">
            <label className="font-medium">Full Name<span className="text-red-500">*</span></label>
            <input type="text" name="fullName" value={data.fullName} onChange={handleOnChange}
              className="w-full p-3 border rounded" placeholder="e.g. Dr. John Doe" required />
          </div>

          <div className="space-y-2">
            <label className="font-medium">Email<span className="text-red-500">*</span></label>
            <input type="email" name="email" value={data.email} onChange={handleOnChange}
              className="w-full p-3 border rounded" placeholder="name@example.com" required />
          </div>

          <div className="space-y-2">
            <label className="font-medium">Password<span className="text-red-500">*</span></label>
            <input type="password" name="password" value={data.password} onChange={handleOnChange}
              className="w-full p-3 border rounded" placeholder="Create a password" required />
          </div>

          {/* Dropdowns */}
          <div className="space-y-2">
            <label className="font-medium">Category<span className="text-red-500">*</span></label>
            <select name="category" value={data.category} onChange={handleOnChange}
              className="w-full p-3 border rounded" required>
              <option value="">Select Category</option>
              {doctorCategory.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="font-medium">Gender</label>
            <select name="gender" value={data.gender} onChange={handleOnChange}
              className="w-full p-3 border rounded">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="font-medium">Specialization</label>
            <input type="text" name="specialization" value={data.specialization} onChange={handleOnChange}
              className="w-full p-3 border rounded" placeholder="e.g. Pediatric Cardiology" />
          </div>

          <div className="space-y-2">
            <label className="font-medium">Phone<span className="text-red-500">*</span></label>
            <input type="tel" name="phone" value={data.phone} onChange={handleOnChange}
              className="w-full p-3 border rounded" placeholder="e.g. +8801XXXXXXXXX" required />
          </div>

          <div className="space-y-2">
            <label className="font-medium">Qualification</label>
            <input type="text" name="qualification" value={data.qualification} onChange={handleOnChange}
              className="w-full p-3 border rounded" placeholder="e.g. MBBS, FCPS" />
          </div>

          <div className="space-y-2">
            <label className="font-medium">Experience (years)</label>
            <input type="number" name="experience" value={data.experience} onChange={handleOnChange}
              className="w-full p-3 border rounded" placeholder="e.g. 5" min="0" />
          </div>

          <div className="space-y-2">
            <label className="font-medium">Chamber Address</label>
            <input type="text" name="chamberAddress" value={data.chamberAddress} onChange={handleOnChange}
              className="w-full p-3 border rounded" placeholder="Full address" />
          </div>

          {/* Days */}
          <div className="col-span-1 md:col-span-2 space-y-2">
            <label className="font-medium">Available Days</label>
            <div className="flex flex-wrap gap-4">
              {weekDays.map((day) => (
                <label key={day} className="inline-flex items-center">
                  <input type="checkbox" value={day} checked={data.availableDays.includes(day)}
                    onChange={handleAvailableDaysChange} className="form-checkbox h-5 w-5" />
                  <span className="ml-2">{day}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Time */}
          <div className="space-y-2">
            <label className="font-medium">Available Time</label>
            <div className="flex gap-2">
              <input type="time" value={timeRange.from} onChange={(e) =>
                setTimeRange((prev) => ({ ...prev, from: e.target.value }))}
                className="p-3 border rounded" />
              <span className="self-center">to</span>
              <input type="time" value={timeRange.to} onChange={(e) =>
                setTimeRange((prev) => ({ ...prev, to: e.target.value }))}
                className="p-3 border rounded" />
            </div>
          </div>

          {/* Profile Image */}
          <div className="col-span-1 md:col-span-2 space-y-2">
            <label className="font-medium">Profile Image</label>
            <div className="flex items-center gap-4">
              <label htmlFor="uploadProfileImageInput" className="cursor-pointer">
                <div className="w-32 h-32 bg-gray-100 border border-dashed rounded flex justify-center items-center hover:bg-gray-200">
                  {data.profileImage ? (
                    <img src={data.profileImage} alt="Preview" className="w-full h-full object-cover rounded"
                      onClick={() => {
                        setFullScreenImage(data.profileImage);
                        setOpenFullScreenImage(true);
                      }} />
                  ) : (
                    <div className="flex flex-col items-center text-gray-500">
                      <FaCloudUploadAlt className="text-3xl" />
                      <p>Click to upload</p>
                    </div>
                  )}
                </div>
                <input type="file" id="uploadProfileImageInput" className="hidden" onChange={handleUploadProfilePic} accept="image/*" />
              </label>
              {data.profileImage && (
                <button type="button" onClick={() => setData((prev) => ({ ...prev, profileImage: "" }))}
                  className="text-red-600 hover:underline">Remove Image</button>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="col-span-1 md:col-span-2 space-y-2">
            <label className="font-medium">Bio</label>
            <textarea name="bio" value={data.bio} onChange={handleOnChange} rows={4}
              className="w-full p-3 border rounded resize-none" placeholder="Short biography or description" />
          </div>

          {/* Fee */}
          <div className="space-y-2">
            <label className="font-medium">Consultation Fee</label>
            <input type="number" name="fee" value={data.fee} onChange={handleOnChange}
              className="w-full p-3 border rounded" placeholder="e.g. 500" />
          </div>

          {/* Submit */}
          <div className="col-span-1 md:col-span-2 flex justify-end">
            <button type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">
              Upload Doctor
            </button>
          </div>
        </form>

        {openFullScreenImage && (
          <DisplayImage imgUrl={fullScreenImage} onClose={() => setOpenFullScreenImage(false)} />
        )}
      </div>
    </div>
  );
};

export default UploadDoctor;
