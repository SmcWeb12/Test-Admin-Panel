import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const AdminResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    const snapshot = await getDocs(collection(db, "studentResults"));
    const resultsList = snapshot.docs.map((doc) => doc.data());

    // Remove duplicate based on name + batchTime + phoneNumber
    const uniqueResultsMap = new Map();

    resultsList.forEach((result) => {
      const key = `${result.name}-${result.batchTime}-${result.phoneNumber}`;
      if (!uniqueResultsMap.has(key)) {
        uniqueResultsMap.set(key, result);
      }
    });

    const uniqueResults = Array.from(uniqueResultsMap.values());
    setResults(uniqueResults);
    setLoading(false);
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl shadow-xl">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        📊 Student Results
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading results...</p>
      ) : results.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No results found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {results.map((result, index) => (
            <div
              key={index}
              className="p-5 bg-white rounded-lg shadow-md hover:shadow-lg transition"
            >
              <h3 className="text-xl font-bold text-gray-700 mb-1">
                {result.name}
              </h3>
              <p className="text-gray-600">📞 Phone: {result.phoneNumber || "N/A"}</p>
              <p className="text-gray-600">📚 Batch: {result.batchTime || "N/A"}</p>
              <p className="text-gray-600">📝 Score: {result.score}</p>
              <p className="text-sm text-gray-500 mt-2">
                {result.timestamp?.seconds
                  ? new Date(result.timestamp.seconds * 1000).toLocaleString()
                  : "No timestamp"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminResults;
