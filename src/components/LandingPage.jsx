// components/LandingPage.jsx
import { Link } from 'react-router-dom';
import { FingerPrintIcon, ChartBarIcon, CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <span className="ml-2 text-2xl font-bold text-gray-900">AttendX</span>
              </div>
            </div>
            <div className="flex items-center">
              <Link 
                to="/login" 
                className="text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Modern Attendance</span>
                <span className="block text-blue-600">Management System</span>
              </h1>
              <p className="mt-3 text-xl text-gray-500 sm:mt-5 sm:text-lg md:mt-5 md:text-xl">
                Streamline your organization's attendance tracking with AI-powered insights, 
                real-time reporting, and automated workflows.
              </p>
              <div className="mt-10">
                <Link
                  to="/login"
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-lg transform transition-all hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 mt-12 lg:mt-0">
              <div className="relative rounded-2xl shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-white" />
                <div className="relative px-8 py-12">
                  <div className="space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <div className="flex items-center gap-4">
                        <UserGroupIcon className="w-12 h-12 text-blue-600" />
                        <div>
                          <h3 className="text-lg font-bold">Employee Management</h3>
                          <p className="text-gray-600">Easily manage staff & student profiles</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md ml-12">
                      <div className="flex items-center gap-4">
                        <ChartBarIcon className="w-12 h-12 text-blue-600" />
                        <div>
                          <h3 className="text-lg font-bold">Real-time Analytics</h3>
                          <p className="text-gray-600">Interactive dashboards & reports</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-16">
            Powerful Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={FingerPrintIcon}
              title="Biometric Integration"
              description="Secure authentication with fingerprint and facial recognition technology"
            />
            <FeatureCard
              icon={CalendarIcon}
              title="Auto Scheduling"
              description="Automated shift management and class scheduling"
            />
            <FeatureCard
              icon={ChartBarIcon}
              title="Advanced Analytics"
              description="Real-time insights and predictive analytics"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to transform your attendance management?
            </h2>
            <div className="mt-8 flex justify-center">
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 shadow-lg"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400">
            © 2025 AttendX. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
      <Icon className="w-8 h-8 text-blue-600" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);