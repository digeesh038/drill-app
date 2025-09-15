import React from "react";

const HistoryPage = ({ history = [], onGoToDashboard }) => {
  // Show only the last 5 attempts
  const recentHistory = history.slice(0, 5);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Drill History</h1>

      {recentHistory.length === 0 ? (
        <p className="text-gray-600">You haven't completed any drills yet.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md">
          <ul className="divide-y divide-gray-200">
            {recentHistory.map((record, index) => (
              <li key={record._id || index} className="p-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-800">
                    Attempt #{recentHistory.length - index}
                  </span>
                  <span className="text-sm text-gray-500">
                    {record.createdAt
                      ? new Date(record.createdAt).toLocaleString()
                      : "No date"}
                  </span>
                </div>
                <p className="mt-2 text-gray-600">
                  Score: {record.score ?? "N/A"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={onGoToDashboard}
          className="text-blue-600 hover:text-blue-800 font-semibold"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default HistoryPage;
