// src/components/UploadAnnouncement.js
import React, { useState, useEffect } from "react";
import SummaryApi from "../common";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UploadAnnouncement = ({ onClose, fetchData, editData }) => {
  const [title, setTitle] = useState("");
  const [noticeText, setNoticeText] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const currentUser = useSelector((state) => state?.user?.user || null);

  // Populate fields in edit mode
  useEffect(() => {
    if (editData) {
      setTitle(editData.title || "");
      setNoticeText(editData.noticeText || "");
      setImageBase64(editData.imageBase64 || "");
      setIsActive(editData.isActive ?? true);
    }
  }, [editData]);

  // Convert image file to base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageBase64(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setTitle("");
    setNoticeText("");
    setImageBase64("");
    setIsActive(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }

    if (!editData && !currentUser?._id) {
      toast.error("Please log in to create an announcement.");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const url = editData
        ? SummaryApi.editAnnouncement.url
        : SummaryApi.createAnnouncement.url;

      const method = editData
        ? SummaryApi.editAnnouncement.method
        : SummaryApi.createAnnouncement.method;

      const bodyData = editData
        ? {
            id: editData._id,
            title,
            noticeText,
            imageBase64,
            isActive,
          }
        : {
            title,
            noticeText,
            imageBase64,
            isActive,
            createdBy: currentUser._id, // Pass logged-in user ID
          };

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          editData
            ? "Announcement updated successfully!"
            : "Announcement created successfully!"
        );
        fetchData(); // Refresh announcements
        resetForm();
        onClose();
      } else {
        toast.error(data.message || "Failed to save announcement.");
      }
    } catch (err) {
      console.error("Error uploading announcement:", err);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-[400px] p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          {editData ? "Edit Announcement" : "Upload Announcement"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Title */}
          <input
            type="text"
            placeholder="Title"
            className="border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* Notice text */}
          <textarea
            placeholder="Notice text (optional)"
            className="border p-2 rounded"
            value={noticeText}
            onChange={(e) => setNoticeText(e.target.value)}
          />

          {/* Image upload */}
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {imageBase64 && (
            <img
              src={imageBase64}
              alt="Preview"
              className="w-32 h-auto rounded mt-2"
            />
          )}

          {/* Active toggle */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Active
          </label>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading
                ? "Processing..."
                : editData
                ? "Update"
                : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadAnnouncement;
