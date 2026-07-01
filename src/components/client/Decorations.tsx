'use client';

import React from 'react';

// Reusable Dot Grid Pattern (e.g. 5x6 matrix)
export function DotGrid({ className = '', color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg
      width="100"
      height="60"
      viewBox="0 0 100 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none pointer-events-none ${className}`}
    >
      <defs>
        <pattern id="dot-pattern-decor" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="2" fill={color} />
        </pattern>
      </defs>
      <rect width="100" height="60" fill="url(#dot-pattern-decor)" />
    </svg>
  );
}

// Reusable Topographic Contour Lines SVG
export function ContourLines({ className = '', color = 'rgba(47, 58, 143, 0.08)' }: { className?: string; color?: string }) {
  return (
    <svg
      viewBox="0 0 800 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute select-none pointer-events-none w-full h-full ${className}`}
    >
      <path
        d="M-50 150 C 150 200, 250 100, 450 150 C 650 200, 750 300, 900 250"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M-50 200 C 170 260, 280 150, 490 210 C 700 270, 780 380, 900 320"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M-50 250 C 190 320, 310 200, 530 270 C 750 340, 810 460, 900 390"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M-50 300 C 210 380, 340 250, 570 330 C 800 410, 840 540, 900 460"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M-50 350 C 230 440, 370 300, 610 390 C 850 480, 870 620, 900 530"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M-50 400 C 250 500, 400 350, 650 450 C 900 550, 900 700, 900 600"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}

// Reusable Soft Organic Blob / Shape
export function OrganicBlob({
  className = '',
  color1 = '#2F3A8F',
  color2 = '#F2B705',
  blur = 'blur(80px)',
  opacity = 0.15,
}: {
  className?: string;
  color1?: string;
  color2?: string;
  blur?: string;
  opacity?: number;
}) {
  return (
    <div
      className={`absolute rounded-full select-none pointer-events-none transition-all duration-1000 ${className}`}
      style={{
        background: `radial-gradient(circle, ${color1} 0%, ${color2 || color1} 100%)`,
        filter: blur,
        opacity: opacity,
      }}
    />
  );
}
