import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const AllPatientsAppointments = () => {
  const user = useSelector(state => state?.user?.user);
  const [appointments, setAppointments] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchAllPatientsAppointments = async () => {
    if (!user?._id) return;
    setShowLoader(true);
    try {
      const response = await fetch(SummaryApi.getAppointmentsByDoctor.url, {
        method: SummaryApi.getAppointmentsByDoctor.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ doctorId: user._id })
      });
      const data = await response.json();
      if (data.success) {
        setAppointments(data.data || []);
      } else {
        toast.error(data.message || 'Failed to fetch appointments');
      }
    } catch (error) {
      toast.error('Something went wrong while fetching appointments');
    } finally {
      setShowLoader(false);
    }
  };

  useEffect(() => {
    fetchAllPatientsAppointments();
  }, [user?._id]);

  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Filter and search logic
  const filteredAndSortedAppointments = useMemo(() => {
    let filtered = appointments.filter(appointment => {
      // Search filter
      const searchMatch = searchTerm === '' || 
        appointment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const statusMatch = statusFilter === 'All' || appointment.status === statusFilter;

      // Payment filter
      const paymentMatch = paymentFilter === 'All' || appointment.paymentStatus === paymentFilter;

      // Date filter
      const appointmentDate = new Date(appointment.appointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      appointmentDate.setHours(0, 0, 0, 0);

      let dateMatch = true;
      if (dateFilter === 'Today') {
        dateMatch = appointmentDate.getTime() === today.getTime();
      } else if (dateFilter === 'Upcoming') {
        dateMatch = appointmentDate >= today;
      } else if (dateFilter === 'Past') {
        dateMatch = appointmentDate < today;
      } else if (dateFilter === 'Custom' && startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        dateMatch = appointmentDate >= start && appointmentDate <= end;
      }

      return searchMatch && statusMatch && paymentMatch && dateMatch;
    });

    // Sort appointments
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.appointmentDate);
          bValue = new Date(b.appointmentDate);
          break;
        case 'patient':
          aValue = a.userName.toLowerCase();
          bValue = b.userName.toLowerCase();
          break;
        case 'status':
          aValue = a.status.toLowerCase();
          bValue = b.status.toLowerCase();
          break;
        case 'fee':
          aValue = a.fee;
          bValue = b.fee;
          break;
        default:
          aValue = new Date(a.appointmentDate);
          bValue = new Date(b.appointmentDate);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [appointments, searchTerm, statusFilter, paymentFilter, dateFilter, startDate, endDate, sortBy, sortOrder]);

  // Get unique values for filters
  const uniqueStatuses = [...new Set(appointments.map(app => app.status))];
  const uniquePaymentStatuses = [...new Set(appointments.map(app => app.paymentStatus))];

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setPaymentFilter('All');
    setDateFilter('All');
    setStartDate('');
    setEndDate('');
    setSortBy('date');
    setSortOrder('desc');
  };

  // Quick date filter buttons
  const setQuickDateFilter = (filterType) => {
    setDateFilter(filterType);
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">All Patients Appointments</h2>
        
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by patient name, reason, or doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Quick Date Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setQuickDateFilter('All')}
            className={`px-4 py-2 rounded-lg font-medium ${
              dateFilter === 'All' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Appointments
          </button>
          <button
            onClick={() => setQuickDateFilter('Today')}
            className={`px-4 py-2 rounded-lg font-medium ${
              dateFilter === 'Today' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setQuickDateFilter('Upcoming')}
            className={`px-4 py-2 rounded-lg font-medium ${
              dateFilter === 'Upcoming' 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setQuickDateFilter('Past')}
            className={`px-4 py-2 rounded-lg font-medium ${
              dateFilter === 'Past' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Past
          </button>
        </div>

        {/* Advanced Filters */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Advanced Filters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Statuses</option>
                {uniqueStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Payment Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Status
              </label>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Payment Status</option>
                {uniquePaymentStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Date</option>
                <option value="patient">Patient Name</option>
                <option value="status">Status</option>
                <option value="fee">Fee</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort Order
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Custom Date Range */}
          <div className="mt-4">
            <label className="flex items-center mb-2">
              <input
                type="radio"
                name="dateFilter"
                checked={dateFilter === 'Custom'}
                onChange={() => setDateFilter('Custom')}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Custom Date Range</span>
            </label>
            
            {dateFilter === 'Custom' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">From Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">To Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Clear Filters Button */}
          <div className="mt-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Showing {filteredAndSortedAppointments.length} of {appointments.length} appointments
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {showLoader ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="ml-3 text-gray-600">Loading appointments...</p>
        </div>
      ) : (
        <div>
          {/* Appointments List */}
          {filteredAndSortedAppointments.length > 0 ? (
            <div className="space-y-4">
              {filteredAndSortedAppointments.map(app => {
                const appointmentDate = new Date(app.appointmentDate);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                appointmentDate.setHours(0, 0, 0, 0);
                
                const isToday = appointmentDate.getTime() === today.getTime();
                const isPast = appointmentDate < today;
                const isUpcoming = appointmentDate > today;

                return (
                  <div 
                    key={app._id} 
                    className={`border-l-4 p-5 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                      isToday ? 'border-green-500 bg-green-50' :
                      isUpcoming ? 'border-blue-500 bg-blue-50' :
                      'border-gray-300 bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {app.userName}
                        </h3>
                        {isToday && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            Today
                          </span>
                        )}
                        {isUpcoming && !isToday && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            Upcoming
                          </span>
                        )}
                        {isPast && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                            Past
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          app.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                          app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          app.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {app.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          app.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                          app.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {app.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Date & Time</p>
                        <p className="font-medium text-gray-800">
                          {new Date(app.appointmentDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-sm text-gray-600">{app.appointmentTime}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Reason</p>
                        <p className="font-medium text-gray-800">{app.reason}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Fee</p>
                        <p className="font-medium text-gray-800">৳{app.fee?.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-gray-500">
                      Created: {new Date(app.createdAt).toLocaleDateString()} | 
                      Updated: {new Date(app.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-600 text-lg">No appointments found</p>
              <p className="text-gray-500 text-sm mt-1">
                {appointments.length === 0 
                  ? "You don't have any appointments yet." 
                  : "Try adjusting your filters to see more results."
                }
              </p>
              {(searchTerm || statusFilter !== 'All' || paymentFilter !== 'All' || dateFilter !== 'All') && (
                <button
                  onClick={clearFilters}
                  className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllPatientsAppointments;