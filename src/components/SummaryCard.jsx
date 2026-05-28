import { MapPin, IndianRupee, Calendar, ClipboardCheck, Phone, User, FileText, CheckCircle2, Share2, MessageCircle, Activity, TrendingUp, Target, AlertTriangle, Lightbulb, BookOpen } from 'lucide-react';
import { formatDateDDMMYYYY } from '../utils/formatDate';

export default function SummaryCard({ data, isHistoryView = false }) {
  if (!data) return null;

  const getInterestColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'hot': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50';
      case 'warm': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
      case 'cold': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const handleCopy = () => {
    const text = `
Call Summary: ${data.customerName || 'Unknown'} (${data.phone || 'N/A'})
Date: ${formatDateDDMMYYYY(data.callDate)} | Type: ${data.callType}
Interest: ${data.interestLevel}
Summary: ${data.summary}
Next Action: ${data.nextAction} (By: ${formatDateDDMMYYYY(data.nextFollowUpDate)})
    `.trim();
    navigator.clipboard.writeText(text);
  };

  const handleShare = async () => {
    const text = `Call Summary for ${data.customerName || 'Unknown'} (${data.phone || 'N/A'})\nInterest: ${data.interestLevel}\nNext Action: ${data.nextAction}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Agent Call Summary',
          text: text,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden relative group transition-colors duration-200">
      {/* Header section */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors duration-200">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h3 className="text-lg font-bold text-navy-900 dark:text-white transition-colors">{data.customerName || 'Unknown Customer'}</h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors ${getInterestColor(data.interestLevel)}`}>
              {data.interestLevel?.toUpperCase() || 'UNKNOWN'}
            </span>
            {data.sentiment && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/50 flex items-center gap-1 transition-colors">
                <Activity className="w-3 h-3" /> {data.sentiment}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-2 transition-colors">
            <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {data.phone || 'No phone'}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formatDateDDMMYYYY(data.callDate)}</span>
          </div>
          {data.leadScore !== undefined && (
            <div className="mt-3 max-w-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase transition-colors">Lead Score</span>
                <span className="text-xs font-bold text-navy-900 dark:text-white transition-colors">{data.leadScore}/100</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 transition-colors">
                <div 
                  className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, Math.max(0, data.leadScore))}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={handleShare}
            className="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors tooltip-trigger"
            title="Share summary"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button 
            onClick={handleCopy}
            className="p-2 text-slate-400 dark:text-slate-500 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-lg transition-colors tooltip-trigger"
            title="Copy to clipboard"
          >
            <ClipboardCheck className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-5">
        {/* Main Summary */}
        <div className="mb-6">
          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed transition-colors">{data.summary}</p>
        </div>

        {/* RAG Answer */}
        {data.ragAnswer && data.ragAnswer !== "Information not available in uploaded documents." && (
          <div className="mb-6 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/50 rounded-lg p-4 transition-colors">
            <p className="text-xs font-bold text-indigo-800 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5 mb-2 transition-colors">
              <BookOpen className="w-4 h-4" /> Document Q&A Match
            </p>
            <p className="text-sm text-indigo-900 dark:text-indigo-200 font-medium transition-colors">{data.ragAnswer}</p>
          </div>
        )}

        {/* Key Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700 transition-colors">
            <div className="p-2 bg-white dark:bg-slate-900 rounded-md shadow-sm text-green-600 dark:text-green-500 transition-colors"><IndianRupee className="w-4 h-4" /></div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5 transition-colors">Budget</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors">{data.budgetMentioned || 'Not mentioned'}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700 transition-colors">
            <div className="p-2 bg-white dark:bg-slate-900 rounded-md shadow-sm text-blue-600 dark:text-blue-500 transition-colors"><MapPin className="w-4 h-4" /></div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5 transition-colors">Location Interest</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors">{data.locationInterest || 'Not mentioned'}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700 transition-colors">
            <div className="p-2 bg-white dark:bg-slate-900 rounded-md shadow-sm text-purple-600 dark:text-purple-500 transition-colors"><CheckCircle2 className="w-4 h-4" /></div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5 transition-colors">Plot Size</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors">{data.plotSizePreference || 'Not mentioned'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700 transition-colors">
            <div className="p-2 bg-white dark:bg-slate-900 rounded-md shadow-sm text-orange-600 dark:text-orange-500 transition-colors"><User className="w-4 h-4" /></div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5 transition-colors">Site Visit</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors">
                {data.siteVisitRequested ? `Requested (${formatDateDDMMYYYY(data.siteVisitDate) || 'No date set'})` : 'Not requested'}
              </p>
            </div>
          </div>
        </div>

        {/* Documents */}
        {data.documentsDiscussed && data.documentsDiscussed.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 transition-colors">
              <FileText className="w-3.5 h-3.5" /> Documents Discussed
            </p>
            <div className="flex flex-wrap gap-2">
              {data.documentsDiscussed.map((doc, i) => (
                <span key={i} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-md transition-colors">
                  {doc}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Box */}
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50 rounded-lg p-4 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-orange-800 dark:text-orange-400 uppercase tracking-wider flex items-center gap-1.5 transition-colors">
              Next Action
            </p>
            {data.nextFollowUpDate && (
              <span className="text-xs font-medium text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/50 px-2 py-0.5 rounded flex items-center gap-1 transition-colors">
                <Calendar className="w-3 h-3" /> Due: {formatDateDDMMYYYY(data.nextFollowUpDate)}
              </span>
            )}
          </div>
          <p className="text-sm text-orange-900 dark:text-orange-200 font-medium transition-colors">{data.nextAction || 'None specified'}</p>
        </div>

        {/* Dashboard Insights */}
        {data.dashboardInsights && (
          <div className="mt-6 border-t border-slate-100 dark:border-slate-700 pt-5 transition-colors">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5 mb-4 transition-colors">
              <Lightbulb className="w-4 h-4 text-orange-500" /> AI Dashboard Insights
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 transition-colors">
                <p className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1 transition-colors"><AlertTriangle className="w-3 h-3" /> Priority</p>
                <p className="text-xs font-bold text-navy-900 dark:text-white transition-colors">{data.dashboardInsights.priority || 'N/A'}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 transition-colors">
                <p className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1 transition-colors"><TrendingUp className="w-3 h-3" /> Conversion Prob.</p>
                <p className="text-xs font-bold text-navy-900 dark:text-white transition-colors">{data.dashboardInsights.conversionProbability || 'N/A'}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 transition-colors">
                <p className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1 transition-colors"><Target className="w-3 h-3" /> Category</p>
                <p className="text-xs font-bold text-navy-900 dark:text-white transition-colors">{data.dashboardInsights.customerCategory || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {/* WhatsApp Message */}
        {data.whatsappFollowUpMessage && (
          <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg p-4 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-green-800 dark:text-green-400 uppercase tracking-wider flex items-center gap-1.5 transition-colors">
                <MessageCircle className="w-4 h-4" /> Suggested WhatsApp Follow-Up
              </p>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(data.whatsappFollowUpMessage);
                }}
                className="text-xs font-medium text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200 bg-green-100 dark:bg-green-900/50 hover:bg-green-200 dark:hover:bg-green-800/80 px-2 py-1 rounded transition-colors"
              >
                Copy Message
              </button>
            </div>
            <p className="text-sm text-green-900 dark:text-green-200 whitespace-pre-wrap font-medium transition-colors">
              {data.whatsappFollowUpMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
