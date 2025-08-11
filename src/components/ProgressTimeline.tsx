import React, { useEffect, useRef, useState } from "react";

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
  const [scrollProgress, setScrollProgress] = useState(0); // 0..1
  const visible = useRef(new Set<number>());

  // Observe step elements to track which one is active
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number((entry.target as HTMLElement).dataset.stepIndex);
          if (entry.isIntersecting) {
            visible.current.add(idx);
          } else {
            visible.current.delete(idx);
          }
        });
        const maxIdx = visible.current.size
          ? Math.max(...Array.from(visible.current))
          : 0;
        setActiveIndex(maxIdx);
      },
      { threshold: 0.6 }
    );

    const elements = document.querySelectorAll("[data-step-index]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [steps]);

  // Smooth progress based on overall scroll position
  useEffect(() => {
    const updateProgress = () => {
      const elements = document.querySelectorAll("[data-step-index]");
      if (!elements.length) return;

      const first = elements[0] as HTMLElement;
      const last = elements[elements.length - 1] as HTMLElement;

      const start = first.getBoundingClientRect().top + window.scrollY;
      const end =
        last.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
      const current = window.scrollY;
      const ratio = (current - start) / (end - start);
      setScrollProgress(Math.max(0, Math.min(1, ratio)));
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
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

  return (
    <div className="fixed left-8 top-24 bottom-24 w-8 z-10">
      <div className="relative h-full w-2 bg-indigo-100 rounded-full">
        <div
          className="absolute left-0 top-0 w-full bg-indigo-600 rounded-full transition-all duration-300 ease-out"
          style={{ height: `${scrollProgress * 100}%` }}
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
              }}
              className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-indigo-600 rounded-full shadow cursor-pointer ${size}`}
              style={{ top: `${top}%` }}
            />
          );
        })}

        {activeStep && (
          <div
            className="absolute left-full ml-4 -translate-y-1/2 bg-indigo-600 text-white shadow-lg px-3 py-1 rounded-full text-xs whitespace-nowrap"
            style={{ top: `${scrollProgress * 100}%` }}
          >
            {activeLabel}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTimeline;
