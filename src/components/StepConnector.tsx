import React from "react";

interface StepConnectorProps {
  direction: "left" | "right";
}

const StepConnector: React.FC<StepConnectorProps> = ({ direction }) => {
  const pathD =
    direction === "right"
      ? "M0 0 H44 V40 H88"
      : "M88 0 H44 V40 H0";

  return (
    <svg
      width="88"
      height="40"
      viewBox="0 0 88 40"
      className="text-indigo-400"
    >
      <path d={pathD} fill="none" stroke="#a5b4fc" strokeWidth={2} />
    </svg>
  );
};

export default StepConnector;
