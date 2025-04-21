import React, { useState } from "react";
import Timer from "./Timer";

const TestPage = () => {
  const [testFinished, setTestFinished] = useState(false);

  const handleTimeOut = () => {
    setTestFinished(true);
    alert("Test time is over! Submitting...");
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      {!testFinished ? (
        <>
          <Timer onTimeOut={handleTimeOut} />
          {/* Your Test Questions Here */}
        </>
      ) : (
        <div>Test Submitted!</div>
      )}
    </div>
  );
};

export default TestPage;
