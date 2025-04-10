// components/DashboardHeader.jsx
import { useAuth } from './AuthContent';
import { BellIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import ProfileEditModal from './ProfileEditModal';

function DashboardHeader() {
  const { user, logout, updateProfile } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  if (!user) return null;

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">{user.initials}</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{user.organization}</h1>
            <p className="text-sm text-gray-500 capitalize">{user.role} Management</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-600 hover:text-blue-600 relative">
            <BellIcon className="w-6 h-6" />
            <span className="absolute top-1 right-1 bg-red-500 w-2 h-2 rounded-full"></span>
          </button>

          <div className="relative">
            <button 
              className="flex items-center gap-2 group"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium">{user.initials}</span>
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <ChevronDownIcon className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 text-left flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit Profile
                </button>
                <button
                  onClick={logout}
                  className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 text-left flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>

        <ProfileEditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          user={user}
          onSave={updateProfile}
        />
      </div>
    </header>
  );
}

export default DashboardHeader;