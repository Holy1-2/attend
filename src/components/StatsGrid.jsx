// components/StatsGrid.jsx
import { useAuth } from './AuthContent';
import { UserGroupIcon, PresentationChartBarIcon, FlagIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function StatsGrid() {
  const { user } = useAuth();
  const [users] = useState(() => JSON.parse(localStorage.getItem('attendanceUsers')) || []);
  const [sessions] = useState(() => JSON.parse(localStorage.getItem('attendanceSessions')) || []);

  const today = new Date().toDateString();
  const todaySession = sessions.find(s => new Date(s.date).toDateString() === today);
  
  const stats = [
    {
      title: user?.role === 'class' ? 'Total Students' : 'Total Employees',
      value: users.length,
      icon: UserGroupIcon,
      color: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      title: 'Today\'s Attendance',
      value: todaySession 
        ? `${Math.round((todaySession.presentCount / users.length) * 100)}%` 
        : 'N/A',
      icon: PresentationChartBarIcon,
      color: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      title: 'Absent Today',
      value: todaySession ? todaySession.absentCount : 0,
      icon: ClockIcon,
      color: 'bg-red-100',
      textColor: 'text-red-600'
    },
    {
      title: 'Red Flagged',
      value: users.filter(u => u.redFlagged).length,
      icon: FlagIcon,
      color: 'bg-yellow-100',
      textColor: 'text-yellow-600'
    }
  ];

  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}