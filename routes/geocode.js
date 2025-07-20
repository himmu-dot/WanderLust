const express = require("express");
const axios = require("axios");
const router = express.Router();


const LOCATIONIQ_API_KEY = process.env.NEWMAP_TOKEN; // replace this!

router.get("/geocode", async (req, res) => {
  const { location } = req.query;

  if (!location) {
    return res.status(400).json({ error: "Location parameter is missing." });
  }

  try {
    const response = await axios.get("https://us1.locationiq.com/v1/search", {
      params: {
        key: LOCATIONIQ_API_KEY,
        q: location,
        format: "json",
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error("❌ Geocoding failed:", err.response?.data || err.message);
    res.status(500).json({ error: "Geocoding failed" });
  }
});

module.exports = router;
