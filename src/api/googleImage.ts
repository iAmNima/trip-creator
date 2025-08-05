// src/api/googleImage.ts
export async function fetchImageFromGoogle(query: string): Promise<string | null> {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const cx = import.meta.env.VITE_GOOGLE_CSE_ID;

  const res = await fetch(
    `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
      query
    )}&cx=${cx}&searchType=image&num=1&key=${apiKey}`
  );

  const data = await res.json();

  const image = data.items?.[0]?.link;
  return image || null;
}
