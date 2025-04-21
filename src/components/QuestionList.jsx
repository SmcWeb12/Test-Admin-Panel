import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [newCorrectOption, setNewCorrectOption] = useState("");

  const fetchQuestions = async () => {
    const snapshot = await getDocs(collection(db, "questions"));
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setQuestions(list);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure to delete this question?");
    if (confirm) {
      await deleteDoc(doc(db, "questions", id));
      fetchQuestions(); // refresh list
    }
  };

  const handleEdit = async (id) => {
    await updateDoc(doc(db, "questions", id), {
      correctOption: newCorrectOption,
    });
    setEditing(null);
    fetchQuestions();
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">📚 All Uploaded Questions</h2>

      {loading ? (
        <p>Loading questions...</p>
      ) : questions.length === 0 ? (
        <p>No questions found.</p>
      ) : (
        <div className="space-y-6">
          {questions.map((q) => (
            <div
              key={q.id}
              className="border rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4"
            >
              <div className="flex-1">
                <img
                  src={q.imageUrl}
                  alt={`Question ${q.id}`}
                  className="w-full md:w-64 h-auto rounded-lg"
                />
              </div>
              <div className="flex flex-col gap-2">
                <p>
                  <strong>Correct Option:</strong> {q.correctOption}
                </p>
                <button
                  onClick={() => handleDelete(q.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => setEditing(q.id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded"
                >
                  Edit
                </button>
                {editing === q.id && (
                  <div className="flex gap-4 mt-4">
                    <select
                      value={newCorrectOption}
                      onChange={(e) => setNewCorrectOption(e.target.value)}
                      className="border p-2 rounded"
                    >
                      <option value="">Select Correct Option</option>
                      {["A", "B", "C", "D"].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleEdit(q.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionList;
