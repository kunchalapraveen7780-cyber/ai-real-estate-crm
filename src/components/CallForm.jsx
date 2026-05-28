import { useState } from 'react';
import { processCallNote } from '../utils/geminiClient';
import { storage } from '../utils/storage';
import { Loader2, Send } from 'lucide-react';
import SummaryCard from './SummaryCard';
import VoiceRecorder from './VoiceRecorder';

const SAMPLE_NOTE = "Customer called, name Ravi Kumar, 9849123456. Budget 25 to 30 lakhs. Wants plot near highway. Asked about pattadar passbook and link documents. Very interested, wants to visit site this Sunday. Please call back Saturday evening.";

export default function CallForm({ onAddToast = () => {} }) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [callType, setCallType] = useState('First Contact');
  const [note, setNote] = useState('');
  
  const handleAppendText = (newText) => {
    setNote(prev => prev ? prev.trim() + ' ' + newText.trim() : newText.trim());
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summaryData, setSummaryData] = useState(null);
  const [apiKey, setApiKey] = useState(() => storage.getSettings().apiKey);
  const [knowledgeBase, setKnowledgeBase] = useState(() => storage.getSettings().knowledgeBase);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!note.trim()) {
      setError('Please enter call notes.');
      return;
    }
    
    const activeApiKey = apiKey || "AIzaSyCu-lvlW6QGfTNLXydzYgeC7NsuwOU1jpI";

    if (!activeApiKey) {
      setError('Gemini API Key is missing. Please set it in Settings.');
      return;
    }

    setLoading(true);
    setError('');
    setSummaryData(null);

    try {
      const result = await processCallNote(note, customerName, phone, callType, activeApiKey, knowledgeBase);
      setSummaryData(result);
      onAddToast('Summary generated successfully', 'success');
    } catch (err) {
      setError(err.message || 'Failed to generate summary');
      onAddToast(err.message || 'Failed to generate summary', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (summaryData) {
      storage.saveCall(summaryData);
      onAddToast('Call saved to history', 'success');
      setSummaryData(null);
      setCustomerName('');
      setPhone('');
      setNote('');
      setCallType('First Contact');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-200">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-navy-900 dark:text-white transition-colors">Log New Call</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">Paste or type your call notes below. The AI will extract key details.</p>
        </div>
        
        <form onSubmit={handleGenerate} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">Customer Name</label>
              <input 
                type="text" 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                placeholder="e.g. Ravi Kumar"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">Phone Number</label>
              <input 
                type="text" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                placeholder="e.g. 9849123456"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">Call Type</label>
              <select 
                value={callType}
                onChange={(e) => setCallType(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
              >
                <option>First Contact</option>
                <option>Follow-up</option>
                <option>Site Visit Inquiry</option>
                <option>Booking</option>
                <option>Payment</option>
              </select>
            </div>
          </div>

          <VoiceRecorder onAppendText={handleAppendText} />

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">Raw Call Notes (Telugu/English)</label>
              <button 
                type="button" 
                onClick={() => setNote(SAMPLE_NOTE)}
                className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium transition-colors"
              >
                Fill Sample Note
              </button>
            </div>
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows="6"
              className="w-full px-3 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-y"
              placeholder="Paste or type notes here... e.g. Customer called, wants 30 lakhs budget near highway..."
            ></textarea>
            <div className="text-right text-xs text-slate-400 dark:text-slate-500 mt-1 transition-colors">
              {note.length} characters
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-800/50 transition-colors">
              {error}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button 
              type="submit"
              disabled={loading || !note.trim()}
              className="flex items-center gap-2 bg-navy-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {loading ? 'Analyzing...' : 'Generate Summary'}
            </button>
          </div>
        </form>
      </div>

      {loading && (
        <div className="mt-8 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-4">
            <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-navy-900 dark:text-white">Analyzing customer conversation...</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Generating AI summary...</span>
            </div>
          </div>
          
          {/* Skeleton Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden animate-pulse">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-40"></div>
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-full w-16"></div>
              </div>
              <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
            </div>
            <div className="p-5">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6 mb-6"></div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="h-16 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700"></div>
                <div className="h-16 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700"></div>
                <div className="h-16 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700"></div>
                <div className="h-16 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700"></div>
              </div>
              
              <div className="h-20 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700"></div>
            </div>
          </div>
        </div>
      )}

      {summaryData && !loading && (
        <div className="mt-8 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-navy-900 dark:text-white transition-colors">AI Analysis Result</h3>
            <div className="flex gap-3">
              <button 
                onClick={() => setSummaryData(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Discard
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors shadow-sm"
              >
                Save to History
              </button>
            </div>
          </div>
          <SummaryCard data={summaryData} />
        </div>
      )}
    </div>
  );
}
