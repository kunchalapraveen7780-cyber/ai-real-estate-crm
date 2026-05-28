import { useState, useEffect, useRef } from 'react';
import { Mic, Square, AlertCircle, Volume2 } from 'lucide-react';
import { createSpeechRecognition } from '../utils/speechRecognition';

export default function VoiceRecorder({ onAppendText }) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState('');
  const [interimText, setInterimText] = useState('');
  const [language, setLanguage] = useState('te-IN'); // default to Telugu India

  const recognitionRef = useRef(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const handleStart = () => {
    setError('');
    
    const rec = createSpeechRecognition(
      language,
      (finalText, interim) => {
        setInterimText(interim);
        // We append final text immediately when it's finalized chunk by chunk
        if (finalText) {
          onAppendText(finalText);
          // Restart the session to keep it clean (or let it run if continuous handles it well)
        }
      },
      (err) => {
        if (err === 'not-allowed') {
          setError('Microphone access denied. Please allow permissions.');
        } else if (err === 'network') {
          setError('Network error. Speech recognition relies on Google servers. If you are using Brave or Chromium, it may be blocked. Please try Google Chrome or Microsoft Edge.');
        } else {
          // ignore no-speech errors for continuous
          if (err !== 'no-speech') {
             console.log(err);
          }
        }
      },
      (finalCompleteText) => {
        setIsRecording(false);
        setInterimText('');
      }
    );

    if (!rec) {
      setError('Speech recognition is not supported in this browser. Try Chrome or Edge.');
      return;
    }

    recognitionRef.current = rec;
    rec.start();
    setIsRecording(true);
  };

  const handleStop = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    setInterimText('');
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-4 flex flex-col sm:flex-row sm:items-center gap-4 shadow-inner transition-colors duration-200">
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          {isRecording ? (
            <div className="relative flex items-center justify-center w-10 h-10">
              <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-75"></div>
              <div className="relative bg-red-500 rounded-full p-2 text-white shadow-lg">
                <Mic className="w-5 h-5 animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="bg-slate-200 dark:bg-slate-700 rounded-full p-2 text-slate-500 dark:text-slate-400 transition-colors">
              <Volume2 className="w-5 h-5" />
            </div>
          )}
          
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 transition-colors">Voice Dictation</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">
              {isRecording ? 'Listening... speak clearly.' : 'Record your call notes instantly.'}
            </p>
          </div>
        </div>
        
        {isRecording && interimText && (
          <p className="text-xs text-slate-600 dark:text-slate-300 italic bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700 truncate transition-colors">
            {interimText}
          </p>
        )}
        
        {error && (
          <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-1 transition-colors">
            <AlertCircle className="w-3.5 h-3.5" /> {error}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 self-end sm:self-center">
        <select 
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={isRecording}
          className="text-xs px-2 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-none disabled:opacity-50 transition-colors"
        >
          <option value="te-IN">Telugu (te-IN)</option>
          <option value="en-IN">English (en-IN)</option>
        </select>

        {!isRecording ? (
          <button 
            type="button"
            onClick={handleStart}
            className="flex items-center gap-1.5 px-4 py-2 bg-navy-900 dark:bg-orange-500 hover:bg-slate-800 dark:hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <Mic className="w-4 h-4" /> Start
          </button>
        ) : (
          <button 
            type="button"
            onClick={handleStop}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/50 text-red-700 dark:text-red-400 text-sm font-bold rounded-lg transition-colors border border-red-200 dark:border-red-800/50"
          >
            <Square className="w-4 h-4" /> Stop
          </button>
        )}
      </div>
    </div>
  );
}
