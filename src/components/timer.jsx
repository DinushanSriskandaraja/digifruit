import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import './styles/timer.css';
const CircularTimer = ({ timeLimit }) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const progress = (timeLeft / timeLimit) * circumference;

  return (
    <div className="timer-container">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="#ddd"
          strokeWidth="10"
          fill="none"
        />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          stroke="#ff4f4f"
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: progress }}
          transition={{ duration: 1, ease: "linear" }}
          strokeLinecap="round"
        />
      </svg>
      <p className="time-text">{timeLeft}s</p>
    </div>
  );
};

export default CircularTimer;
