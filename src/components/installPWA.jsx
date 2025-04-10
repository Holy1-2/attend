// components/InstallPWA.jsx
import { useState, useEffect } from 'react';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallAlert, setShowInstallAlert] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    if(isInstalled) return;

    // Listen for beforeinstallprompt event
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallAlert(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if user dismissed the prompt previously
    const dismissed = localStorage.getItem('installPromptDismissed');
    if(dismissed) setShowInstallAlert(false);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if(!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if(outcome === 'accepted') {
      console.log('User accepted install');
    } else {
      console.log('User dismissed install');
    }
    setShowInstallAlert(false);
    localStorage.setItem('installPromptDismissed', 'true');
  };

  const handleDismiss = () => {
    setShowInstallAlert(false);
    localStorage.setItem('installPromptDismissed', 'true');
  };

  if(!showInstallAlert) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-4 w-64 border border-gray-200">
        <div className="flex items-start mb-2">
          <div className="bg-blue-100 p-2 rounded-full mr-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Install App</h3>
            <p className="text-sm text-gray-600">Add to home screen for better experience</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleInstall}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors text-sm"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}