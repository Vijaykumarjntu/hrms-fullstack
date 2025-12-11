import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold">HRMS Dashboard</h1>
              <div className="flex space-x-4">
                <Link to="/employees" className="text-gray-700 hover:text-blue-600">Employees</Link>
                <Link to="/teams" className="text-gray-700 hover:text-blue-600">Teams</Link>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span>Welcome, {user?.email}</span>
              <button
                onClick={onLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to HRMS!
              </h2>
              <p className="text-gray-600 mb-6">
                Manage your employees and teams efficiently
              </p>
              <div className="space-x-4">
                <Link 
                  to="/employees" 
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                  Manage Employees
                </Link>
                <Link 
                  to="/teams" 
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                >
                  Manage Teams
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;