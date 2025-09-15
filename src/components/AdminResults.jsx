import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const AdminResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const fetchResults = async () => {
    const snapshot = await getDocs(collection(db, "studentResults"));
    const resultsList = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

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

  // Toggle select one
  const handleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  // Toggle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
      setSelectAll(false);
    } else {
      setSelected(results.map((r) => r.id));
      setSelectAll(true);
    }
  };

  // Delete selected
  const handleDeleteSelected = async () => {
    if (selected.length === 0) return alert("No results selected!");
    if (!window.confirm("Are you sure you want to delete selected results?"))
      return;

    await Promise.all(selected.map((id) => deleteDoc(doc(db, "studentResults", id))));
    fetchResults();
    setSelected([]);
    setSelectAll(false);
  };

  // Print Results
  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Student Results</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #555; padding: 8px; text-align: left; }
            th { background-color: #f0f0f0; }
            h2 { text-align: center; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h2>Student Results</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Batch</th>
                <th>Score</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${results
                .map(
                  (r) => `
                <tr>
                  <td>${r.name}</td>
                  <td>${r.phoneNumber || "N/A"}</td>
                  <td>${r.batchTime || "N/A"}</td>
                  <td>${r.score}</td>
                  <td>${
                    r.timestamp?.seconds
                      ? new Date(r.timestamp.seconds * 1000).toLocaleString()
                      : "No timestamp"
                  }</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl shadow-xl">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        📊 Student Results
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading results...</p>
      ) : results.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No results found.</p>
      ) : (
        <>
          {/* Action Buttons */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="w-5 h-5"
                />
                <span className="text-gray-700 font-medium">Select All</span>
              </label>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteSelected}
                className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
              >
                🗑 Delete Selected
              </button>
              <button
                onClick={handlePrint}
                className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
              >
                🖨 Print All
              </button>
            </div>
          </div>

          {/* Grid of Results */}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {results.map((result) => (
              <div
                key={result.id}
                className={`p-5 rounded-lg shadow-md transition ${
                  selected.includes(result.id)
                    ? "bg-blue-100 border border-blue-400"
                    : "bg-white"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold text-gray-700">
                    {result.name}
                  </h3>
                  <input
                    type="checkbox"
                    checked={selected.includes(result.id)}
                    onChange={() => handleSelect(result.id)}
                    className="w-5 h-5"
                  />
                </div>
                <p className="text-gray-600">📞 {result.phoneNumber || "N/A"}</p>
                <p className="text-gray-600">📚 {result.batchTime || "N/A"}</p>
                <p className="text-gray-600">📝 Score: {result.score}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {result.timestamp?.seconds
                    ? new Date(result.timestamp.seconds * 1000).toLocaleString()
                    : "No timestamp"}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminResults;
