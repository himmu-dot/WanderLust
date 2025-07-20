const map = L.map("map").setView(listing.geometry.coordinates.reverse(), 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap"
}).addTo(map);

L.marker(listing.geometry.coordinates).addTo(map)
  .bindPopup(`<b>${listing.title}</b><br>${listing.location}`)
  .openPopup();

// Call this function **only if coordinates are missing or fallback is needed**
async function fetchCoordinates(location) {
  try {
    const response = await fetch(`/api/geocode?location=${encodeURIComponent(location)}`);
    if (!response.ok) throw new Error("Request failed");

    const data = await response.json();
    console.log("Geocode via backend:", data);

    if (data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      const coords = [lat, lon];

      map.setView(coords, 13);
      L.marker(coords).addTo(map)
        .bindPopup(`<b>${listing.title}</b><br>${listing.location}`)
        .openPopup();
    } else {
      console.warn("No results found for location.");
    }
  } catch (err) {
    console.error("Backend geocode fetch failed:", err);
  }
}

// 👇 Call only if listing.geometry.coordinates is missing or unreliable
// fetchCoordinates(listing.location);
if (!listing.geometry || !listing.geometry.coordinates) {
  fetchCoordinates(listing.location);
}