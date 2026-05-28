import { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom';
import CallForm from './components/CallForm';
import HistoryList from './components/HistoryList';
import SettingsPanel from './components/SettingsPanel';
import ToastNotification from './components/ToastNotification';
import { storage } from './utils/storage';
import { PlusCircle, History, Settings as SettingsIcon, Building } from 'lucide-react';

function App() {
  const [toast, setToast] = useState(null);
  const [companyName, setCompanyName] = useState('Agent Call Summary AI');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const settings = storage.getSettings();
    if (settings.companyName) {
      setCompanyName(settings.companyName);
    }
    
    // Apply Dark Mode on mount
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Redirect to settings if no API key is present and not already there
    if (!settings.apiKey && location.pathname !== '/settings') {
      navigate('/settings');
      showToast('Please set your API Key to get started', 'error');
    }
  }, [location.pathname, navigate]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
      isActive 
        ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
    }`;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header / Navbar */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-navy-900 dark:bg-orange-500 rounded-lg flex items-center justify-center shadow-sm transition-colors">
              <Building className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-navy-900 dark:text-white tracking-tight transition-colors">{companyName}</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/new" className={navLinkClass}>
              <PlusCircle className="w-4 h-4" /> New Call
            </NavLink>
            <NavLink to="/history" className={navLinkClass}>
              <History className="w-4 h-4" /> History
            </NavLink>
            <NavLink to="/settings" className={navLinkClass}>
              <SettingsIcon className="w-4 h-4" /> Settings
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
        <Routes>
          <Route path="/" element={<HistoryList onAddToast={showToast} />} />
          <Route path="/new" element={<CallForm onAddToast={showToast} />} />
          <Route path="/history" element={<HistoryList onAddToast={showToast} />} />
          <Route path="/settings" element={<SettingsPanel onAddToast={showToast} />} />
        </Routes>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 fixed bottom-0 w-full z-40 flex justify-around p-3 transition-colors duration-200">
        <NavLink to="/new" className={({ isActive }) => `flex flex-col items-center gap-1 text-xs font-medium ${isActive ? 'text-orange-600 dark:text-orange-400' : 'text-slate-500 dark:text-slate-400'}`}>
          <PlusCircle className="w-5 h-5" /> New
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => `flex flex-col items-center gap-1 text-xs font-medium ${isActive ? 'text-orange-600 dark:text-orange-400' : 'text-slate-500 dark:text-slate-400'}`}>
          <History className="w-5 h-5" /> History
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `flex flex-col items-center gap-1 text-xs font-medium ${isActive ? 'text-orange-600 dark:text-orange-400' : 'text-slate-500 dark:text-slate-400'}`}>
          <SettingsIcon className="w-5 h-5" /> Settings
        </NavLink>
      </nav>

      {/* Global Toast */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default App;
