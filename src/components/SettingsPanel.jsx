import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { Settings, Key, Building, UserCircle, AlertTriangle, Save, BookOpen } from 'lucide-react';

export default function SettingsPanel({ onAddToast }) {
  const [settings, setSettings] = useState({
    apiKey: '',
    companyName: 'Real Estate & Plot Sales',
    agentName: '',
    darkMode: false,
    knowledgeBase: ''
  });

  useEffect(() => {
    const saved = storage.getSettings();
    setSettings(prev => ({ ...prev, ...saved }));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    if (name === 'darkMode') {
      if (newValue) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    setSettings(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    storage.saveSettings(settings);
    onAddToast('Settings saved successfully', 'success');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-200">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-3 transition-colors duration-200">
          <Settings className="w-6 h-6 text-navy-900 dark:text-orange-500" />
          <div>
            <h2 className="text-xl font-semibold text-navy-900 dark:text-white transition-colors">Application Settings</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">Configure your preferences and API access.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-8">
          
          {/* API Key Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2 transition-colors">
              <Key className="w-4 h-4 text-slate-500 dark:text-slate-400" /> API Configuration
            </h3>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">For demo purposes only. Never expose API keys in production.</p>
                <p className="text-xs text-amber-700 mt-1">
                  Since this is a client-side prototype, the API key is stored locally in your browser. 
                  In a real production environment, this should be routed through a backend server.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">Gemini API Key</label>
              <input 
                type="password" 
                name="apiKey"
                value={settings.apiKey}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-mono text-sm"
                placeholder="AIzaSy..."
              />
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-700 transition-colors" />

          {/* User Profile Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2 transition-colors">
              <UserCircle className="w-4 h-4 text-slate-500 dark:text-slate-400" /> Profile & Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-2 transition-colors">
                  <Building className="w-4 h-4 text-slate-400 dark:text-slate-500" /> Company Name
                </label>
                <input 
                  type="text" 
                  name="companyName"
                  value={settings.companyName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-2 transition-colors">
                  <UserCircle className="w-4 h-4 text-slate-400 dark:text-slate-500" /> Agent Name
                </label>
                <input 
                  type="text" 
                  name="agentName"
                  value={settings.agentName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  placeholder="e.g. John Doe"
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-700 transition-colors" />
          
          {/* Preferences */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 transition-colors">Dark Mode</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">Enable dark theme for the interface</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="darkMode"
                  checked={settings.darkMode}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-700 transition-colors" />

          {/* Knowledge Base Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2 transition-colors">
              <BookOpen className="w-4 h-4 text-slate-500 dark:text-slate-400" /> Project Knowledge Base
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">Project Details (RAG Context)</label>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 transition-colors">Paste brochures, pricing, plot sizes, and legal approvals here. The AI will use this to answer customer questions automatically.</p>
              <textarea 
                name="knowledgeBase"
                value={settings.knowledgeBase}
                onChange={handleChange}
                rows="8"
                className="w-full px-3 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-y text-sm leading-relaxed"
                placeholder="e.g. Phase 1 plots are 200 sq yards, priced at 15000 per sq yard, HMDA approved..."
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit"
              className="flex items-center gap-2 bg-navy-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              <Save className="w-5 h-5" /> Save Settings
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
