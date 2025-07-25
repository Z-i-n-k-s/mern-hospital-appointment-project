import React, { useState } from 'react';
import { CgClose } from 'react-icons/cg';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import doctorCategory from '../helpers/doctorCategory';
import imageTobase64 from '../helpers/imageTobase64';
import DisplayImage from './DisplayImage';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const AdminEditDoctor = ({ onClose, doctordata, fetchData }) => {
  const [data, setData] = useState({
    ...doctordata,
    // Normalize profileImage into an array for UI mapping
    profileImage: Array.isArray(doctordata.profileImage)
      ? doctordata.profileImage
      : doctordata.profileImage
        ? [doctordata.profileImage]
        : [],
  });

  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState('');

  const handleOnChange = e => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvailableDaysChange = e => {
    const { value, checked } = e.target;
    setData(prev => {
      const days = new Set(prev.availableDays || []);
      checked ? days.add(value) : days.delete(value);
      return { ...prev, availableDays: Array.from(days) };
    });
  };

  const handleUploadProfileImage = async e => {
    const file = e.target.files[0];
    if (!file) return;
    const b64 = await imageTobase64(file);
    setData(prev => ({
      ...prev,
      profileImage: [...prev.profileImage, b64],
    }));
  };

  const handleDeleteProfileImage = index => {
    setData(prev => {
      const imgs = [...prev.profileImage];
      imgs.splice(index, 1);
      return { ...prev, profileImage: imgs };
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // Prepare payload: send single string for profileImage
    const payload = {
      ...data,
      profileImage: data.profileImage[0] || '',
    };

    try {
      const res = await fetch(SummaryApi.updateDoctor.url, {
        method: SummaryApi.updateDoctor.method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
      toast.error('Update failed');
    }
  };

  const weekDays = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

  return (
    <div className="fixed inset-0 bg-slate-200 bg-opacity-35 flex justify-center items-center">
      <div className="bg-white p-4 rounded w-full max-w-3xl h-full max-h-[90%] overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">Edit Doctor</h2>
          <CgClose
            className="text-2xl hover:text-red-600 cursor-pointer"
            onClick={onClose}
          />
        </div>

        <form onSubmit={handleSubmit} className="grid gap-3 h-full overflow-y-auto pb-5">
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={data.fullName || ''}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label>Category:</label>
          <select
            name="category"
            value={data.category || ''}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          >
            <option value="">Select Category</option>
            {doctorCategory.map((c, i) => (
              <option key={c.value + i} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <label>Specialization:</label>
          <input
            type="text"
            name="specialization"
            value={data.specialization || ''}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
          />

          <label>Gender:</label>
          <select
            name="gender"
            value={data.gender || ''}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={data.email || ''}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={data.phone || ''}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label>Qualification:</label>
          <input
            type="text"
            name="qualification"
            value={data.qualification || ''}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
          />

          <label>Experience (years):</label>
          <input
            type="number"
            name="experience"
            value={data.experience || ''}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
          />

          <label>Chamber Address:</label>
          <input
            type="text"
            name="chamberAddress"
            value={data.chamberAddress || ''}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
          />

          <label>Available Days:</label>
          <div className="flex flex-wrap gap-2">
            {weekDays.map(day => (
              <label key={day} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  value={day}
                  checked={(data.availableDays || []).includes(day)}
                  onChange={handleAvailableDaysChange}
                />
                {day}
              </label>
            ))}
          </div>

          <label>Available Time:</label>
          <input
            type="text"
            name="availableTime"
            value={data.availableTime || ''}
            onChange={handleOnChange}
            placeholder="e.g. 10:00 AM - 2:00 PM"
            className="p-2 bg-slate-100 border rounded"
          />

          <label>Profile Image:</label>
          <label htmlFor="uploadProfileImageInput" className="cursor-pointer">
            <div className="p-2 bg-slate-100 border rounded h-32 flex justify-center items-center">
              <div className="flex flex-col items-center text-slate-500 gap-2">
                <FaCloudUploadAlt className="text-4xl" />
                <p className="text-sm">Click to upload</p>
                <input
                  type="file"
                  id="uploadProfileImageInput"
                  className="hidden"
                  accept="image/*"
                  onChange={handleUploadProfileImage}
                />
              </div>
            </div>
          </label>

          {data.profileImage.length > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {data.profileImage.map((img, i) => (
                <div key={i} className="relative group">
                  <img
                    src={img}
                    alt={`profile-${i}`}
                    width={80}
                    height={80}
                    className="cursor-pointer border bg-slate-100"
                    onClick={() => {
                      setFullScreenImage(img);
                      setOpenFullScreenImage(true);
                    }}
                  />
                  <MdDelete
                    className="absolute bottom-0 right-0 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer"
                    onClick={() => handleDeleteProfileImage(i)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-red-600 text-xs">*Please upload profile image</p>
          )}

          <label>Bio:</label>
          <textarea
            name="bio"
            value={data.bio || ''}
            onChange={handleOnChange}
            rows={4}
            className="p-2 bg-slate-100 border rounded resize-none"
          />

          <label>Consultation Fee:</label>
          <input
            type="number"
            name="fee"
            value={data.fee || ''}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
          />

          <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Update Doctor
          </button>
        </form>
      </div>

      {openFullScreenImage && (
        <DisplayImage
          imgUrl={fullScreenImage}
          onClose={() => setOpenFullScreenImage(false)}
        />
      )}
    </div>
  );
};

export default AdminEditDoctor;
