const CALLS_KEY = 'agent_calls_history';
const SETTINGS_KEY = 'agent_app_settings';

export const storage = {
  // Call History
  getCalls: () => {
    try {
      const data = localStorage.getItem(CALLS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },
  
  saveCall: (callData) => {
    const calls = storage.getCalls();
    const newCall = {
      ...callData,
      id: crypto.randomUUID(),
      savedAt: new Date().toISOString()
    };
    calls.unshift(newCall);
    localStorage.setItem(CALLS_KEY, JSON.stringify(calls));
    return newCall;
  },

  deleteCall: (id) => {
    const calls = storage.getCalls();
    const filtered = calls.filter(c => c.id !== id);
    localStorage.setItem(CALLS_KEY, JSON.stringify(filtered));
  },

  clearAll: () => {
    localStorage.removeItem(CALLS_KEY);
  },

  // Settings
  getSettings: () => {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? JSON.parse(data) : { apiKey: '', companyName: '', agentName: '', darkMode: false, knowledgeBase: '' };
    } catch (e) {
      return { apiKey: '', companyName: '', agentName: '', darkMode: false, knowledgeBase: '' };
    }
  },

  saveSettings: (settings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }
};
