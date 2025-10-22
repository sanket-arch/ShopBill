"use client";
import React from "react";

export default function VoiceInput({
  onResult,
  lang = "hi-IN",
  label = "Voice",
  title,
  className,
  style,
}) {
  const [listening, setListening] = React.useState(false);
  const recognitionRef = React.useRef(null);

  React.useEffect(() => {
    const SpeechRecognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SpeechRecognition) return;
    const recog = new SpeechRecognition();
    recog.continuous = false;
    recog.interimResults = false;
    recog.lang = lang;
    recog.onresult = (e) => {
      const text = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join("");
      onResult && onResult(text);
    };
    recog.onend = () => setListening(false);
    recognitionRef.current = recog;
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current = null;
      }
    };
  }, [lang, onResult]);

  const toggle = () => {
    const r = recognitionRef.current;
    if (!r) return alert("Browser does not support SpeechRecognition");
    if (listening) {
      r.stop();
      setListening(false);
    } else {
      try {
        r.start();
        setListening(true);
      } catch {
        // ignore
      }
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      title={title || `Start ${label}`}
      aria-pressed={listening}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 34,
        height: 34,
        padding: 6,
        marginLeft: 8,
        borderRadius: 6,
        cursor: "pointer",
        ...style,
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={listening ? "#c00" : "currentColor"}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z" />
        <path d="M19 11a1 1 0 0 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.92V21a1 1 0 0 0 2 0v-3.08A7 7 0 0 0 19 11z" />
      </svg>
    </button>
  );
}