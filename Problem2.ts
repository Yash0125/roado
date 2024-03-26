interface Trip {
  from: string;
  to: string;
}

interface Shipment {
  pickups: string[];
  dropoffs: string[];
}

function isValidTripList(trips: Trip[], shipment: Shipment): boolean {
  const visitedPoints = new Set<string>();
  let currentLocation: string | null = null;

  // Check for completeness
  for (const point of shipment.pickups.concat(shipment.dropoffs)) {
    if (!visitedPoints.has(point)) {
      return false; // Incomplete trip
    }
  }

  for (const trip of trips) {
    // Check sequential ordering
    if (
      shipment.dropoffs.includes(trip.from) &&
      !visitedPoints.has(trip.from)
    ) {
      return false; // Drop-off point visited before pick-up
    }

    // Check valid via points
    if (
      !shipment.pickups.includes(trip.from) &&
      !shipment.dropoffs.includes(trip.from)
    ) {
      return false; // Trip does not start from a valid pick-up or drop-off point
    }

    // Check no duplicate visits
    if (visitedPoints.has(trip.to)) {
      return false; // Point visited more than once
    }

    visitedPoints.add(trip.to); // Mark point as visited

    // Check connection between points
    if (currentLocation === null) {
      currentLocation = trip.from;
    } else if (currentLocation !== trip.from) {
      return false; // Trip starts from an unexpected location
    }

    currentLocation = trip.to; // Update current location
  }

  // Check starting and ending points
  if (
    !shipment.pickups.includes(trips[0].from) ||
    !shipment.dropoffs.includes(trips[trips.length - 1].to)
  ) {
    return false; // Starting or ending point mismatch
  }

  return true; // All checks passed
}

// Example usage:
const shipment: Shipment = {
  pickups: ["A", "B"],
  dropoffs: ["C", "D"],
};

const trips: Trip[] = [
  { from: "A", to: "W" },
  { from: "B", to: "W" },
  { from: "W", to: "C" },
  { from: "W", to: "D" },
];

console.log(isValidTripList(trips, shipment)); // Output: true
