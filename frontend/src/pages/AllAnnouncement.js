import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import UploadAnnouncement from "../components/UploadAnnouncement";

const AllAnnouncement = () => {
  const [openUploadAnnouncement, setOpenUploadAnnouncement] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [allAnnouncements, setAllAnnouncements] = useState([]);

  const fetchAllAnnouncements = async () => {
    try {
      const response = await fetch(SummaryApi.getAllAnnouncements.url, {
        method: SummaryApi.getAllAnnouncements.method,
        credentials: "include",
      });
      const dataResponse = await response.json();

      setAllAnnouncements(dataResponse?.data || []);
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
    }
  };

  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this announcement?"))
    return;

  try {
    const response = await fetch(SummaryApi.deleteAnnouncement.url, {
      method: SummaryApi.deleteAnnouncement.method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const result = await response.json();
    if (result.success) {
      alert("Announcement deleted successfully");
      fetchAllAnnouncements();
    } else {
      alert(result.message || "Failed to delete announcement");
    }
  } catch (error) {
    console.error("Error deleting announcement:", error);
  }
};


  useEffect(() => {
    fetchAllAnnouncements();
  }, []);

  return (
    <div>
      <div className="bg-white py-2 px-4 flex justify-between items-center">
        <h2 className="font-bold text-lg">All Announcements</h2>
        <button
          className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all py-1 px-3 rounded-full"
          onClick={() => {
            setEditingAnnouncement(null);
            setOpenUploadAnnouncement(true);
          }}
        >
          Upload Announcement
        </button>
      </div>

      {/* all announcements */}
      <div className="flex flex-col gap-4 py-4 h-[calc(100vh-190px)] overflow-scroll">
        {allAnnouncements.length > 0 ? (
          allAnnouncements.map((announcement, index) => (
            <div
              key={index + "announcement"}
              className="border p-4 rounded-lg shadow bg-white"
            >
              <h3 className="font-bold text-lg">{announcement.title}</h3>
              {announcement.noticeText && (
                <p className="text-gray-700">{announcement.noticeText}</p>
              )}
              {announcement.imageBase64 && (
                <img
                  src={announcement.imageBase64}
                  alt="announcement"
                  className="w-48 h-auto mt-2 rounded-md"
                />
              )}
              <p className="text-xs text-gray-500 mt-1">
                Posted on {new Date(announcement.createdAt).toLocaleString()}
              </p>

              <div className="flex gap-3 mt-3">
                <button
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  onClick={() => {
                    setEditingAnnouncement(announcement);
                    setOpenUploadAnnouncement(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => handleDelete(announcement._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No announcements found</p>
        )}
      </div>

      {/* upload / edit announcement component */}
      {openUploadAnnouncement && (
        <UploadAnnouncement
          onClose={() => setOpenUploadAnnouncement(false)}
          fetchData={fetchAllAnnouncements}
          editData={editingAnnouncement}
        />
      )}
    </div>
  );
};

export default AllAnnouncement;
