const express = require("express");
const { getProfile, upsertProfile } = require("../services/profileServices.js");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const profile = await getProfile();
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const updatedProfile = await upsertProfile(req.body);
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;