import { CheckCircle2, XCircle, X } from 'lucide-react';
import { useEffect } from 'react';

export default function ToastNotification({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${
        isSuccess ? 'bg-white border-green-200 text-slate-800' : 'bg-white border-red-200 text-slate-800'
      }`}>
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
        ) : (
          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
        )}
        <p className="text-sm font-medium pr-6">{toast.message}</p>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors ml-auto"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
