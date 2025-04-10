// components/RoleSelection.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContent';
import { BuildingOfficeIcon, UserGroupIcon } from '@heroicons/react/24/outline';

function RoleSelection() {
  const { setUserRole } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setUserRole(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Mode</h2>
        <p className="text-gray-600 mb-8">Choose your management type</p>

        <div className="grid gap-6">
          <button
            onClick={() => handleRoleSelect('class')}
            className="p-6 rounded-xl border-2 border-blue-100 hover:border-blue-500 transition-all group"
          >
            <BuildingOfficeIcon className="w-12 h-12 text-blue-600 mx-auto mb-4 group-hover:text-blue-700" />
            <h3 className="text-xl font-semibold text-gray-800">Class Mode</h3>
            <p className="text-gray-600 mt-1">Manage student attendance</p>
          </button>

          <button
            onClick={() => handleRoleSelect('employee')}
            className="p-6 rounded-xl border-2 border-blue-100 hover:border-blue-500 transition-all group"
          >
            <UserGroupIcon className="w-12 h-12 text-blue-600 mx-auto mb-4 group-hover:text-blue-700" />
            <h3 className="text-xl font-semibold text-gray-800">Employee Mode</h3>
            <p className="text-gray-600 mt-1">Manage staff attendance</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoleSelection;