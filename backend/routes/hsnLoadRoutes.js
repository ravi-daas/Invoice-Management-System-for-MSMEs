const express = require("express");
const { loadHSNCodes } = require("../services/HSNLoad");

const router = express.Router();

// Route to load HSN codes from Excel and upload to MongoDB
router.get("/load", async (req, res) => {
  try {
    const result = await loadHSNCodes();
    res.json(result);
  } catch (error) {
    console.error("Error loading HSN codes:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
