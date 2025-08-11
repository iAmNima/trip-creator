import React, { useEffect, useState } from "react";

interface StepItem {
  day: number;
  title: string;
  location: string;
}

interface ProgressTimelineProps {
  steps: StepItem[];
}

const ProgressTimeline: React.FC<ProgressTimelineProps> = ({ steps }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.stepIndex);
            setActiveIndex((prev) => Math.max(prev, idx));
          }
        });
      },
      { threshold: 0.6 }
    );

    const elements = document.querySelectorAll("[data-step-index]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [steps]);

  const progress = ((activeIndex + 1) / steps.length) * 100;

  const firstIndexByDay = new Map<number, number>();
  steps.forEach((s, i) => {
    if (!firstIndexByDay.has(s.day)) {
      firstIndexByDay.set(s.day, i);
    }
  });

  return (
    <div className="fixed left-4 top-24 bottom-24 w-6 z-10">
      <div className="relative h-full w-1 bg-gray-200 rounded-full">
        <div
          className="absolute left-0 top-0 w-full bg-indigo-500 rounded-full"
          style={{ height: `${progress}%` }}
        />
        {steps.map((s, i) => {
          const isDayStart = firstIndexByDay.get(s.day) === i;
          const size = isDayStart ? "w-3 h-3" : "w-2 h-2";
          const top = (i / (steps.length - 1)) * 100;
          const label = isDayStart ? `Day ${s.day}` : `${s.title} - ${s.location}`;
          return (
            <div
              key={i}
              title={label}
              onClick={() => {
                const el = document.querySelector(
                  `[data-step-index='${i}']`
                );
                el?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-indigo-500 rounded-full cursor-pointer ${size}`}
              style={{ top: `${top}%` }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTimeline;

