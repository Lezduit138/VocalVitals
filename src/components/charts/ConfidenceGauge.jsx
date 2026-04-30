import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function ConfidenceGauge({ value, size = 160 }) {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const [counter, setCounter] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10);
    if (start === end) return;

    let totalMilSecDur = parseInt(1500, 10);
    let incrementTime = (totalMilSecDur / end);

    let timer = setInterval(() => {
      start += 1;
      setCounter(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [value]);

  const getColor = (val) => {
    if (val >= 80) return 'text-primary';
    if (val >= 50) return 'text-warning';
    return 'text-danger';
  };

  return (
    <div className="relative inline-flex items-center justify-center transform hover:scale-105 transition-transform" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--color-surface-elevated)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
          className={getColor(value)}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className={`text-4xl font-display font-medium ${getColor(value)}`}>{counter}%</span>
        <span className="text-xs uppercase tracking-wider text-text-muted mt-1">Confidence</span>
      </div>
    </div>
  );
}
