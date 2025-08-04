// src/components/ReviewSection.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SummaryApi from "../common";

const ReviewSection = ({ doctorId }) => {
  const user = useSelector((state) => state?.user?.user);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch reviews for this doctor
  useEffect(() => {
    const fetchReviews = async () => {
  try {
    const res = await fetch(`${SummaryApi.getReview.url}?doctorId=${doctorId}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    const json = await res.json();
    if (json.success) setReviews(json.data);
  } catch (err) {
    console.error("Failed to fetch reviews:", err);
  }
};


    if (doctorId) fetchReviews();
  }, [doctorId]);

  // ✅ Submit new review
  const handleReviewSubmit = async () => {
    if (!newReview.trim()) return;
    if (!user?._id) {
      alert("Please log in to submit a review");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(SummaryApi.addReview.url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor: doctorId,
          patient: user._id,       // ✅ plain string id
          patientName: user.name,  // ✅ store name directly
          comment: newReview,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setReviews([json.data, ...reviews]); // add new review on top
        setNewReview("");
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update review
  const handleUpdate = async (id, newComment) => {
    try {
      const res = await fetch(SummaryApi.updateReview.url, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, comment: newComment }),
      });
      const json = await res.json();
      if (json.success) {
        setReviews(reviews.map((r) => (r._id === id ? json.data : r)));
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // ✅ Delete review
  const handleDelete = async (id) => {
    try {
      const res = await fetch(SummaryApi.deleteReview.url, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (json.success) {
        setReviews(reviews.filter((r) => r._id !== id));
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-4">
      <h2 className="text-xl font-semibold">Reviews</h2>

      {/* If no user logged in */}
      {!user?._id ? (
        <p className="text-red-500 font-medium">
          Please log in to Post a Review
        </p>
      ) : (
        <>
          {/* Review Form */}
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Write your review..."
            className="w-full border rounded-lg p-2 focus:ring focus:ring-indigo-300"
          />
          <button
            onClick={handleReviewSubmit}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </>
      )}

      {/* Existing Reviews */}
      <div className="space-y-3 pt-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-sm">No reviews yet.</p>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="border rounded-lg p-3">
              <p className="text-gray-700">"{r.comment}"</p>
              <span className="text-sm text-gray-500">
                — {r.patientName || "Anonymous"}
              </span>

              {/* Edit/Delete only if the logged-in patient is the reviewer */}
              {user?._id === r.patient && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() =>
                      handleUpdate(r._id, prompt("Edit your review:", r.comment))
                    }
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
