import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SummaryApi from "../common";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const HealthTipsSection = ({ doctorId, doctorName }) => {
  const user = useSelector((state) => state?.user?.user);
  const [tips, setTips] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState("");
  const [showAnswerIds, setShowAnswerIds] = useState(new Set());

  const fetchTips = async () => {
    if (!user?._id) return;

    try {
      const res = await fetch(SummaryApi.getHealthTipsByPatient.url, {
        method: SummaryApi.getHealthTipsByPatient.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient: user._id }),
      });
      const json = await res.json();
      if (json.success) {
        const filteredTips = json.data.filter((tip) => tip.doctor === doctorId);
        setTips(filteredTips);
      }
    } catch (err) {
      console.error("Failed to fetch health tips:", err);
    }
  };

  const handleAskSubmit = async () => {
    if (!newQuestion.trim()) return;
    if (!user?._id) {
      alert("Please log in to ask health tips");
      return;
    }
    try {
      const res = await fetch(SummaryApi.createHealthTip.url, {
        method: SummaryApi.createHealthTip.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor: doctorId,
          doctorName,
          patient: user._id,
          patientName: user.name,
          comment: newQuestion,
        }),
      });
      const json = await res.json();
      if (json.success && json.data.doctor === doctorId) {
        setTips([json.data, ...tips]);
        setNewQuestion("");
      }
    } catch (err) {
      console.error("Failed to create health tip:", err);
    }
  };

  const handleUpdate = async (id) => {
    if (!editedQuestion.trim()) return;
    try {
      const res = await fetch(SummaryApi.updateHealthTip.url, {
        method: SummaryApi.updateHealthTip.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipId: id, comment: editedQuestion }),
      });
      const json = await res.json();
      if (json.success) {
        setTips(tips.map((t) => (t._id === id ? json.data : t)));
        setEditingId(null);
        setEditedQuestion("");
      }
    } catch (err) {
      console.error("Failed to update health tip:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this health tip?")) return;
    try {
      const res = await fetch(SummaryApi.deleteHealthTip.url, {
        method: SummaryApi.deleteHealthTip.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipId: id }),
      });
      const json = await res.json();
      if (json.success) {
        setTips(tips.filter((t) => t._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete health tip:", err);
    }
  };

  const toggleAnswer = (id) => {
    setShowAnswerIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  useEffect(() => {
    fetchTips();
  }, [user, doctorId]);

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold">Ask for Health Tips</h2>

      {!user?._id ? (
        <p className="text-red-500 font-medium">Please log in to ask health tips.</p>
      ) : (
        <>
          <textarea
            rows={3}
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Ask your health question..."
            className="w-full border rounded-lg p-2 focus:ring focus:ring-indigo-300 resize-none"
          />
          <button
            onClick={handleAskSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 mt-2"
          >
            Ask Doctor
          </button>
        </>
      )}

      <div className="space-y-3 pt-4">
        {tips.length === 0 ? (
          <p className="text-gray-500 text-sm">No health tips asked yet.</p>
        ) : (
          tips.map((tip) => (
            <div key={tip._id} className="border rounded-lg p-3 max-w-full break-words">
              {editingId === tip._id ? (
                <textarea
                  rows={3}
                  className="w-full border border-indigo-400 rounded-lg p-2 resize-none focus:outline-none focus:ring focus:ring-indigo-300"
                  value={editedQuestion}
                  onChange={(e) => setEditedQuestion(e.target.value)}
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap break-words">{tip.comment}</p>
              )}

              {tip.replies.length > 0 ? (
                <>
                  <button
                    onClick={() => toggleAnswer(tip._id)}
                    className="text-sm text-indigo-700 font-semibold flex items-center gap-1 mt-2 hover:underline"
                    aria-expanded={showAnswerIds.has(tip._id)}
                    aria-controls={`answers-${tip._id}`}
                  >
                    {showAnswerIds.has(tip._id) ? (
                      <>
                        Hide Doctor's Reply <FiChevronUp />
                      </>
                    ) : (
                      <>
                        Show Doctor's Reply <FiChevronDown />
                      </>
                    )}
                  </button>

                  {showAnswerIds.has(tip._id) && (
                    <div
                      id={`answers-${tip._id}`}
                      className="mt-1 space-y-2 bg-indigo-50 p-3 rounded-lg border border-indigo-200"
                    >
                      {tip.replies.map((r) => (
                        <p key={r._id} className="text-indigo-800 font-medium whitespace-pre-wrap break-words">
                          {r.comment} <span className="text-gray-500 text-xs">— Dr. {r.doctorName}</span>
                        </p>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p className="mt-2 text-sm italic text-gray-400">Doctor hasn’t replied yet.</p>
              )}

              <span className="text-sm text-gray-500 block mt-1">
                — {tip.patientName || "Anonymous"} {tip.doctorName && <>to Dr. {tip.doctorName}</>}
              </span>

              {user?._id === tip.patient && (
                <div className="flex gap-3 mt-2">
                  {editingId === tip._id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(tip._id)}
                        className="text-xs text-indigo-600 hover:underline"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditedQuestion("");
                        }}
                        className="text-xs text-gray-600 hover:underline"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(tip._id);
                          setEditedQuestion(tip.comment);
                        }}
                        className="text-xs text-indigo-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(tip._id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HealthTipsSection;
