import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SummaryApi from '../common';

const CategoryList = () => {
  const [byCategory, setByCategory] = useState({});
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const navigate = useNavigate();   // ← hook for navigation

  useEffect(() => {
    const fetchAndGroup = async () => {
      try {
        const res = await fetch(SummaryApi.allDoctors.url, {
          method:      SummaryApi.allDoctors.method,
          credentials: 'include',
          headers:     { 'Content-Type': 'application/json' }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message);

        const grouped = json.data.reduce((acc, doc) => {
          if (doc.status === 'Active') {
            const cat = doc.category || 'Uncategorized';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(doc);
          }
          return acc;
        }, {});
        setByCategory(grouped);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };
    fetchAndGroup();
  }, []);

  if (loading) return <p className="text-center py-10">Loading doctors…</p>;
  if (error)   return <p className="text-center text-red-500 py-10">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
      {Object.entries(byCategory).map(([category, doctors]) => (
        <section key={category} className="space-y-6">
          <h2 className="text-3xl font-semibold border-b pb-2">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {doctors.map(doc => (
              <div
                key={doc._id}
                className="border rounded-2xl p-6 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition cursor-pointer"
                onClick={() => navigate(`/doctors/${doc._id}`)}  // ← here’s the click
              >
                <div className="w-full h-40 mb-4 overflow-hidden rounded-xl bg-gray-100">
                  {doc.profileImage ? (
                    <img
                      src={doc.profileImage}
                      alt={doc.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-lg mb-1">{doc.fullName}</h3>
                {doc.specialization && (
                  <p className="text-gray-600 text-sm mb-2">{doc.specialization}</p>
                )}
                {doc.fee != null && (
                  <p className="font-semibold">Fee: ৳{doc.fee}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default CategoryList;
