import React from "react";
import { Link } from "react-router-dom";

const DashboardPage = ({ drills, user }) => {
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.name || user.email}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drills.map((drill) => (
          <Link
            key={drill.drillId}
            to={`/drills/${drill.drillId}`}
            className="block bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition hover:scale-105"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{drill.title}</h2>
            <p className="text-gray-600">Difficulty: {drill.difficulty}</p>
            {drill.tags?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {drill.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded">{tag}</span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
