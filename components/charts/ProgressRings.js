/**
 * Progress Rings Component
 * Circular visualization of consistency and progress
 */

import { useEffect, useRef } from 'react';

/**
 * Main Progress Rings - Multiple metrics in concentric circles
 */
export default function ProgressRings({ metrics = {} }) {
  const canvasRef = useRef(null);

  const {
    vows = 0,
    reflections = 0,
    consistency = 0
  } = metrics;

  useEffect(() => {
    drawRings();
  }, [vows, reflections, consistency]);

  const drawRings = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ring configuration
    const rings = [
      { radius: 90, value: consistency, color: '#5FD3A5', label: 'Consistency' },
      { radius: 70, value: reflections, color: '#C6A664', label: 'Reflections' },
      { radius: 50, value: vows, color: '#90EE90', label: 'Vows' }
    ];

    // Draw each ring
    rings.forEach(ring => {
      // Background
      ctx.beginPath();
      ctx.arc(centerX, centerY, ring.radius, 0, 2 * Math.PI);
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 12;
      ctx.stroke();

      // Progress
      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + (ring.value / 100) * 2 * Math.PI;

      ctx.beginPath();
      ctx.arc(centerX, centerY, ring.radius, startAngle, endAngle);
      ctx.strokeStyle = ring.color;
      ctx.lineWidth = 12;
      ctx.lineCap = 'round';
      ctx.stroke();
    });

    // Center text
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Progress', centerX, centerY);
  };

  return (
    <div className="progress-rings text-center">
      <canvas
        ref={canvasRef}
        width={250}
        height={250}
        className="mx-auto"
      />
      
      {/* Legend */}
      <div className="mt-4 space-y-2">
        <LegendItem color="#5FD3A5" label="Consistency" value={consistency} />
        <LegendItem color="#C6A664" label="Reflections" value={reflections} />
        <LegendItem color="#90EE90" label="Vows" value={vows} />
      </div>
    </div>
  );
}

function LegendItem({ color, label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center space-x-2">
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="observation-text">{label}</span>
      </div>
      <span className="font-medium awareness-text">{Math.round(value)}%</span>
    </div>
  );
}

/**
 * Single Ring - For individual metrics
 */
export function SingleRing({ value = 0, size = 150, color = '#C6A664', label = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    drawRing();
  }, [value]);

  const drawRing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 15;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 10;
    ctx.stroke();

    // Progress
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (value / 100) * 2 * Math.PI;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = color;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Center value
    ctx.fillStyle = '#374151';
    ctx.font = `bold ${size > 100 ? '32' : '24'}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(value)}%`, centerX, centerY);
  };

  return (
    <div className="single-ring text-center">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="mx-auto"
      />
      {label && (
        <div className="mt-2 text-sm observation-text">{label}</div>
      )}
    </div>
  );
}

/**
 * Vow Progress Ring with Days
 */
export function VowProgressRing({ currentDay = 0, totalDays = 30, size = 180 }) {
  const canvasRef = useRef(null);
  const progress = (currentDay / totalDays) * 100;

  useEffect(() => {
    drawVowRing();
  }, [currentDay, totalDays]);

  const drawVowRing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 15;
    ctx.stroke();

    // Progress with gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#C6A664');
    gradient.addColorStop(1, '#5FD3A5');

    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (progress / 100) * 2 * Math.PI;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Center text - current day
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(currentDay, centerX, centerY - 10);

    // "of X days" text
    ctx.font = '14px Arial';
    ctx.fillStyle = '#6b7280';
    ctx.fillText(`of ${totalDays} days`, centerX, centerY + 20);
  };

  return (
    <div className="vow-progress-ring">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="mx-auto"
      />
    </div>
  );
}

/**
 * Animated Ring (for celebrations)
 */
export function AnimatedRing({ value = 0, size = 200, animate = true }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const currentValueRef = useRef(0);

  useEffect(() => {
    if (animate) {
      animateRing();
    } else {
      drawStatic();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, animate]);

  const animateRing = () => {
    const targetValue = value;
    const increment = targetValue / 60; // Animate over 60 frames

    const animate = () => {
      if (currentValueRef.current < targetValue) {
        currentValueRef.current = Math.min(currentValueRef.current + increment, targetValue);
        draw(currentValueRef.current);
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();
  };

  const drawStatic = () => {
    currentValueRef.current = value;
    draw(value);
  };

  const draw = (currentValue) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 15;
    ctx.stroke();

    // Progress
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#FFD700');
    gradient.addColorStop(0.5, '#C6A664');
    gradient.addColorStop(1, '#5FD3A5');

    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (currentValue / 100) * 2 * Math.PI;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Glow effect at end
    if (currentValue > 0) {
      const glowX = centerX + radius * Math.cos(endAngle);
      const glowY = centerY + radius * Math.sin(endAngle);
      
      const glowGradient = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, 20);
      glowGradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
      glowGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
      
      ctx.fillStyle = glowGradient;
      ctx.fillRect(glowX - 20, glowY - 20, 40, 40);
    }

    // Center text
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(currentValue)}%`, centerX, centerY);
  };

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="mx-auto"
    />
  );
}

/**
 * Multi-Metric Dashboard Rings
 */
export function DashboardRings({ metrics = {} }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="text-center">
        <SingleRing 
          value={metrics.vows || 0}
          size={120}
          color="#90EE90"
          label="Vows"
        />
      </div>
      <div className="text-center">
        <SingleRing 
          value={metrics.reflections || 0}
          size={120}
          color="#C6A664"
          label="Reflections"
        />
      </div>
      <div className="text-center">
        <SingleRing 
          value={metrics.consistency || 0}
          size={120}
          color="#5FD3A5"
          label="Consistency"
        />
      </div>
      <div className="text-center">
        <SingleRing 
          value={metrics.alignment || 0}
          size={120}
          color="#4169E1"
          label="Alignment"
        />
      </div>
    </div>
  );
}
