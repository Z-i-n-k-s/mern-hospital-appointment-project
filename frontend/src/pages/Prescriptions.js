import React, { useEffect, useState } from "react";
import imageTobase64 from "../helpers/imageTobase64";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import SummaryApi from "../common";

const Prescriptions = () => {
  const user = useSelector((state) => state?.user?.user);

  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionImage, setPrescriptionImage] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [modalImage, setModalImage] = useState(null);
  console.log(modalImage);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const prescriptionsPerPage = 6;

  // Fetch prescriptions for this user only
  const fetchPrescriptions = async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      const url = new URL(SummaryApi.getPrescriptionById.url);
      url.searchParams.append("patientId", user._id);

      const res = await fetch(url.toString(), {
        method: SummaryApi.getPrescriptionById.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (data.success) {
        const sorted = (data.data || []).sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setPrescriptions(sorted);
      } else {
        toast.error(data.message || "Failed to fetch prescriptions");
      }
    } catch (err) {
      toast.error("Failed to fetch prescriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, [user?._id]);

  const handleUploadPrescriptionImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const base64Pic = await imageTobase64(file);
    setPrescriptionImage(base64Pic);
  };

  const clearForm = () => {
    setEditingId(null);
    setPrescriptionImage("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!prescriptionImage) {
      toast.error("Please upload a prescription image");
      return;
    }

    const payload = {
      patientId: user?._id,
      patientName: user?.name,
      date,
      prescriptionImage,
    };

    try {
      setLoading(true);

      const url = editingId
        ? `${SummaryApi.updatePrescription.url}/${editingId}`
        : SummaryApi.addPrescription.url;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(
          editingId
            ? "Prescription updated successfully"
            : "Prescription added successfully"
        );
        clearForm();
        fetchPrescriptions();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast.error(data.message || "Failed to save prescription");
      }
    } catch (err) {
      toast.error("Failed to save prescription");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this prescription?"))
      return;
    try {
      const res = await fetch(`${SummaryApi.deletePrescription.url}/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Prescription deleted successfully");
        fetchPrescriptions();
      } else {
        toast.error(data.message || "Failed to delete prescription");
      }
    } catch (err) {
      toast.error("Failed to delete prescription");
    }
  };

  const handleEdit = (prescription) => {
    setPrescriptionImage(prescription.prescriptionImage);
    setDate(new Date(prescription.date).toISOString().split("T")[0]);
    setEditingId(prescription._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Pagination logic
  const indexOfLast = currentPage * prescriptionsPerPage;
  const indexOfFirst = indexOfLast - prescriptionsPerPage;
  const currentPrescriptions = prescriptions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(prescriptions.length / prescriptionsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                Medical Prescriptions
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Manage and view your prescription history
              </p>
            </div>
            <div className="hidden lg:flex items-center space-x-4">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium text-blue-700">
                  Total Prescriptions: {prescriptions.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload / Edit Form Section */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white">
                {editingId ? "Update Prescription" : "Add New Prescription"}
              </h2>
              <p className="text-blue-100 mt-1">
                {editingId
                  ? "Make changes to your prescription"
                  : "Upload a new prescription document"}
              </p>
            </div>

            <form onSubmit={handleSave} className="p-8" autoComplete="off">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Patient Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Patient Name
                    </label>
                    <input
                      type="text"
                      value={user?.name || ""}
                      disabled
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Prescription Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      disabled
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-700 font-medium focus:outline-none cursor-not-allowed"
                    />
                  </div>

                  {/* Upload Image */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Prescription Document
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadPrescriptionImage}
                        className="w-full px-4 py-3 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:font-semibold hover:file:bg-blue-700 transition-all duration-200"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Supported formats: JPG, PNG, GIF (Max 10MB)
                    </p>
                  </div>
                </div>

                {/* Right Column - Image Preview */}
                <div className="flex flex-col justify-center">
                  {prescriptionImage ? (
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-700 mb-4">
                        Preview
                      </p>
                      <div className="relative inline-block">
                        <img
                          src={prescriptionImage}
                          alt="Prescription Preview"
                          onClick={() => setModalImage(prescriptionImage)}
                          className="w-full max-w-sm h-64 object-contain rounded-2xl border-2 border-gray-200 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                          title="Click to view fullscreen"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 rounded-2xl transition-all duration-200 flex items-center justify-center">
                          <div className="opacity-0 hover:opacity-100 transition-opacity duration-200">
                            <svg
                              className="w-8 h-8 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <svg
                        className="w-16 h-16 text-gray-400 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="text-gray-500 font-medium">
                        Upload an image to see preview
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-end space-x-4">
                {editingId && (
                  <button
                    type="button"
                    onClick={clearForm}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-8 py-3 font-semibold rounded-xl text-white transition-all duration-200 transform hover:scale-105 ${
                    loading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </div>
                  ) : editingId ? (
                    "Update Prescription"
                  ) : (
                    "Add Prescription"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Prescriptions List Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Your Prescription History
            </h2>
            <div className="text-sm text-gray-500">
              Showing {indexOfFirst + 1}-
              {Math.min(indexOfLast, prescriptions.length)} of{" "}
              {prescriptions.length} prescriptions
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-lg text-gray-600">
                Loading prescriptions...
              </span>
            </div>
          ) : currentPrescriptions.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No prescriptions found
              </h3>
              <p className="text-gray-500">
                Upload your first prescription to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentPrescriptions.map((prescription) => (
                <div
                  key={prescription._id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Image Container */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden group cursor-pointer">
                    <img
                      src={prescription.prescriptionImage}
                      alt="Prescription"
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      onClick={() => {
                        console.log(
                          "Image clicked!",
                          prescription.prescriptionImage
                        );
                        setModalImage(prescription.prescriptionImage);
                      }}
                      title="Click to view fullscreen"
                    />
                    {/* Fix: overlay with pointer-events-none so clicks pass through */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center pointer-events-none">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {prescription.patientName}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m0 0V7a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2h8z"
                          />
                        </svg>
                        {new Date(prescription.date).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEdit(prescription)}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(prescription._id)}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-12 flex justify-center" aria-label="Pagination">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-300 shadow-sm"
                }`}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, idx) => (
                <button
                  key={idx}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    currentPage === idx + 1
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-300 shadow-sm"
                  }`}
                  onClick={() => setCurrentPage(idx + 1)}
                  disabled={currentPage === idx + 1}
                  aria-current={currentPage === idx + 1 ? "page" : undefined}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-300 shadow-sm"
                }`}
              >
                Next
              </button>
            </div>
          </nav>
        )}
      </div>

      {/* Fullscreen Image Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setModalImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setModalImage(null);
            }}
            aria-label="Close fullscreen image"
            className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-gray-300 z-50"
          >
            &times;
          </button>
          <img
            src={modalImage}
            alt="Fullscreen Preview"
            className="max-h-full max-w-full rounded-md shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default Prescriptions;
