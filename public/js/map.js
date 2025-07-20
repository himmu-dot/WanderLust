const map = L.map("map").setView(listing.geometry.coordinates.reverse(), 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap"
}).addTo(map);

L.marker(listing.geometry.coordinates).addTo(map)
  .bindPopup(`<b>${listing.title}</b><br>${listing.location}`)
  .openPopup();
