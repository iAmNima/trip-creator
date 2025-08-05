// src/pages/Home.tsx
import React, { useState } from "react";
import AnimatedInput from "../components/AnimatedInput";
import TagSelector from "../components/TagSelector";
import TripStepCard from "../components/TripStepCard";
import PathwayConnector from "../components/PathwayConnector";
import TripStepCardSkeleton from "../components/TripStepCardSkeleton";
import { ArrowLeft, Loader2 } from "lucide-react";
import { generateTripPlan } from "../api/openai";
import { fetchImageFromGoogle } from "../api/googleImage";

// Type for individual itinerary step
interface TripStep {
  day: number;
  time: string;
  title: string;
  location: string;
  imagePrompt?: string;
  imageUrl?: string;
  mapsLink?: string;
  websiteLink?: string;
}

const Home: React.FC = () => {
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [tripSteps, setTripSteps] = useState<TripStep[]>([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => Math.max(1, prev - 1));
  const handleReset = () => {
    setDestination("");
    setDuration("");
    setInterests([]);
    setTripSteps([]);
    setStep(1);
  };

  const handleCreateTrip = async () => {
    setLoading(true);
    try {
      const raw = await generateTripPlan(destination, duration, interests);
      const parsed: TripStep[] = JSON.parse(raw);

      // Track which image we already fetched per location
      const locationImageCache = new Map<string, string>();

      const stepsWithImages = await Promise.all(
        parsed.map(async (step) => {
          const key = step.location.trim().toLowerCase(); // normalize

          if (!locationImageCache.has(key)) {
            const imagePrompt = step.imagePrompt || `${step.title} ${step.location}`;
            const imageUrl = await fetchImageFromGoogle(imagePrompt);
            if (imageUrl) {
              locationImageCache.set(key, imageUrl);
            }
          }

          const imageUrl = locationImageCache.get(key);

          return {
            ...step,
            imageUrl: imageUrl ?? undefined,
          };
        })
      );

      setTripSteps(stepsWithImages);
      setStep(5);
    } catch (err) {
      console.error("Trip generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 relative">
      {step > 1 && step <= 4 && (
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 text-gray-600 hover:text-gray-800"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      )}

      <h1 className="text-5xl font-extrabold text-center mb-2">Trip Creator</h1>
      <p className="text-4xl font-bold mb-8 text-center">Plan Your Perfect Trip</p>

      {/* Display chosen details */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        {destination && (
          <span className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full shadow-sm">
            {destination}
          </span>
        )}
        {duration && (
          <span className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full shadow-sm">
            {duration}
          </span>
        )}
        {interests.map((interest) => (
          <span
            key={interest}
            className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full shadow-sm"
          >
            {interest}
          </span>
        ))}
      </div>

      {step === 1 && (
        <AnimatedInput
          label="Where do you want to go?"
          placeholder="e.g., Tokyo"
          onSubmit={(val: string) => {
            setDestination(val);
            handleNext();
          }}
        />
      )}

      {step === 2 && (
        <AnimatedInput
          label="How long will you stay?"
          placeholder="e.g., 5 days"
          onSubmit={(val: string) => {
            setDuration(val);
            handleNext();
          }}
        />
      )}

      {step === 3 && (
        <TagSelector
          label="What do you enjoy doing?"
          suggestions={["Museums", "Food", "Nature", "Shopping", "Nightlife", "Beaches", "Art"]}
          onChange={setInterests}
          onNext={handleNext}
        />
      )}

      {step === 4 && (
        <div className="flex flex-col items-center w-full">
          <button
            onClick={handleCreateTrip}
            disabled={loading}
            className="mt-8 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition flex items-center gap-2 disabled:opacity-70"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {loading ? "Creating your trip..." : "Create My Trip ✈️"}
          </button>
          {loading && (
            <div className="w-full max-w-3xl flex flex-col items-center mt-10 gap-10">
              {[0, 1, 2].map((i) => (
                <React.Fragment key={i}>
                  <div
                    className={`w-full flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
                  >
                    <TripStepCardSkeleton />
                  </div>
                  {i < 2 && (
                    <PathwayConnector direction={i % 2 === 0 ? "right" : "left"} />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      )}

      {step === 5 && (
        <div className="w-full max-w-3xl flex flex-col items-center mt-10 gap-10">
          {tripSteps.map((s, i) => (
            <React.Fragment key={i}>
              <div
                className={`w-full flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
              >
                <TripStepCard
                  time={s.time}
                  title={s.title}
                  location={s.location}
                  imageUrl={s.imageUrl || "https://source.unsplash.com/800x400/?travel"}
                  mapsLink={s.mapsLink}
                  websiteLink={s.websiteLink}
                />
              </div>
              {i < tripSteps.length - 1 && (
                <PathwayConnector direction={i % 2 === 0 ? "right" : "left"} />
              )}
            </React.Fragment>
          ))}
          <button
            onClick={handleReset}
            className="mt-4 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition"
          >
            Start New Trip
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
