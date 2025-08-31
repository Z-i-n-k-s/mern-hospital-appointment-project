import React, { useEffect, useState } from "react";
import SummaryApi from "../common";

const AnnouncementSection = () => {
  const [allAnnouncements, setAllAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsPerPage = 2;

  // Fetch all announcements from API
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAnnouncements();
  }, []);

  const totalSlides = Math.ceil(allAnnouncements.length / itemsPerPage);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? totalSlides - 1 : prev - 1
    );
  };

  const startIndex = currentIndex * itemsPerPage;
  const visibleAnnouncements = allAnnouncements.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="p-4 relative">
      <h2 className="text-xl font-bold mb-4 text-center">📢 Announcements</h2>

      {loading ? (
        <p className="text-gray-500 text-center">Loading announcements...</p>
      ) : allAnnouncements.length === 0 ? (
        <p className="text-gray-500 text-center">No announcements available.</p>
      ) : (
        <div className="relative">
          {/* Carousel container */}
          <div className="grid gap-4 md:grid-cols-2 transition-all duration-500">
            {visibleAnnouncements.map((announcement) => (
              <div
                key={announcement._id}
                className="border rounded-xl p-4 shadow-md bg-white"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {announcement.title}
                </h3>

                {announcement.noticeText && (
                  <p className="text-gray-700 mb-2">
                    {announcement.noticeText}
                  </p>
                )}

                {announcement.imageBase64 && (
                  <img
                    src={announcement.imageBase64}
                    alt={announcement.title}
                    className="rounded-lg shadow-sm max-h-64 object-contain"
                  />
                )}

                <p className="text-sm text-gray-400 mt-2">
                  Posted on{" "}
                  {new Date(announcement.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Navigation buttons */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-700 text-white px-3 py-1 rounded-full shadow-md hover:bg-gray-600"
              >
                ◀
              </button>
              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-700 text-white px-3 py-1 rounded-full shadow-md hover:bg-gray-600"
              >
                ▶
              </button>
            </>
          )}

          {/* Dots indicator */}
          <div className="flex justify-center mt-3">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <span
                key={i}
                className={`mx-1 w-3 h-3 rounded-full cursor-pointer ${
                  i === currentIndex ? "bg-blue-500" : "bg-gray-300"
                }`}
                onClick={() => setCurrentIndex(i)}
              ></span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementSection;
