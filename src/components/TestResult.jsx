import React from "react";
import RankGraph from "./RankGraph";

const TestResult = ({ results }) => {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Test Results</h2>
      <RankGraph data={results} />
    </div>
  );
};

export default TestResult;
