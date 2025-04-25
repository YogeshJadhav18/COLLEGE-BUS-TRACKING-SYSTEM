import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { getDatabase, ref, onValue } from 'firebase/database';

const VoiceChatBot = () => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [busLocation, setBusLocation] = useState(null);

  useEffect(() => {
    const db = getDatabase();
    const busRef = ref(db, 'busLocations/101'); // For Bus 101 only (example)

    onValue(busRef, (snapshot) => {
      const data = snapshot.val();
      setBusLocation(data);
    });
  }, []);

  useEffect(() => {
    if (transcript.toLowerCase().includes("bus 101")) {
      if (busLocation && busLocation.lat && busLocation.lng) {
        const response = `Bus 101 is currently near latitude ${busLocation.lat.toFixed(3)} and longitude ${busLocation.lng.toFixed(3)}`;
        speak(response);
        resetTranscript();
      } else {
        speak("Bus 101 ka location abhi available nahi hai");
        resetTranscript();
      }
    }
  }, [transcript]);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN"; // Use hindi if available
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: false, language: "hi-IN" });
  };

  return (
    <div className="p-4 bg-gray-800 text-white">
      <h2 className="text-lg font-bold mb-2">🎤 Bus Voice Assistant</h2>
      <button onClick={startListening} className="bg-yellow-500 px-4 py-2 rounded text-black">
        बोलो "Bus 101 kaha hai?"
      </button>
      <p className="mt-3">You said: {transcript}</p>
    </div>
  );
};

export default VoiceChatBot;
