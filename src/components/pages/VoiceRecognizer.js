import React, { useEffect, useState, useRef } from 'react';
import Navbar from './Navbar';

const keywords = [
  "Plumber", "Electrician", "Carpenter", "Mason", "Painter", "Welder", "Mechanic",
  "Cleaner", "Gardener", "Construction Worker", "Driver", "AC Technician", "Tailor",
  "Housekeeper", "Cook", "Security Guard", "Delivery Boy", "Helper", "Loader", "Other"
];

const VoiceRecognizer = () => {
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser doesn't support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      console.log("Transcript:", transcript);

      const matched = keywords.find(keyword =>
        transcript.toLowerCase().includes(keyword.toLowerCase())
      );

      if (matched) {
        setMessages(prev => [...prev, matched]);
      }
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start(); // Auto-restart
      }
    };

    recognitionRef.current = recognition;
  }, [isListening]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <>
    <Navbar/>
    <div style={{
      maxWidth: 600,
      margin: "2rem auto",
      background: "#121212",
      borderRadius: "8px",
      padding: "1rem",
      color: "#fff",
      fontFamily: "Arial"
    }}>
      <h3 style={{ textAlign: 'center' }}>🎤 Voice Job Detector</h3>

      <div style={{
        height: 300,
        overflowY: "auto",
        border: "1px solid #333",
        padding: "10px",
        background: "#1e1e1e",
        borderRadius: "8px"
      }}>
        {messages.length === 0 && (
          <p style={{ color: "#888" }}>
            Say a job role like "Plumber", "Electrician", etc.
          </p>
        )}
        {messages.map((msg, index) => (
          <div key={index} style={{
            background: "#0d6efd",
            color: "white",
            padding: "8px 12px",
            margin: "6px 0",
            borderRadius: "20px",
            maxWidth: "70%",
            alignSelf: "flex-start"
          }}>
            {msg}
          </div>
        ))}
      </div>

      <button
        onClick={toggleListening}
        style={{
          marginTop: "1rem",
          padding: "10px 20px",
          backgroundColor: isListening ? "#dc3545" : "#198754",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          width: "100%"
        }}
      >
        {isListening ? "🛑 Stop Listening" : "🎙️ Start Listening"}
      </button>
    </div>
    </>
  );
};

export default VoiceRecognizer;
