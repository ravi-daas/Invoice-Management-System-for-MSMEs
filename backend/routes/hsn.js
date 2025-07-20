const express = require("express");
const { getHSNDetails } = require("../services/hsnSerivce");

const router = express.Router();

// Route to get HSN details based on first 4 digits of HSN code
router.get("/:hsnCode", async (req, res) => {
  try {
    const { hsnCode } = req.params;
    const trimmedHSN = hsnCode.substring(0, 4); // Extract first 4 digits

    const hsnDetails = await getHSNDetails(trimmedHSN);
    if (!hsnDetails) {
      return res.status(404).json({ error: "HSN Code not found" });
    }

    // Multiply GST rate by 100 before returning
    res.json({
      hsnCode: hsnDetails.hsnCode,
      description: hsnDetails.description,
      gstRate: hsnDetails.gstRate * 100,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
