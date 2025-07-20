const map = L.map("map").setView(listing.geometry.coordinates.reverse(), 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap"
}).addTo(map);

L.marker(listing.geometry.coordinates).addTo(map)
  .bindPopup(`<b>${listing.title}</b><br>${listing.location}`)
  .openPopup();

// Optional: Get geocoding data again if needed
async function fetchCoordinates(location) {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`, {
      headers: {
        'User-Agent': 'WanderLustApp/1.0 (himanshuhima09@gmail.com)',
        'Accept-Language': 'en'
      }
    });

    if (!response.ok) throw new Error("Request failed");

    const data = await response.json();
    console.log("Nominatim result:", data);

    // Optional: Use data[0].lat, data[0].lon to update map if needed
  } catch (err) {
    console.error("Nominatim fetch failed:", err);
  }
}

// Call the function if needed
fetchCoordinates(listing.location);  // Only if you want to geocode again
