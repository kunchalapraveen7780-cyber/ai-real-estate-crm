// Simple wrapper for Web Speech API

export function createSpeechRecognition(language = 'te-IN', onResult, onError, onEnd) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = language;

  let finalTranscript = '';

  recognition.onresult = (event) => {
    let interimTranscript = '';
    
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript + ' ';
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }
    
    onResult(finalTranscript, interimTranscript);
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error", event.error);
    if (onError) onError(event.error);
  };

  recognition.onend = () => {
    if (onEnd) onEnd(finalTranscript);
  };

  return {
    start: () => {
      finalTranscript = '';
      try {
        recognition.start();
      } catch (e) {
        console.error("Recognition already started", e);
      }
    },
    stop: () => {
      recognition.stop();
    },
    abort: () => {
      recognition.abort();
    }
  };
}
