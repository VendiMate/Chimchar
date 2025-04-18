export async function FindClosestPoint(lat, long, coordinates) {
  let closestLocation = null;
  let closestDistance = Number.MAX_VALUE;

  for (const coord of coordinates) {
    const distance = await HaverSineDistance(
      lat,
      long,
      coord.x_coordinate,
      coord.y_coordinate,
    );
    console.log(distance);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestLocation = coord;
    }
  }
  console.log('Closest Location: ', closestLocation);
  console.log('Closest Distance: ', closestDistance);
  return { closestLocation, closestDistance };
}

export async function HaverSineDistance(lat, long, x_cord, y_cord) {
  const R = 3958.8; // Earth radius in miles

  // Convert degree to radians
  const lat1 = (lat * Math.PI) / 180; // φ, λ in radians
  const lat2 = (x_cord * Math.PI) / 180;
  const long1 = (long * Math.PI) / 180;
  const long2 = (y_cord * Math.PI) / 180;

  // Difference in coordinates
  const dlat = lat2 - lat1;
  const dlon = long2 - long1;

  // Haversine formula
  const a =
    Math.sin(dlat / 2) * Math.sin(dlat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) * Math.sin(dlon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance in miles
  const distance = R * c;
  return distance;
}
