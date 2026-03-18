/**
 * itineraryModel.js — Data model for itinerary state management
 */

/**
 * Creates a default empty itinerary state object.
 * @returns {Object}
 */
export function createEmptyItinerary() {
  return {
    days: [],
  };
}

/**
 * Validates that the itinerary response has the expected shape.
 * @param {Object} data
 * @returns {boolean}
 */
export function isValidItinerary(data) {
  return (
    data &&
    Array.isArray(data.days) &&
    data.days.length > 0 &&
    data.days.every(
      (day) =>
        typeof day.day === "number" &&
        typeof day.title === "string" &&
        typeof day.area_focus === "string" &&
        typeof day.summary === "string" &&
        Array.isArray(day.stops) &&
        day.stops.length > 0 &&
        day.stops.every(
          (s) =>
            typeof s.time === "string" &&
            typeof s.place_name === "string" &&
            typeof s.details === "string"
        )
    )
  );
}
