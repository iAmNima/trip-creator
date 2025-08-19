// src/api/geocode.ts
// Simple wrapper around Google Maps Geocoding API
// Returns latitude and longitude for a given location string

export interface GeocodeResult {
  lat: number;
  lng: number;
}

export async function geocodeLocation(location: string): Promise<GeocodeResult | null> {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error('Missing Google Maps API key');
    return null;
  }
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`
    );
    if (!res.ok) {
      throw new Error('Geocoding request failed');
    }
    const data = await res.json();
    const first = data.results?.[0];
    if (!first) return null;
    const { lat, lng } = first.geometry.location;
    return { lat, lng };
  } catch (err) {
    console.error('Geocoding error:', err);
    return null;
  }
}

