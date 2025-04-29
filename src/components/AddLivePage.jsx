// filename: AddLivePage.jsx
import { useState } from "react";
import { db } from "../firebase";
import { doc, setDoc, collection, addDoc, getDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";

export default function AddLivePage() {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to extract YouTube video ID from various URL formats
  const extractYouTubeVideoId = (url) => {
    const regex =
      /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleSubmit = async () => {
    setError("");
    const videoId = extractYouTubeVideoId(link);
    if (!videoId) {
      setError("❌ Please enter a valid YouTube link.");
      return;
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    try {
      setLoading(true);
      await setDoc(doc(db, "liveStream", "currentLive"), {
        url: embedUrl,
        isLive: true,
        timestamp: new Date(),
      });
      alert("✅ Live class started!");
      setLink("");
    } catch (err) {
      console.error(err);
      setError("⚠️ Failed to start live stream. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEndLive = async () => {
    setError("");
    try {
      setLoading(true);
      const ref = doc(db, "liveStream", "currentLive");
      const snapshot = await getDoc(ref);
      const data = snapshot.data();

      if (!data?.url) {
        setError("⚠️ No active live stream found.");
        return;
      }

      await addDoc(collection(db, "pastClasses"), {
        url: data.url,
        title: `Class on ${new Date().toLocaleDateString()}`,
        date: new Date(),
      });

      await setDoc(ref, { url: "", isLive: false });

      alert("✅ Live class ended and saved.");
    } catch (err) {
      console.error(err);
      setError("❌ Failed to end live stream.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🔴 Manage Live Class</h2>

      {error && (
        <div className="text-red-500 bg-red-100 px-4 py-2 rounded mb-4 text-sm">{error}</div>
      )}

      <label className="block text-sm font-medium mb-1 text-gray-700">
        YouTube Link:
      </label>
      <input
        type="text"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Paste any YouTube link here"
        className="border w-full p-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex gap-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded shadow disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Start Live"}
        </button>

        <button
          onClick={handleEndLive}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded shadow disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "End Live"}
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        You can paste any valid YouTube link (e.g., watch, share, live), and it will be converted automatically.
      </p>
    </div>
  );
}
