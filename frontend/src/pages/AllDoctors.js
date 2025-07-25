import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import UploadDoctor from '../components/UploadDoctor';
import AdminDoctorCard from '../components/AdminDoctorCard';

const AllDoctors = () => {
  const [openUploadDoctor, setOpenUploadDoctor] = useState(false);
  const [allDoctors, setAllDoctors] = useState([]);

  const fetchAllDoctors = async () => {
    try {
      const response = await fetch(SummaryApi.allDoctors.url);
      const dataResponse = await response.json();

      console.log("doctor data", dataResponse);
      setAllDoctors(dataResponse?.data || []);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    }
  };

  useEffect(() => {
    fetchAllDoctors();
  }, []);

  return (
    <div>
      <div className="bg-white py-2 px-4 flex justify-between items-center">
        <h2 className="font-bold text-lg">All Doctors</h2>
        <button
          className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full"
          onClick={() => setOpenUploadDoctor(true)}
        >
          Upload Doctor
        </button>
      </div>

      {/* all doctors */}
      <div className="flex items-center flex-wrap gap-5 py-4 h-[calc(100vh-190px)] overflow-scroll">
        {allDoctors.map((doctor, index) => (
          <AdminDoctorCard
            data={doctor}
            key={index + "allDoctor"}
            fetchData={fetchAllDoctors}
          />
        ))}
      </div>

      {/* upload doctor component */}
      {openUploadDoctor && (
        <UploadDoctor
          onClose={() => setOpenUploadDoctor(false)}
          fetchData={fetchAllDoctors}
        />
      )}
    </div>
  );
};

export default AllDoctors;
