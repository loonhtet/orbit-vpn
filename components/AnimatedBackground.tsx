"use client";

// [top%, left%, angleDeg, durationS, delayS, length, opacity]
const STARS = [
  [8, 15, 35, 3.5, 0.0, 220, 0.85],
  [18, 60, 32, 4.0, 1.8, 180, 0.75],
  [5, 78, 38, 3.0, 4.2, 260, 0.8],
  [28, 30, 33, 4.5, 0.8, 200, 0.7],
  [12, 88, 36, 3.8, 5.5, 160, 0.78],
  [20, 5, 34, 4.2, 2.9, 240, 0.72],
  [3, 45, 37, 3.2, 7.0, 190, 0.8],
];

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-daylight-background">
      {STARS.map(([top, left, angle, duration, delay, length, opacity], i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: `${top}%`,
            left: `${left}%`,
            transform: `rotate(${angle}deg)`,
            animation: `shoot-${i} ${duration}s ease-in ${delay}s infinite`,
            opacity: 0,
          }}
        >
          <svg
            width={length as number}
            height="6"
            viewBox={`0 0 ${length} 6`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id={`g${i}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6ea87e" stopOpacity="0" />
                <stop
                  offset="60%"
                  stopColor="#7fbf94"
                  stopOpacity={(opacity as number) * 0.5}
                />
                <stop
                  offset="100%"
                  stopColor="#c8f0d8"
                  stopOpacity={opacity as number}
                />
              </linearGradient>
              {/* Glow layer */}
              <linearGradient id={`glow${i}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6ea87e" stopOpacity="0" />
                <stop
                  offset="70%"
                  stopColor="#a8e6bc"
                  stopOpacity={(opacity as number) * 0.3}
                />
                <stop
                  offset="100%"
                  stopColor="#c8f0d8"
                  stopOpacity={(opacity as number) * 0.6}
                />
              </linearGradient>
            </defs>
            {/* Glow blur trail */}
            <rect
              width={length as number}
              height="5"
              y="0.5"
              rx="2.5"
              fill={`url(#glow${i})`}
              filter="blur(2px)"
            />
            {/* Sharp core trail */}
            <rect
              width={length as number}
              height="2"
              y="2"
              rx="1"
              fill={`url(#g${i})`}
            />
            {/* Bright head */}
            <circle
              cx={length as number}
              cy="3"
              r="2.8"
              fill="white"
              fillOpacity={(opacity as number) * 0.9}
            />
            <circle
              cx={length as number}
              cy="3"
              r="4"
              fill="#c8f0d8"
              fillOpacity={(opacity as number) * 0.4}
            />
          </svg>
        </div>
      ))}

      {/* Soft vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 85% 85% at 50% 50%, transparent 35%, rgba(235,242,237,0.50) 100%)",
        }}
      />

      <style>{`
        ${STARS.map(
          (_, i) => `
          @keyframes shoot-${i} {
            0%   { opacity: 0; transform: rotate(${STARS[i][2]}deg) translate(-20px,  0px); }
            6%   { opacity: 1; }
            50%  { opacity: 0; transform: rotate(${STARS[i][2]}deg) translate(420px,  0px); }
            100% { opacity: 0; transform: rotate(${STARS[i][2]}deg) translate(420px,  0px); }
          }
        `,
        ).join("")}
      `}</style>
    </div>
  );
}
