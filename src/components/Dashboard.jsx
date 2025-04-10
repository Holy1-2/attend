// components/Dashboard.jsx
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContent';
import DashboardHeader from './DashboardHeader';
import StatsGrid from './StatsGrid';
import RecentAttendance from './RecentAttendance';
import RedFlagged from './RedFlagged';
import { useEffect, useState } from 'react';

function Dashboard() {
  const { userRole } = useAuth();
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Refresh data every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader />
      
      <main className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {userRole === 'class' ? 'Class' : 'Employee'} Attendance Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          </div>
          <Link
            to="/manage-attendance"
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Attendance
          </Link>
        </div>

        <StatsGrid />

        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <div className="space-y-6">
            <RecentAttendance />
          </div>
          <div className="space-y-6">
            <RedFlagged />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;