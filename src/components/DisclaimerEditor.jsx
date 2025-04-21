import React, { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const DisclaimerEditor = () => {
  const [disclaimer, setDisclaimer] = useState("");
  const [showToast, setShowToast] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    const fetchDisclaimer = async () => {
      const ref = doc(db, "config", "disclaimer");
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setDisclaimer(snap.data().text || "");
      }
    };
    fetchDisclaimer();
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [disclaimer]);

  const handleSave = async () => {
    const ref = doc(db, "config", "disclaimer");
    await setDoc(ref, { text: disclaimer });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      {/* Header */}
      <div className="mb-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          📘 Edit Test Disclaimer
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          This will be shown before the test starts.
        </p>
      </div>

      {/* Textarea */}
      <div className="max-w-3xl mx-auto">
        <textarea
          ref={textareaRef}
          value={disclaimer}
          onChange={(e) => setDisclaimer(e.target.value)}
          placeholder="Chapter: Motion in One Dimension\nMarks: 30\nTime: 45 minutes"
          className="w-full bg-gray-50 border border-gray-300 text-gray-800 rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-base leading-relaxed transition-all"
        />

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg py-2.5 rounded-xl transition-all shadow"
        >
          💾 Save Disclaimer
        </button>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in">
          ✅ <span className="text-sm font-medium">Disclaimer saved successfully!</span>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DisclaimerEditor;
