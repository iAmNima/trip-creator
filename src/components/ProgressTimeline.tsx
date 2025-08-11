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

  // Track which step is currently in view based on scroll position
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll("[data-step-index]")
    ) as HTMLElement[];

    const updateActive = () => {
      let idx = 0;
      const middle = window.innerHeight / 2;
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].getBoundingClientRect().top - middle <= 0) {
          idx = i;
        } else {
          break;
        }
      }
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1) {
        idx = elements.length - 1;
      }
      setActiveIndex(idx);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [steps]);

  const firstIndexByDay = new Map<number, number>();
  steps.forEach((s, i) => {
    if (!firstIndexByDay.has(s.day)) {
      firstIndexByDay.set(s.day, i);
    }
  });

  const activeStep = steps[activeIndex];
  const activeLabel = activeStep
    ? firstIndexByDay.get(activeStep.day) === activeIndex
      ? `Day ${activeStep.day}`
      : `${activeStep.title} - ${activeStep.location}`
    : "";
  const progress = steps.length > 1 ? activeIndex / (steps.length - 1) : 0;

  return (
    <div className="fixed left-8 top-24 bottom-24 w-8 z-10">
      <div className="relative h-full w-2 bg-indigo-100 rounded-full">
        <div
          className="absolute left-0 top-0 w-full bg-indigo-600 rounded-full transition-all duration-300 ease-out"
          style={{ height: `${progress * 100}%` }}
        />
        {steps.map((s, i) => {
          const isDayStart = firstIndexByDay.get(s.day) === i;
          const size = isDayStart ? "w-4 h-4" : "w-3 h-3";
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
                setActiveIndex(i);
              }}
              className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-indigo-600 rounded-full shadow cursor-pointer ${size} ${i <= activeIndex ? "bg-indigo-600" : "bg-white"}`}
              style={{ top: `${top}%` }}
            />
          );
        })}

        {activeStep && (
          <div
            className="absolute left-full ml-4 -translate-y-1/2 bg-indigo-600 text-white shadow-lg px-3 py-1 rounded-full text-xs whitespace-nowrap"
            style={{ top: `${progress * 100}%` }}
          >
            {activeLabel}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTimeline;
