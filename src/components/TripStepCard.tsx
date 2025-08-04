// src/components/TripStepCard.tsx
import React from "react";
import { motion } from "framer-motion";
import { MapPin, ExternalLink } from "lucide-react";

interface TripStepCardProps {
  time: string;
  title: string;
  location: string;
  imageUrl: string;
  mapsLink?: string;
  websiteLink?: string;
}

const TripStepCard: React.FC<TripStepCardProps> = ({
  time,
  title,
  location,
  imageUrl,
  mapsLink,
  websiteLink,
}) => {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <img src={imageUrl} alt={title} className="w-full h-56 object-cover" />

      <div className="p-5">
        <p className="text-sm text-gray-500">{time}</p>
        <h3 className="text-xl font-bold text-gray-800 mt-1">{title}</h3>
        <p className="text-gray-600 flex items-center gap-1 mt-1">
          <MapPin className="w-4 h-4 text-indigo-500" />
          {location}
        </p>

        <div className="flex gap-3 mt-4">
          {mapsLink && (
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-indigo-100 text-indigo-700 text-sm font-medium hover:bg-indigo-200 transition"
            >
              Open in Maps
            </a>
          )}
          {websiteLink && (
            <a
              href={websiteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition flex items-center gap-1"
            >
              Website <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TripStepCard;
