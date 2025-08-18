import React from "react";

interface FootstepPathProps {
  steps: number;
}

const FootstepPath: React.FC<FootstepPathProps> = ({ steps }) => {
  if (steps < 2) return null;

  const segmentHeight = 160;
  const width = 400;
  const leftX = 80;
  const rightX = width - 80;

  let d = `M${leftX} 0`;
  let x = leftX;
  let y = 0;

  for (let i = 0; i < steps - 1; i++) {
    const nextX = x === leftX ? rightX : leftX;
    const controlX = (x + nextX) / 2;
    const nextY = y + segmentHeight;
    d += ` Q ${controlX} ${y + segmentHeight / 2} ${nextX} ${nextY}`;
    x = nextX;
    y = nextY;
  }

  const height = (steps - 1) * segmentHeight;

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="absolute inset-0 z-0 pointer-events-none"
    >
      <path
        d={d}
        fill="none"
        stroke="#a5b4fc"
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray="1 24"
      />
    </svg>
  );
};

export default FootstepPath;

