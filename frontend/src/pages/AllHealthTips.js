import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import SummaryApi from "../common";

const AllHealthTips = () => {
  const user = useSelector((state) => state?.user?.user);

  const [healthTips, setHealthTips] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [replyText, setReplyText] = useState({});
  const [submitting, setSubmitting] = useState({});
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, replied, pending
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, patient

  // Fetch all health tips
  const fetchAllPatientsHealthTips = async () => {
    if (!user?._id) return;

    setShowLoader(true);

    try {
      const response = await fetch(SummaryApi.getHealthTipsByDoctor.url, {
        method: SummaryApi.getHealthTipsByDoctor.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ doctor: user._id }),
      });

      const data = await response.json();

      if (data.success) {
        setHealthTips(data.data || []);
      } else {
        toast.error(data.message || "Failed to fetch health tips");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while fetching health tips");
    } finally {
      setShowLoader(false);
    }
  };

  useEffect(() => {
    fetchAllPatientsHealthTips();
  }, [user?._id]);

  // Submit reply for a tip
  const handleReply = async (tip) => {
    if (!replyText[tip._id]) return toast.error("Please enter a reply");

    setSubmitting((prev) => ({ ...prev, [tip._id]: true }));

    try {
      const response = await fetch(SummaryApi.createReply.url, {
        method: SummaryApi.createReply.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          healthTipId: tip._id,
          doctor: user._id,
          doctorName: user.name,
          comment: replyText[tip._id],
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Reply submitted successfully");
        setHealthTips((prev) =>
          prev.map((t) =>
            t._id === tip._id
              ? { ...t, replies: [{ comment: replyText[tip._id] }] }
              : t
          )
        );
        setReplyText((prev) => ({ ...prev, [tip._id]: "" }));
      } else {
        toast.error(data.message || "Failed to submit reply");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while submitting reply");
    } finally {
      setSubmitting((prev) => ({ ...prev, [tip._id]: false }));
    }
  };

  // Clear reply input
  const clearReply = (tipId) => {
    setReplyText((prev) => ({ ...prev, [tipId]: "" }));
  };

  // Filter and search logic
  const filteredAndSortedTips = useMemo(() => {
    let filtered = healthTips.filter((tip) => {
      // Search filter
      const searchMatch = 
        tip.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tip.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tip.doctorName?.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const hasReply = tip.replies && tip.replies.length > 0;
      const statusMatch = 
        filterStatus === "all" ||
        (filterStatus === "replied" && hasReply) ||
        (filterStatus === "pending" && !hasReply);

      return searchMatch && statusMatch;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case "patient":
          return (a.patientName || "").localeCompare(b.patientName || "");
        case "newest":
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });

    return filtered;
  }, [healthTips, searchTerm, filterStatus, sortBy]);

  const stats = useMemo(() => {
    const total = healthTips.length;
    const replied = healthTips.filter(tip => tip.replies && tip.replies.length > 0).length;
    const pending = total - replied;
    return { total, replied, pending };
  }, [healthTips]);

  if (showLoader) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600">Loading health tips...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Health Tips Dashboard</h1>
          <p className="text-gray-600">Manage and respond to patient health inquiries</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tips</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="ml-auto">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Replied</p>
                <p className="text-2xl font-bold text-gray-900">{stats.replied}</p>
              </div>
              <div className="ml-auto">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
              <div className="ml-auto">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by patient name, comment, or doctor..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter by Status */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending Reply</option>
                <option value="replied">Replied</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="patient">Patient Name</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchTerm || filterStatus !== "all" || sortBy !== "newest") && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                  setSortBy("newest");
                }}
                className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Results Info */}
        {searchTerm && (
          <div className="mb-4">
            <p className="text-gray-600">
              Showing {filteredAndSortedTips.length} of {healthTips.length} health tips
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>
        )}

        {/* Health Tips List */}
        {filteredAndSortedTips.length > 0 ? (
          <div className="space-y-4">
            {filteredAndSortedTips.map((tip) => {
              const hasReply = tip.replies && tip.replies.length > 0;
              const replyComment = hasReply ? tip.replies[0].comment : "";

              return (
                <div
                  key={tip._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{tip.patientName}</h3>
                          <p className="text-sm text-gray-500">Patient</p>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        hasReply 
                          ? "bg-green-100 text-green-800" 
                          : "bg-orange-100 text-orange-800"
                      }`}>
                        {hasReply ? "Replied" : "Pending"}
                      </div>
                    </div>

                    {/* Patient Comment */}
                    <div className="mb-4">
                      <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-indigo-500">
                        <p className="text-gray-800 leading-relaxed">{tip.comment}</p>
                      </div>
                    </div>

                    {/* Doctor Info */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">
                        Assigned to: <span className="font-medium text-gray-700">{tip.doctorName}</span>
                      </p>
                    </div>

                    {/* Reply Section */}
                    {hasReply ? (
                      <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                        <div className="flex items-center mb-2">
                          <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                          <span className="text-sm font-medium text-green-800">Your Reply</span>
                        </div>
                        <p className="text-gray-700">{replyComment}</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex space-x-3">
                          <textarea
                            placeholder="Type your professional reply to the patient..."
                            value={replyText[tip._id] || ""}
                            onChange={(e) =>
                              setReplyText((prev) => ({
                                ...prev,
                                [tip._id]: e.target.value,
                              }))
                            }
                            rows={3}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          {replyText[tip._id] && (
                            <button
                              onClick={() => clearReply(tip._id)}
                              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                            >
                              Clear
                            </button>
                          )}
                          <button
                            onClick={() => handleReply(tip)}
                            disabled={submitting[tip._id] || !replyText[tip._id]}
                            className={`px-6 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                              submitting[tip._id] || !replyText[tip._id]
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm hover:shadow-md"
                            }`}
                          >
                            {submitting[tip._id] ? (
                              <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Submitting...
                              </div>
                            ) : (
                              "Submit Reply"
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h8a2 2 0 012 2v4M6 13h8"></path>
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {healthTips.length === 0 ? "No Health Tips Yet" : "No Results Found"}
            </h3>
            <p className="text-gray-500">
              {healthTips.length === 0 
                ? "Health tips from patients will appear here when they submit them."
                : "Try adjusting your search terms or filters to find what you're looking for."
              }
            </p>
            {(searchTerm || filterStatus !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                }}
                className="mt-4 text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Clear filters and show all
              </button>
            )}
          </div>
        )}

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button
            onClick={fetchAllPatientsHealthTips}
            disabled={showLoader}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Health Tips
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllHealthTips;