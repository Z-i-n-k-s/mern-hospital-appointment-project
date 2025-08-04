// src/pages/DoctorDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import { CgCalendarDates } from "react-icons/cg";
import HealthTipsSection from "./HealthTipsSection";
import ReviewSection from "./ReviewSection";

const DoctorDetails = () => {
  const { id } = useParams();
  const nav = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch(SummaryApi.allDoctors.url, {
          method: SummaryApi.allDoctors.method,
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message);

        const allDocs = json.data;
        const doc = allDocs.find((d) => d._id === id);
        if (!doc) throw new Error("Doctor not found");
        setDoctor(doc);

        // get up to 4 other active doctors in the same category
        const sameCat = allDocs
          .filter(
            (d) =>
              d.category === doc.category &&
              d._id !== id &&
              d.status === "Active"
          )
          .slice(0, 4);
        setSuggestions(sameCat);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load doctor");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  if (loading) return <p className="text-center py-10">Loading…</p>;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;
  if (!doctor) return null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
      {/* Hero: Image + Name + Fee + Appointment */}
      <div className="flex flex-col md:flex-row items-center md:justify-between space-y-6 md:space-y-0">
        <div className="flex items-center space-x-6">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
            {doctor.profileImage ? (
              <img
                src={doctor.profileImage}
                alt={doctor.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
          <div>
            <h1 className="text-4xl font-semibold">{doctor.fullName}</h1>
            <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
              Fee: ৳{doctor.fee != null ? doctor.fee : "—"}
            </span>
          </div>
        </div>
        <button
          onClick={() => nav(`/appointments/new?doctorId=${id}`)}
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <CgCalendarDates className="mr-2 text-xl" /> Make Appointment
        </button>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl shadow">
        <Detail label="Category" value={doctor.category} />
        <Detail label="Specialization" value={doctor.specialization || "—"} />
        <Detail label="Gender" value={doctor.gender || "—"} />
        <Detail label="Email" value={doctor.email} />
        <Detail label="Phone" value={doctor.phone} />
        <Detail label="Qualification" value={doctor.qualification || "—"} />
        <Detail
          label="Experience"
          value={
            doctor.experience != null
              ? `${doctor.experience} yr${doctor.experience > 1 ? "s" : ""}`
              : "—"
          }
        />
        <Detail
          label="Available"
          value={
            doctor.availableDays?.length
              ? `${doctor.availableDays.join(", ")} @ ${doctor.availableTime}`
              : "—"
          }
        />
        <Detail
          label="Chamber Address"
          value={doctor.chamberAddress || "—"}
          colSpan="md:col-span-2"
        />
        <Detail label="Bio" value={doctor.bio || "—"} colSpan="md:col-span-2" />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {suggestions.map((d) => (
              <div
                key={d._id}
                onClick={() => nav(`/doctors/${d._id}`)}
                className="cursor-pointer border rounded-2xl p-4 shadow hover:shadow-lg transition"
              >
                <div className="w-full h-32 mb-3 overflow-hidden rounded-xl bg-gray-100">
                  {d.profileImage ? (
                    <img
                      src={d.profileImage}
                      alt={d.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <h3 className="font-medium">{d.fullName}</h3>
                <p className="text-gray-600 text-sm">
                  {d.specialization || "—"}
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
                  ৳{d.fee != null ? d.fee : "—"}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
      {/* Reviews & Health Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReviewSection doctorId={id} />
        <HealthTipsSection doctorId={id} />
      </div>
    </div>
  );
};

const Detail = ({ label, value, colSpan }) => (
  <div className={`${colSpan || ""} space-y-1`}>
    <span className="text-gray-500 font-medium">{label}</span>
    <p className="text-gray-800">{value}</p>
  </div>
);

export default DoctorDetails;
