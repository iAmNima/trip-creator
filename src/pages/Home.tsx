// src/pages/Home.tsx
import React, { useState } from "react";
import AnimatedInput from "../components/AnimatedInput";
import TagSelector from "../components/TagSelector";
import TripStepCard from "../components/TripStepCard";
import PathwayConnector from "../components/PathwayConnector";
import { generateTripPlan } from "../api/openai";

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

  const handleCreateTrip = async () => {
    setLoading(true);
    try {
      const raw = await generateTripPlan(destination, duration, interests);
      const parsed: TripStep[] = JSON.parse(raw);
      setTripSteps(parsed);
      setStep(5); // move to final view
    } catch (err) {
      console.error("Trip generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Plan Your Perfect Trip</h1>

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
        <button
          onClick={handleCreateTrip}
          className="mt-8 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition"
        >
          {loading ? "Creating your trip..." : "Create My Trip ✈️"}
        </button>
      )}

      {step === 5 && (
        <div className="w-full max-w-3xl flex flex-col items-center mt-10 gap-10">
          {tripSteps.map((step, i) => (
            <div key={i} className="w-full">
              <TripStepCard
                time={step.time}
                title={step.title}
                location={step.location}
                imageUrl={
                  step.imageUrl || "https://via.placeholder.com/800x400?text=Trip+Step"
                }
                mapsLink={step.mapsLink}
                websiteLink={step.websiteLink}
              />
              {i < tripSteps.length - 1 && <PathwayConnector />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
