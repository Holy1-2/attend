// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContent';
import Login from './components/Login';
import RoleSelection from './components/RoleSelection';
import Dashboard from './components/Dashboard';
import AttendanceManager from './components/AttendanceManager';
import LandingPage from './components/LandingPage';
import NotFound from "./components/NotFound"; // NotFound Component for unknown routes
import InstallPWA from './components/installPWA';

import { Toaster } from 'react-hot-toast';
import './App.css'
function App() {
  return (
    <Router>
      <AuthProvider>

      <>
        <Routes>
        <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/select-role" element={<ProtectedRoute><RoleSelection /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          
      
          <Route path="/manage-attendance" element={<ProtectedRoute><AttendanceManager /></ProtectedRoute>}/>

          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />

        </Routes>   
         <Toaster position="bottom-right" />  <InstallPWA />
        </>
      </AuthProvider>
    </Router>
        

  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default App;