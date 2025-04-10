// components/NotFound.jsx
import { Link } from 'react-router-dom';
import { 
  ExclamationTriangleIcon,
  ArrowLeftCircleIcon,
  BuildingOfficeIcon 
} from '@heroicons/react/24/outline';
import { useAuth } from './AuthContent';

export default function NotFound() {
  const { userRole } = useAuth();
  const sessionLabel = userRole === 'class' ? 'Class' : 'Department';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <BuildingOfficeIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            {sessionLabel} Attendance 
          </h1>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-red-100 p-4 rounded-full animate-pulse">
              <ExclamationTriangleIcon className="w-16 h-16 text-red-600" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-6xl font-bold text-gray-900">404</h2>
              <p className="text-xl text-gray-600">Page Not Found</p>
            </div>

            <p className="text-gray-500 max-w-md">
              The page you're looking for doesn't exist or has been moved. 
              Please check the URL or return to the attendance dashboard.
            </p>
          </div>

          {/* Return Button */}
          <Link 
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeftCircleIcon className="w-5 h-5" />
            Return to {sessionLabel} Dashboard
          </Link>
        </div>

        {/* Footer */}
        <p className="mt-8 text-sm text-gray-500">
          Need help? Contact your {sessionLabel.toLowerCase()} administrator
        </p>
      </div>
    </div>
  );
}