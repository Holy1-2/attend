// components/RecentAttendance.jsx
import { CalendarIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function RecentAttendance() {
  const [sessions] = useState(() => JSON.parse(localStorage.getItem('attendanceSessions')) || []);
  const [users] = useState(() => JSON.parse(localStorage.getItem('attendanceUsers')) || []);

  const latestSession = sessions.sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  if (!latestSession) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <CalendarIcon className="w-5 h-5 text-gray-600" />
        Recent Attendance
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3">Name</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {latestSession.participants.map((userId) => {
              const user = users.find(u => u.id === userId);
              const status = latestSession.records[userId];
              
              return (
                <tr key={userId} className="hover:bg-gray-50">
                  <td className="py-2">{user?.name || 'Unknown User'}</td>
                  <td>{new Date(latestSession.date).toLocaleDateString()}</td>
                  <td>
                    {status === 'present' ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center gap-1 w-fit">
                        <CheckCircleIcon className="w-4 h-4" />
                        Present
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm flex items-center gap-1 w-fit">
                        <XCircleIcon className="w-4 h-4" />
                        {status === 'absent' ? 'Absent' : 'Late'}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}