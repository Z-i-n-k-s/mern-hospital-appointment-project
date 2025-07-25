import React, { useState } from 'react';
import { FaEdit, FaTrash } from "react-icons/fa";
import AdminEditDoctor from './AdminEditDoctor';
import DisplayImage from './DisplayImage';
import SummaryApi from '../common';

const AdminDoctorCard = ({ data, fetchData }) => {
  const [editDoctor, setEditDoctor] = useState(false);
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState('');

  const thumbnail = data?.profileImage?.startsWith('data:image')
    ? data.profileImage
    : '/default-doctor.png';

const handleDelete = async () => {
  const confirmed = window.confirm(`Are you sure you want to delete Dr. ${data.fullName}?`);
  if (!confirmed) return;

  try {
    const response = await fetch(SummaryApi.deleteDoctors.url, {
      method: SummaryApi.deleteDoctors.method, // DELETE
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: data._id }) 
    });

    const result = await response.json();

    if (result.success) {
      alert("Doctor deleted successfully");
      fetchData();
    } else {
      alert(result.message || "Failed to delete doctor");
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred while deleting the doctor");
  }
};




  return (
    <div className="bg-white p-4 rounded max-w-xs">
      {/* Thumbnail */}
      <div
        className="w-32 h-32 mx-auto rounded overflow-hidden cursor-pointer"
        onClick={() => {
          setFullScreenImage(thumbnail);
          setOpenFullScreenImage(true);
        }}
      >
        <img
          src={thumbnail}
          alt={data.fullName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <h1 className="mt-2 font-semibold text-lg text-center line-clamp-2">
        {data.fullName}
      </h1>
      <p className="text-sm text-gray-600 capitalize text-center">{data.category}</p>
      <p className="text-sm italic text-center">{data.specialization}</p>
      <p className="mt-1 font-semibold text-center">Fee: ৳ {data.fee ?? 'N/A'}</p>

      {/* Actions */}
      <div className="flex justify-center gap-4 mt-3">
        <button
          className="p-2 bg-green-100 hover:bg-green-500 rounded-full hover:text-white"
          onClick={() => setEditDoctor(true)}
        >
          <FaEdit />
        </button>

        <button
          className="p-2 bg-red-100 hover:bg-red-500 rounded-full hover:text-white"
          onClick={handleDelete}
        >
          <FaTrash />
        </button>
      </div>

      {/* Edit Modal */}
      {editDoctor && (
        <AdminEditDoctor
          doctordata={data}
          onClose={() => setEditDoctor(false)}
          fetchData={fetchData}
        />
      )}

      {/* Full-screen Image Modal */}
      {openFullScreenImage && (
        <DisplayImage
          imgUrl={fullScreenImage}
          onClose={() => setOpenFullScreenImage(false)}
        />
      )}
    </div>
  );
};

export default AdminDoctorCard;
