/**
 * itineraryController.js — MVC Controller layer
 * Bridges the view (React components) and the service/model layers.
 */

import { fetchItinerary } from "@/services/api";
import { isValidItinerary } from "@/mvc/model/itineraryModel";

/**
 * Controller function to generate an itinerary.
 * Handles validation, API call, and error normalization.
 *
 * @param {string} destination
 * @param {string} style
 * @returns {Promise<{ data: Object|null, error: string|null }>}
 */
export async function getItinerary(destination, style) {
  if (!destination.trim()) {
    return { data: null, error: "Please enter a destination." };
  }
  if (!style) {
    return { data: null, error: "Please select a travel style." };
  }

  try {
    const data = await fetchItinerary(destination.trim(), style);

    if (!isValidItinerary(data)) {
      return { data: null, error: "Received an unexpected response from the AI. Please try again." };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message || "Something went wrong. Please try again." };
  }
}
