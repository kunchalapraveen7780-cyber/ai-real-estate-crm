import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { exportToCSV } from '../utils/exportCSV';
import SummaryCard from './SummaryCard';
import DashboardStats from './DashboardStats';
import { Download, Search, Trash2 } from 'lucide-react';

export default function HistoryList({ onAddToast }) {
  const [calls, setCalls] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterInterest, setFilterInterest] = useState('All');
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    loadCalls();
  }, []);

  const loadCalls = () => {
    setCalls(storage.getCalls());
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      storage.deleteCall(id);
      loadCalls();
      onAddToast('Call record deleted', 'success');
    }
  };

  const handleClearAll = () => {
    if (calls.length === 0) return;
    if (window.confirm('Are you sure you want to completely clear all call history? This cannot be undone.')) {
      storage.clearAll();
      loadCalls();
      onAddToast('All history cleared', 'success');
    }
  };

  const filteredCalls = calls.filter(call => {
    const matchesSearch = 
      (call.customerName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (call.phone?.includes(searchTerm));
      
    const matchesInterest = filterInterest === 'All' || call.interestLevel?.toLowerCase() === filterInterest.toLowerCase();
    const matchesType = filterType === 'All' || call.callType === filterType;

    return matchesSearch && matchesInterest && matchesType;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <DashboardStats calls={calls} />

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-6 transition-colors duration-200">
        <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/50 transition-colors duration-200">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <select 
              value={filterInterest}
              onChange={(e) => setFilterInterest(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-sm transition-colors"
            >
              <option value="All">All Interest</option>
              <option value="Hot">Hot</option>
              <option value="Warm">Warm</option>
              <option value="Cold">Cold</option>
            </select>
            
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-sm transition-colors"
            >
              <option value="All">All Types</option>
              <option value="First Contact">First Contact</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Site Visit Inquiry">Site Visit Inquiry</option>
              <option value="Booking">Booking</option>
              <option value="Payment">Payment</option>
            </select>

            <button 
              onClick={() => {
                exportToCSV(filteredCalls);
                onAddToast('Exporting to CSV...', 'success');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button 
              onClick={handleClearAll}
              disabled={calls.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-800/50 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
          </div>
        </div>

        <div className="p-6">
          {filteredCalls.length === 0 ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400 transition-colors">
              <p>No call records found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCalls.map(call => (
                <div key={call.id} className="relative group">
                  <SummaryCard data={call} isHistoryView={true} />
                  <button 
                    onClick={() => handleDelete(call.id)}
                    className="absolute top-4 right-14 p-2 text-slate-300 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
