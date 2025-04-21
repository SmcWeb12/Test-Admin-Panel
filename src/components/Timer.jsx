import React, { useEffect, useState } from "react";

const Timer = ({ onTimeOut }) => {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeOut();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeOut]);

  return (
    <div className="text-xl font-bold">
      Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}
    </div>
  );
};

export default Timer;
