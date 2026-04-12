import React, { useEffect, useRef, useState } from 'react';

interface AudioWaveformProps {
  url: string;
  currentTime: number;
  duration: number;
  activeColor?: string;
  inactiveColor?: string;
  height?: number;
  onClick?: (percent: number) => void;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  url,
  currentTime,
  duration,
  activeColor = '#ec4899',
  inactiveColor = 'rgba(255,255,255,0.1)',
  height = 32,
  onClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [waveData, setWaveData] = useState<number[]>([]);

  // Decode audio and extract waveform
  useEffect(() => {
    if (!url) return;
    let cancelled = false;

    const decode = async () => {
      try {
        const res = await fetch(url);
        const buf = await res.arrayBuffer();
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const audio = await ctx.decodeAudioData(buf);
        ctx.close();
        if (cancelled) return;

        const raw = audio.getChannelData(0);
        const barCount = 80;
        const samplesPerBar = Math.floor(raw.length / barCount);
        const bars: number[] = [];

        for (let i = 0; i < barCount; i++) {
          const start = i * samplesPerBar;
          const end = Math.min(start + samplesPerBar, raw.length);
          let sum = 0;
          for (let j = start; j < end; j++) sum += raw[j] * raw[j];
          bars.push(Math.sqrt(sum / (end - start)));
        }

        // Normalize
        const max = Math.max(...bars, 0.01);
        setWaveData(bars.map(b => Math.max(b / max, 0.05)));
      } catch {
        // Silently fail — player still works without waveform
      }
    };

    decode();
    return () => { cancelled = true; };
  }, [url]);

  // Draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || waveData.length === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;

    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const gap = 1;
    const barW = (w - gap * (waveData.length - 1)) / waveData.length;
    const progress = duration > 0 ? currentTime / duration : 0;

    waveData.forEach((amp, i) => {
      const barH = Math.max(amp * h * 0.9, 2);
      const x = i * (barW + gap);
      const y = (h - barH) / 2;
      const played = (i + 0.5) / waveData.length <= progress;

      ctx.fillStyle = played ? activeColor : inactiveColor;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, 1);
      ctx.fill();
    });
  }, [waveData, currentTime, duration, activeColor, inactiveColor]);

  const handleClick = (e: React.MouseEvent) => {
    if (!onClick || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    onClick((e.clientX - rect.left) / rect.width);
  };

  if (waveData.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="w-full cursor-pointer"
      style={{ height }}
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
};
