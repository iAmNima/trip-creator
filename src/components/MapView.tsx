/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/MapView.tsx
import React, { useEffect, useRef } from "react";

interface GeocodedStep {
  title: string;
  location: string;
  coordinates?: { lat: number; lng: number } | null;
}

interface MapViewProps {
  steps: GeocodedStep[];
  onMarkerClick?: (index: number) => void;
}

const MapView: React.FC<MapViewProps> = ({ steps, onMarkerClick }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current) return;
      const googleObj = (window as any).google;
      const firstCoords = steps.find((s) => s.coordinates)?.coordinates || {
        lat: 0,
        lng: 0,
      };
      const map = new googleObj.maps.Map(mapRef.current, {
        center: firstCoords,
        zoom: 12,
      });

      steps.forEach((step, idx) => {
        if (!step.coordinates) return;
        const marker = new googleObj.maps.Marker({
          position: step.coordinates,
          map,
          title: step.title,
        });
        marker.addListener("click", () => onMarkerClick?.(idx));
      });
    };

    if ((window as any).google?.maps) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    }
  }, [steps, onMarkerClick]);

  return <div className="w-full h-96" ref={mapRef} />;
};

export default MapView;

