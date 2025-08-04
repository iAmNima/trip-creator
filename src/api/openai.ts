// src/api/openai.ts
export async function generateTripPlan(
  destination: string,
  duration: string,
  interests: string[]
): Promise<string> {
  const prompt = `Create a day-by-day travel itinerary for a ${duration} trip to ${destination}. Focus on interests like ${interests.join(
    ", "
  )}. Include timestamps (e.g., 10:00 AM), activity names, and locations. Each item should be in a structured JSON format like:

[
  {
    "day": 1,
    "time": "10:00 AM",
    "title": "Visit the Eiffel Tower",
    "location": "Paris, France",
    "imagePrompt": "Eiffel Tower, morning",
    "mapsLink": "https://maps.google.com/?q=Eiffel+Tower",
    "websiteLink": "https://www.toureiffel.paris/en"
  },
  ...
]
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  const data = await response.json();

  if (!data.choices?.[0]?.message?.content) {
    throw new Error("No response from OpenAI.");
  }

  return data.choices[0].message.content;
}
