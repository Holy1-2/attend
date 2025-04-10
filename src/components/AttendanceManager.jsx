import { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  PlusCircleIcon,
  CheckIcon, 
  XCircleIcon,
  ClockIcon,
  ChartBarIcon,BellIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { saveAs } from 'file-saver';
import Modal from './Modal';

export default function AttendanceManager() {
  // State management
  const [users, setUsers] = useState(() => 
    JSON.parse(localStorage.getItem('attendanceUsers')) || []
  );
  const [sessions, setSessions] = useState(() => 
    JSON.parse(localStorage.getItem('attendanceSessions')) || []
  );
  const [selectedSession, setSelectedSession] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', id: '', contact: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newSessionName, setNewSessionName] = useState('');

  // Confirmation modal states
  const [showConfirmDeleteSession, setShowConfirmDeleteSession] = useState(false);
  const [showConfirmDeleteUser, setShowConfirmDeleteUser] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [sessionToDelete, setSessionToDelete] = useState(null);

  // Persist data
  useEffect(() => {
    localStorage.setItem('attendanceUsers', JSON.stringify(users));
    localStorage.setItem('attendanceSessions', JSON.stringify(sessions));
  }, [users, sessions]);

  // Create new session
  const createSession = () => {
    if (!newSessionName) {
      toast.error('Please enter a session name');
      return;
    }
    
    const newSession = {
      id: `SESS-${Date.now()}`,
      name: newSessionName,
      date: new Date().toISOString(),
      participants: [],
      records: {}
    };

    setSessions([...sessions, newSession]);
    setSelectedSession(newSession);
    setShowSessionModal(false);
    setNewSessionName('');
    toast.success('New session created!');
  };

  // Add new user to the selected session
  const addUserToSession = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.id) {
      toast.error('Name and ID are required');
      return;
    }
    if (!selectedSession) {
      toast.error('Please select a session first.');
      return;
    }
    
    // Check if user already exists globally
    const globalUser = users.find(u => u.id === newUser.id);
    if (!globalUser) {
      // Add to global users if user does not exist
      setUsers([...users, newUser]);
    }

    // Then, add user to the selected session if not already added
    if (selectedSession.participants.includes(newUser.id)) {
      toast.error('User is already added to this session');
      return;
    }
    
    const updatedSession = {
      ...selectedSession,
      participants: [...selectedSession.participants, newUser.id],
      records: { ...selectedSession.records, [newUser.id]: 'unmarked' }
    };

    setSessions(sessions.map(s => s.id === selectedSession.id ? updatedSession : s));
    setSelectedSession(updatedSession);
    setNewUser({ name: '', id: '', contact: '' });
    setShowAddUserModal(false);
    toast.success('User added to session successfully');
  };

  // Edit user details from the global users list
  const updateUserDetails = (e) => {
    e.preventDefault();
    if (!editingUser.name) {
      toast.error('Name is required');
      return;
    }

    // Update the user in the global list
    const updatedUsers = users.map(u => 
      u.id === editingUser.id ? editingUser : u
    );
    setUsers(updatedUsers);
    setEditingUser(null);
    setShowEditUserModal(false);
    toast.success('User details updated');
  };

  // Mark attendance for a user in the selected session
  const markAttendance = (userId, status) => {
    if (!selectedSession) return;

    const updatedRecords = { ...selectedSession.records, [userId]: status };
    const updatedSession = { ...selectedSession, records: updatedRecords };
    
    setSessions(sessions.map(s => s.id === selectedSession.id ? updatedSession : s));
    setSelectedSession(updatedSession);
  };

  // Delete session after confirmation
  const deleteSession = () => {
    const updatedSessions = sessions.filter(s => s.id !== sessionToDelete.id);
    setSessions(updatedSessions);
    if (selectedSession?.id === sessionToDelete.id) {
      setSelectedSession(null);
    }
    setShowConfirmDeleteSession(false);
    toast.success('Session deleted');
  };

  // Delete a user from the selected session after confirmation
  const deleteUserFromSession = () => {
    if (!selectedSession || !userToDelete) return;
    const updatedParticipants = selectedSession.participants.filter(id => id !== userToDelete.id);
    const updatedRecords = { ...selectedSession.records };
    delete updatedRecords[userToDelete.id];

    const updatedSession = {
      ...selectedSession,
      participants: updatedParticipants,
      records: updatedRecords
    };

    setSessions(sessions.map(s => s.id === selectedSession.id ? updatedSession : s));
    setSelectedSession(updatedSession);
    setShowConfirmDeleteUser(false);
    toast.success('User removed from session');
  };

  // Calculate attendance stats for a session
  const getStats = (session) => ({
    present: Object.values(session.records).filter(s => s === 'present').length,
    absent: Object.values(session.records).filter(s => s === 'absent').length,
    total: session.participants.length
  });
  const [notificationSettings, setNotificationSettings] = useState(() => 
    JSON.parse(localStorage.getItem('notificationSettings')) || { enabled: false, time: '09:00' }
  );
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);

  // Add to existing useEffect for persistence
  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
  }, [notificationSettings]);

  // Notification handler
  useEffect(() => {
    if (!notificationSettings.enabled || !('Notification' in window)) return;

    const checkNotificationTime = () => {
      const now = new Date();
      const [targetHours, targetMinutes] = notificationSettings.time.split(':');
      const targetTime = new Date();
      targetTime.setHours(parseInt(targetHours), parseInt(targetMinutes), 0, 0);

      if (now >= targetTime && 
          now.getHours() === targetTime.getHours() &&
          now.getMinutes() === targetTime.getMinutes()) {
        
        const today = new Date();
        const hasSessionToday = sessions.some(session => {
          const sessionDate = new Date(session.date);
          return (
            sessionDate.getDate() === today.getDate() &&
            sessionDate.getMonth() === today.getMonth() &&
            sessionDate.getFullYear() === today.getFullYear()
          );
        });

        const lastNotified = localStorage.getItem('lastNotificationDate');
        const todayString = today.toDateString();

        if (!hasSessionToday && lastNotified !== todayString) {
          new Notification('Attendance Reminder', {
            body: 'Please update today\'s attendance tracking!',
            icon: '/notification-icon.png'
          });
          localStorage.setItem('lastNotificationDate', todayString);
        }
      }
    };

    const interval = setInterval(checkNotificationTime, 60000);
    return () => clearInterval(interval);
  }, [notificationSettings, sessions]);

  const handleNotificationToggle = async () => {
    if (!notificationSettings.enabled) {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        toast.error('Notifications blocked. Please enable in browser settings.');
        return;
      }
    }
    setNotificationSettings(prev => ({ ...prev, enabled: !prev.enabled }));
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <BuildingOfficeIcon className="w-8 h-8 text-blue-600" />
            Attendance Manager
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowSessionModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <PlusCircleIcon className="w-5 h-5" />
              New Session
            </button>
            {/* Note: The Add User button from the header has been removed */}
          </div>
          <button
    onClick={() => setShowNotificationSettings(true)}
    className="p-2 rounded-lg hover:bg-gray-100 relative"
  >
    <BellIcon className={`w-6 h-6 ${notificationSettings.enabled ? 'text-blue-600' : 'text-gray-400'}`} />
    {notificationSettings.enabled && (
      <span className="absolute top-0 right-0 w-2 h-2 bg-blue-600 rounded-full"></span>
    )}
  </button>
        </div>

       

  
        <Modal isOpen={showNotificationSettings} onClose={() => setShowNotificationSettings(false)}>
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-bold">Notification Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={notificationSettings.enabled}
                onChange={handleNotificationToggle}
                className="w-5 h-5 rounded checked:bg-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">Enable daily reminders</span>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Reminder Time</label>
              <input
                type="time"
                value={notificationSettings.time}
                onChange={(e) => setNotificationSettings(prev => ({
                  ...prev,
                  time: e.target.value
                }))}
                className="w-full px-3 py-2 border rounded-lg disabled:opacity-50"
                disabled={!notificationSettings.enabled}
              />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setShowNotificationSettings(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.success('Notification settings saved');
                setShowNotificationSettings(false);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {sessions.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center text-center">
            <BuildingOfficeIcon className="w-24 h-24 text-gray-300 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No sessions created yet
            </h2>
            <p className="text-gray-500 mb-6">
              Get started by creating your first attendance session
            </p>
            <button
              onClick={() => setShowSessionModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <PlusCircleIcon className="w-5 h-5" />
              Create Session
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Session Cards */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Your Sessions</h3>
                <div className="space-y-3">
                  {sessions.map(session => {
                    const stats = getStats(session);
                    return (
                      <div
                        key={session.id}
                        onClick={() => setSelectedSession(session)}
                        className={`p-4 rounded-lg cursor-pointer transition-all ${
                          selectedSession?.id === session.id
                            ? 'ring-2 ring-blue-500 bg-blue-50'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{session.name}</h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const newName = prompt('New session name:', session.name);
                                if (newName) {
                                  setSessions(sessions.map(s => 
                                    s.id === session.id ? { ...s, name: newName } : s
                                  ));
                                }
                              }}
                              className="text-gray-400 hover:text-blue-600"
                            >
                              <PencilSquareIcon className="w-5 h-5" />
                            </button>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSessionToDelete(session);
                              setShowConfirmDeleteSession(true);
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            {new Date(session.date).toLocaleDateString()}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-green-600">{stats.present}</span>
                            <span className="text-red-600">{stats.absent}</span>
                            <span className="text-gray-500">/ {stats.total}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Attendance Panel */}
            <div className="lg:col-span-2">
              {selectedSession && (
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold">{selectedSession.name}</h2>
                      <p className="text-gray-500">
                        {new Date(selectedSession.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          const csvContent = [
                            ['Name', 'ID', 'Status'],
                            ...Object.entries(selectedSession.records).map(([userId, status]) => {
                              const user = users.find(u => u.id === userId);
                              return [user?.name, user?.id, status];
                            })
                          ].join('\n');
                          
                          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                          saveAs(blob, `attendance-${selectedSession.name}.csv`);
                          toast.success('Export completed');
                        }}
                        className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                      >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                        Export
                      </button>
                      <button
                        onClick={() => setShowAddUserModal(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                      >
                        <UserGroupIcon className="w-5 h-5" />
                        Add User
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {users
                      .filter(user => 
                        // Display only users added to the current session
                        selectedSession.participants.includes(user.id) &&
                        `${user.name} ${user.id}`.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map(user => {
                        const status = selectedSession.records[user.id] || 'unmarked';
                        return (
                          <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <h3 className="font-medium">{user.name}</h3>
                              <p className="text-sm text-gray-500">{user.id}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => markAttendance(user.id, 'present')}
                                className={`px-3 py-1.5 rounded-md flex items-center gap-2 ${
                                  status === 'present' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                                }`}
                              >
                                <CheckIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => markAttendance(user.id, 'absent')}
                                className={`px-3 py-1.5 rounded-md flex items-center gap-2 ${
                                  status === 'absent' 
                                    ? 'bg-red-600 text-white' 
                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                                }`}
                              >
                                <XCircleIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => markAttendance(user.id, 'late')}
                                className={`px-3 py-1.5 rounded-md flex items-center gap-2 ${
                                  status === 'late' 
                                    ? 'bg-amber-600 text-white' 
                                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                }`}
                              >
                                <ClockIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingUser(user);
                                  setShowEditUserModal(true);
                                }}
                                className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-md hover:bg-blue-200"
                              >
                                <PencilSquareIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setUserToDelete(user);
                                  setShowConfirmDeleteUser(true);
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}

      {/* Modal for creating a new session */}
      <Modal isOpen={showSessionModal} onClose={() => setShowSessionModal(false)}>
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-bold">Create New Session</h3>
          <input
            type="text"
            placeholder="Session Name"
            className="w-full px-4 py-2 rounded-lg border border-gray-300"
            value={newSessionName}
            onChange={(e) => setNewSessionName(e.target.value)}
          />
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setShowSessionModal(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={createSession}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Session
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal for adding a new user to the selected session */}
      <Modal isOpen={showAddUserModal} onClose={() => setShowAddUserModal(false)}>
        <form onSubmit={addUserToSession} className="p-6 space-y-4">
          <h3 className="text-xl font-bold">Add New User</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ID Number *</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                value={newUser.id}
                onChange={(e) => setNewUser({ ...newUser, id: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact Info</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                value={newUser.contact}
                onChange={(e) => setNewUser({ ...newUser, contact: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setShowAddUserModal(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Add User
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal for editing an existing user's details */}
      <Modal isOpen={showEditUserModal} onClose={() => setShowEditUserModal(false)}>
        {editingUser && (
          <form onSubmit={updateUserDetails} className="p-6 space-y-4">
            <h3 className="text-xl font-bold">Edit User Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact Info</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300"
                  value={editingUser.contact}
                  onChange={(e) => setEditingUser({ ...editingUser, contact: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowEditUserModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Modal for confirming session deletion */}
      <Modal isOpen={showConfirmDeleteSession} onClose={() => setShowConfirmDeleteSession(false)}>
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-bold">Confirm Deletion</h3>
          <p>Are you sure you want to delete session "{sessionToDelete?.name}"?</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setShowConfirmDeleteSession(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={deleteSession}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal for confirming user deletion from session */}
      <Modal isOpen={showConfirmDeleteUser} onClose={() => setShowConfirmDeleteUser(false)}>
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-bold">Confirm User Removal</h3>
          <p>Are you sure you want to remove user "{userToDelete?.name}" from this session?</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setShowConfirmDeleteUser(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={deleteUserFromSession}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
