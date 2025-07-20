// 📌 Safely reverse without mutating original
const coords = [...listing.geometry.coordinates].reverse(); // [lat, lon]

const map = L.map("map").setView(coords, 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap"
}).addTo(map);

// 📌 Use the reversed coords
L.marker(coords).addTo(map)
  .bindPopup(`<b>${listing.title}</b><br>${listing.location}`)
  .openPopup();

// ✅ Function to fetch coordinates from backend only if needed
async function fetchCoordinates(location) {
  try {
    const response = await fetch(`/api/geocode?location=${encodeURIComponent(location)}`);
    if (!response.ok) throw new Error("Request failed");

    const data = await response.json();
    console.log("Geocode via backend:", data);

    if (data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      const fallbackCoords = [lat, lon];

      map.setView(fallbackCoords, 13);
      L.marker(fallbackCoords).addTo(map)
        .bindPopup(`<b>${listing.title}</b><br>${listing.location}`)
        .openPopup();
    } else {
      console.warn("No results found for location.");
    }
  } catch (err) {
    console.error("Backend geocode fetch failed:", err);
  }
}

// 📌 Only call if coordinates are missing or invalid
if (
  !listing.geometry ||
  !Array.isArray(listing.geometry.coordinates) ||
  listing.geometry.coordinates.length !== 2
) {
  fetchCoordinates(listing.location);
}
