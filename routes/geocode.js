// routes/geocode.js
const express = require("express");
const fetch = require("node-fetch"); // required for Node < 18
const router = express.Router();

router.get("/geocode", async (req, res) => {
  const { location } = req.query;

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`, {
      headers: {
        'User-Agent': 'WanderLustApp/1.0 himanshuhima09@gmail.com',
        'Accept-Language': 'en'
      }
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Geocoding failed:", err.message);
    res.status(500).json({ error: "Geocoding failed" });
  }
});

module.exports = router;
