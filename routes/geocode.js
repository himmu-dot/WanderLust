// routes/geocode.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/geocode", async (req, res) => {
  const { location } = req.query;

  console.log("🔍 Received location:", location);

  if (!location) {
    return res.status(400).json({ error: "Location parameter is missing." });
  }

  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: location,
        format: "json",
      },
      headers: {
        "User-Agent": "WanderLustApp/1.0 (himanshuhima09@gmail.com)",
        "Accept-Language": "en",
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error("❌ Geocoding failed:", err.message);
    res.status(500).json({ error: "Geocoding failed" });
  }
});

module.exports = router;
