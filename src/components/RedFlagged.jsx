// components/RedFlaggedUsers.jsx
import { useEffect, useState } from 'react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from './AuthContent';

export default function RedFlaggedUsers() {
  const { userRole } = useAuth();
  const [flaggedUsers, setFlaggedUsers] = useState([]);

  useEffect(() => {
    const loadFlaggedUsers = () => {
      const users = JSON.parse(localStorage.getItem('attendanceUsers')) || [];
      const sessions = JSON.parse(localStorage.getItem('attendanceSessions')) || [];
      
      // Calculate red-flagged users based on attendance rules
      const updatedUsers = users.map(user => {
        const userSessions = sessions.filter(session => 
          session.participants.includes(user.id)
        );

        // Flagging logic: 3+ consecutive absences
        const absences = userSessions.filter(s => s.records[user.id] === 'absent');
        const consecutiveAbsences = checkConsecutiveAbsences(userSessions, user.id);
        
        return {
          ...user,
          redFlagged: consecutiveAbsences >= 3,
          flagReason: consecutiveAbsences >= 3 
            ? `${consecutiveAbsences} consecutive absences` 
            : null
        };
      });

      setFlaggedUsers(updatedUsers.filter(u => u.redFlagged));
      localStorage.setItem('attendanceUsers', JSON.stringify(updatedUsers));
    };

    loadFlaggedUsers();
  }, []);

  const checkConsecutiveAbsences = (sessions, userId) => {
    let maxConsecutive = 0;
    let currentStreak = 0;

    sessions.sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(session => {
      if (session.records[userId] === 'absent') {
        currentStreak++;
        maxConsecutive = Math.max(maxConsecutive, currentStreak);
      } else {
        currentStreak = 0;
      }
    });

    return maxConsecutive;
  };

  const handleClearFlag = (userId) => {
    const users = JSON.parse(localStorage.getItem('attendanceUsers'));
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, redFlagged: false, flagReason: null } : u
    );
    localStorage.setItem('attendanceUsers', JSON.stringify(updatedUsers));
    setFlaggedUsers(updatedUsers.filter(u => u.redFlagged));
  };

  if (flaggedUsers.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Red Flagged</h3>
        <p className="text-gray-500">No red-flagged users</p>
      </div>
    );
  }
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
        Red Flagged {userRole === 'class' ? 'Students' : 'Employees'}
      </h3>
      <div className="space-y-4">
        {flaggedUsers.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div className="flex-1">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-600">{user.id}</p>
              <p className="text-sm text-red-500 mt-1">{user.flagReason}</p>
            </div>
            <button
              onClick={() => handleClearFlag(user.id)}
              className="p-2 text-red-600 hover:bg-red-100 rounded-full"
              title="Clear flag"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
    
  );
}