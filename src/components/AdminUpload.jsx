import React, { useState } from "react";
import { db, storage } from "../firebase";
import { setDoc, doc, addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const AdminUpload = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timerSuccess, setTimerSuccess] = useState(false);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [correctOption, setCorrectOption] = useState("A");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) return alert("Please select an image!");

    setUploading(true);
    setSuccess(false);

    try {
      const imageRef = ref(storage, `questions/${uuidv4()}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      await addDoc(collection(db, "questions"), {
        imageUrl,
        correctOption,
        marks: 1,
        createdAt: new Date(),
      });

      setSuccess(true);
      setImage(null);
      setPreview("");
    } catch (err) {
      alert("Upload failed. Try again.");
      console.error(err);
    }

    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 py-12 px-6">
      <div className="max-w-6xl mx-auto grid gap-10 grid-cols-1 md:grid-cols-2">
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
              <div className="text-green-600 text-center font-medium mt-2 flex justify-center items-center gap-1">
                ✅ Timer Saved Successfully!
              </div>
            )}
          </form>
        </div>

        {/* Upload Section */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
          <h2 className="text-3xl font-semibold mb-6 flex items-center gap-2">
            📤 Upload Question
          </h2>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="input-style mb-4"
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto rounded-xl shadow mb-4 border"
            />
          )}

          <div className="grid grid-cols-4 gap-3 mb-5">
            {["A", "B", "C", "D"].map((opt) => (
              <label
                key={opt}
                className={`cursor-pointer px-4 py-2 border rounded-lg text-center font-medium transition ${
                  correctOption === opt
                    ? "bg-blue-100 border-blue-500 text-blue-800"
                    : "bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="correctOption"
                  value={opt}
                  checked={correctOption === opt}
                  onChange={() => setCorrectOption(opt)}
                  className="hidden"
                />
                {opt}
              </label>
            ))}
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full bg-green-600 hover:bg-green-700 transition text-white py-2.5 rounded-lg text-lg font-medium"
          >
            {uploading ? "Uploading..." : "Upload Question"}
          </button>

          {success && (
            <div className="text-green-600 text-center font-medium mt-4 flex justify-center items-center gap-1">
              ✅ Question Uploaded Successfully!
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
