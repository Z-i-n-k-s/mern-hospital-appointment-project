import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Calendar, Clock, User, CreditCard, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import SummaryApi from '../common';

const AllAppointments = () => {
  const user = useSelector(state => state?.user?.user);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    if (!user?._id) return;

    const fetchAppointments = async () => {
      try {
        const res = await fetch(SummaryApi.getAppointmentsByPatient.url, {
          method: SummaryApi.getAppointmentsByPatient.method,
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ userId: user._id }),
        });

        if (!res.ok) throw new Error('Failed to fetch appointments');

        const data = await res.json();

        if (data.success) {
          setAppointments(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch appointments');
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  const handlePay = async (appointment) => {
    try {
      setProcessingId(appointment._id);
      const res = await fetch(SummaryApi.confirmAppointment.url, {
        method: SummaryApi.confirmAppointment.method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ _id: appointment._id, fee: appointment.fee }),
      });

      if (!res.ok) throw new Error('Payment failed');

      const data = await res.json();

      if (data.success) {
        setAppointments(prev =>
          prev.map(appt => (appt._id === appointment._id ? data.data : appt))
        );
      } else {
        throw new Error(data.message || 'Payment failed');
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Payment failed');
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancel = async (appointment) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      setProcessingId(appointment._id);
      const res = await fetch(SummaryApi.cancelAppointment.url, {
        method: SummaryApi.cancelAppointment.method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ _id: appointment._id }),
      });

      if (!res.ok) throw new Error('Cancellation failed');

      const data = await res.json();

      if (data.success) {
        setAppointments(prev =>
          prev.map(appt => (appt._id === appointment._id ? data.data : appt))
        );
      } else {
        throw new Error(data.message || 'Cancellation failed');
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Cancellation failed');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Confirmed': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      'Pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertCircle },
      'Cancelled': { bg: 'bg-red-100', text: 'text-red-800', icon: X },
      'Completed': { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle }
    };
    
    const config = statusConfig[status] || statusConfig['Pending'];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const getPaymentBadge = (paymentStatus) => {
    const isUnpaid = paymentStatus === 'Unpaid';
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isUnpaid ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
      }`}>
        <CreditCard className="w-3 h-3 mr-1" />
        {paymentStatus}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Appointments</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!appointments.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-8">
              <div className="text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Appointments Found</h3>
                <p className="text-gray-600 mb-6">You haven't booked any appointments yet.</p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Book Your First Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Appointment History</h1>
          <p className="text-gray-600 mt-2">Manage your upcoming and past appointments</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Doctor
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Date & Time
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fee
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appt) => (
                  <tr key={appt._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {appt.doctorName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <div>
                          <div className="font-medium">
                            {new Date(appt.appointmentDate).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center text-gray-500 mt-1">
                            <Clock className="w-3 h-3 mr-1" />
                            {appt.appointmentTime}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={appt.reason}>
                        {appt.reason}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(appt.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${appt.fee}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPaymentBadge(appt.paymentStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {appt.paymentStatus === 'Unpaid' && (
                          <button
                            onClick={() => handlePay(appt)}
                            disabled={processingId === appt._id}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {processingId === appt._id ? (
                              <>
                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <CreditCard className="w-3 h-3 mr-1" />
                                Pay Now
                              </>
                            )}
                          </button>
                        )}
                        {(appt.status === 'Confirmed' || appt.paymentStatus === 'Paid') && (
                          <button
                            onClick={() => handleCancel(appt)}
                            disabled={processingId === appt._id}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {processingId === appt._id ? (
                              <>
                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <X className="w-3 h-3 mr-1" />
                                Cancel Appointment
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
          <div>
            Showing {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-100 rounded-full mr-2"></div>
              <span>Confirmed</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-100 rounded-full mr-2"></div>
              <span>Pending</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-100 rounded-full mr-2"></div>
              <span>Cancelled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllAppointments;