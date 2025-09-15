import React, { useState } from "react";
import { db, storage } from "../firebase";
import { addDoc, collection, setDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const AdminUpload = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timerSuccess, setTimerSuccess] = useState(false);

  const [questions, setQuestions] = useState([]); // multiple questions
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Timer Save
  const handleTimerSubmit = async (e) => {
    e.preventDefault();
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    try {
      await setDoc(doc(db, "settings", "timer"), { timer: totalSeconds });
      setTimerSuccess(true);
      setHours(0);
      setMinutes(0);
      setSeconds(0);
    } catch (err) {
      console.error("Error setting timer:", err);
      alert("Failed to set the timer. Please try again.");
    }
  };

  // Multiple Image Select
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newQuestions = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      correctOption: "A",
    }));
    setQuestions((prev) => [...prev, ...newQuestions]);
  };

  // Update Correct Option
  const handleOptionChange = (index, option) => {
    const updated = [...questions];
    updated[index].correctOption = option;
    setQuestions(updated);
  };

  // Upload All Questions
  const handleUploadAll = async () => {
    if (questions.length === 0) return alert("Please select at least one question!");

    setUploading(true);
    setSuccess(false);

    try {
      for (const q of questions) {
        const imageRef = ref(storage, `questions/${uuidv4()}`);
        await uploadBytes(imageRef, q.file);
        const imageUrl = await getDownloadURL(imageRef);

        await addDoc(collection(db, "questions"), {
          imageUrl,
          correctOption: q.correctOption,
          marks: 1,
          createdAt: new Date(),
        });
      }

      setSuccess(true);
      setQuestions([]); // reset after upload
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Some questions failed to upload. Try again.");
    }

    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-12 px-6">
      <div className="max-w-7xl mx-auto grid gap-10 grid-cols-1 lg:grid-cols-2">
        {/* Timer Section */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
          <h2 className="text-3xl font-semibold mb-6 flex items-center gap-2">
            ⏱️ Set Test Timer
          </h2>
          <form onSubmit={handleTimerSubmit} className="space-y-5">
            <div className="grid grid-cols-3 gap-4">
              <input
                type="number"
                value={hours}
                onChange={(e) => setHours(parseInt(e.target.value))}
                placeholder="Hours"
                className="input-style"
                min="0"
              />
              <input
                type="number"
                value={minutes}
                onChange={(e) => setMinutes(parseInt(e.target.value))}
                placeholder="Minutes"
                className="input-style"
                min="0"
              />
              <input
                type="number"
                value={seconds}
                onChange={(e) => setSeconds(parseInt(e.target.value))}
                placeholder="Seconds"
                className="input-style"
                min="0"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2.5 rounded-lg text-lg font-medium"
            >
              Save Timer
            </button>
            {timerSuccess && (
              <div className="text-green-600 text-center font-medium mt-2">
                ✅ Timer Saved Successfully!
              </div>
            )}
          </form>
        </div>

        {/* Upload Section */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
          <h2 className="text-3xl font-semibold mb-6 flex items-center gap-2">
            📤 Upload Multiple Questions
          </h2>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="input-style mb-6"
          />

          {/* Preview Grid */}
          {questions.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 mb-6">
              {questions.map((q, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 border rounded-lg shadow-sm"
                >
                  <img
                    src={q.preview}
                    alt={`Preview ${index}`}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                  <div className="grid grid-cols-4 gap-2">
                    {["A", "B", "C", "D"].map((opt) => (
                      <label
                        key={opt}
                        className={`cursor-pointer px-2 py-1 border rounded-md text-center text-sm font-medium transition ${
                          q.correctOption === opt
                            ? "bg-blue-100 border-blue-500 text-blue-800"
                            : "bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`correctOption-${index}`}
                          value={opt}
                          checked={q.correctOption === opt}
                          onChange={() => handleOptionChange(index, opt)}
                          className="hidden"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleUploadAll}
            disabled={uploading}
            className="w-full bg-green-600 hover:bg-green-700 transition text-white py-2.5 rounded-lg text-lg font-medium"
          >
            {uploading ? "Uploading..." : "Upload All Questions"}
          </button>

          {success && (
            <div className="text-green-600 text-center font-medium mt-4">
              ✅ All Questions Uploaded Successfully!
            </div>
          )}
        </div>
      </div>

      {/* Global Input Styles */}
      <style jsx>{`
        .input-style {
          background: #fff;
          border: 1px solid #d1d5db;
          padding: 0.6rem 1rem;
          border-radius: 0.5rem;
          width: 100%;
          font-size: 1rem;
          color: #111827;
          transition: border 0.2s, box-shadow 0.2s;
        }
        .input-style:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </div>
  );
};

export default AdminUpload;

