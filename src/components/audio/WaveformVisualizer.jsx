import { useEffect, useRef } from 'react';

export default function WaveformVisualizer({ isRecording, width = '100%', height = 100 }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const drawWaveform = () => {
      ctx.clearRect(0, 0, width, height);

      const barWidth = 4;
      const barGap = 6;
      const barCount = Math.floor(width / (barWidth + barGap));
      const centerY = height / 2;

      for (let i = 0; i < barCount; i++) {
        // Random height between 10% and 100% of half container height
        const variance = isRecording ? Math.random() : Math.sin(Date.now() / 500 + i) * 0.5 + 0.5;
        const barHeight = (height / 2) * (isRecording ? variance * 0.9 + 0.1 : variance * 0.3 + 0.1);
        
        ctx.fillStyle = '#00d4aa'; // primary teal
        
        const x = i * (barWidth + barGap);
        // Add a slight glow effect
        ctx.shadowBlur = isRecording ? 10 : 0;
        ctx.shadowColor = 'rgba(0, 212, 170, 0.5)';
        
        // Draw top half
        ctx.fillRect(x, centerY - barHeight, barWidth, barHeight);
        // Draw bottom half
        ctx.fillRect(x, centerY, barWidth, barHeight);
      }

      animationRef.current = requestAnimationFrame(drawWaveform);
    };

    drawWaveform();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full"
      style={{ width, height: `${height}px` }} 
      width={1000} 
      height={height * 2} // Retina scaling placeholder
    />
  );
}
