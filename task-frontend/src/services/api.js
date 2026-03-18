

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Fetches a generated itinerary from the backend API.
 * @param {string} destination
 * @param {string} style
 * @returns {Promise<Object>} itinerary data
 */
export async function fetchItinerary(destination, style) {
  const response = await fetch(`${BASE_URL}/generate-itinerary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ destination, style }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.error || "Failed to fetch itinerary");
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}
