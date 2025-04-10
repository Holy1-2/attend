// components/DashboardHeader.jsx
import { useAuth } from './AuthContent';
import { BellIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

function DashboardHeader() {
  const { logout, userRole } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section - Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <span className="text-xl font-bold text-gray-800 hidden md:block">AttendancePro</span>
        </div>

        {/* Right Section - Notifications & Profile */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-600 hover:text-blue-600 relative">
            <BellIcon className="w-6 h-6" />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </button>

          {/* Profile Dropdown */}
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium">JD</span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-800">John Doe</p>
              <p className="text-xs text-gray-500 capitalize">{userRole || 'admin'}</p>
            </div>
            <ChevronDownIcon className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
            
            {/* Dropdown Menu */}
            <div className="absolute top-14 right-4 hidden group-hover:block bg-white shadow-lg rounded-lg p-2 min-w-[160px]">
              <button 
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;