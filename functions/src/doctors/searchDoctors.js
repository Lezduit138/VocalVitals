const { onCall } = require("firebase-functions/v2/https");

exports.searchDoctors = onCall(async (request) => {
  const { data } = request;
  const { lat, lng, specialties, radius = 10000 } = data;
  const keyword = specialties && specialties.length > 0 && specialties[0] !== 'All' 
    ? `${specialties[0].replace(/_/g, ' ')} pediatric doctor`
    : `pediatric doctor`;

  const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

  if (!GOOGLE_API_KEY) {
    console.warn("GOOGLE_PLACES_API_KEY is missing");
    return { doctors: [{
      id: "mock1", name: "Dr. Mock Simulation (Set API Key)", address: "123 Health Ave", rating: 4.8, totalReviews: 45,
      isOpenNow: true, distance: 1.2, directionsUrl: "#", photoUrl: null, lat, lng
    }] };
  }

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json` +
    `?location=${lat},${lng}` +
    `&radius=${radius}` +
    `&type=doctor` +
    `&keyword=${encodeURIComponent(keyword)}` +
    `&key=${GOOGLE_API_KEY}`;

  const res = await fetch(url);
  const json = await res.json();

  if (!json.results) return { doctors: [] };

  const doctors = json.results.map((place) => ({
    id: place.place_id,
    name: place.name,
    address: place.vicinity,
    rating: place.rating || null,
    totalReviews: place.user_ratings_total || 0,
    isOpenNow: place.opening_hours?.open_now ?? null,
    photoUrl: place.photos && place.photos[0]
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
      : null,
    lat: place.geometry.location.lat,
    lng: place.geometry.location.lng,
    distance: getDistanceKm(lat, lng, place.geometry.location.lat, place.geometry.location.lng),
    directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${place.geometry.location.lat},${place.geometry.location.lng}`,
  }));

  // Sort by distance
  doctors.sort((a, b) => a.distance - b.distance);

  return { doctors: doctors.slice(0, 10) };
});

function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return +(R * 2 * Math.asin(Math.sqrt(a))).toFixed(1);
}
