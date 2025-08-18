// src/components/TripStepCardSkeleton.tsx
import React from "react";

const TripStepCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full sm:w-80 animate-pulse">
      <div className="w-full h-40 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-1/3 bg-gray-200 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
        <div className="h-3 w-1/2 bg-gray-200 rounded" />
        <div className="flex gap-3 mt-4">
          <div className="h-8 w-20 bg-gray-200 rounded-xl" />
          <div className="h-8 w-20 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default TripStepCardSkeleton;
