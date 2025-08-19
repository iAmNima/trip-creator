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

  // Track which step is nearest the viewport midpoint
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll("[data-step-index]")
    ) as HTMLElement[];

    const updateActive = () => {
      if (!elements.length) return;

      const viewportMid = window.innerHeight / 2;
      let bestIdx = 0;
      let bestDist = Infinity;

      for (let i = 0; i < elements.length; i++) {
        const rect = elements[i].getBoundingClientRect();
        const elCenter = rect.top + rect.height / 2;
        const dist = Math.abs(elCenter - viewportMid);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      }

      // If scrolled to the bottom, force the last step as active
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2 // slight tolerance
      ) {
        bestIdx = elements.length - 1;
      }

      setActiveIndex(bestIdx);
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
    ? `Day ${activeStep.day} - ${activeStep.title}`
    : "";

  const progress =
    steps.length > 1 ? (activeIndex / (steps.length - 1)) * 100 : 0;

  // Scroll to step, centering it in the viewport
  const scrollToStep = (i: number) => {
    const el = document.querySelector(
      `[data-step-index='${i}']`
    ) as HTMLElement | null;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const elCenter = rect.top + window.scrollY + rect.height / 2;
    const targetScroll = elCenter - window.innerHeight / 2;

    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  return (
    <>
      {/* Desktop progress bar */}
      <div className="hidden md:block fixed left-8 top-24 bottom-24 w-8 z-10">
        <div className="relative h-full w-2 bg-indigo-100 rounded-full">
          <div
            className="absolute left-0 top-0 w-full bg-indigo-600 rounded-full transition-all duration-300 ease-out"
            style={{ height: `${progress}%` }}
          />
          {steps.map((s, i) => {
            const isDayStart = firstIndexByDay.get(s.day) === i;
            const size = isDayStart ? "w-4 h-4" : "w-3 h-3";
            const top = (i / (steps.length - 1)) * 100;

            // Tooltips without location
            const label = isDayStart
              ? `Day ${s.day} - ${s.title}`
              : `${s.title}`;

            return (
              <div
                key={i}
                title={label}
                onClick={() => scrollToStep(i)}
                className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-indigo-600 rounded-full shadow cursor-pointer ${size} ${
                  i <= activeIndex ? "bg-indigo-600" : "bg-white"
                }`}
                style={{ top: `${top}%` }}
              />
            );
          })}

          {activeStep && (
            <div
              className="absolute left-full ml-4 -translate-y-1/2 bg-indigo-600 text-white shadow-lg px-3 py-1 rounded-full text-xs whitespace-nowrap"
              style={{ top: `${progress}%` }}
            >
              {activeLabel}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProgressTimeline;
