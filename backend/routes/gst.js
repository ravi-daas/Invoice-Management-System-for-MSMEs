const express = require("express");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");

const router = express.Router();
const gstSessions = {};

router.get("/api/v1/getCaptcha", async (req, res) => {
  try {
    const captchaUrl = "https://services.gst.gov.in/services/captcha";
    const jar = new CookieJar(); // Store cookies
    const session = wrapper(axios.create({ jar }));

    const sessionId = uuidv4();

    // Initiate a session
    await session.get("https://services.gst.gov.in/services/searchtp");

    // Fetch Captcha
    const captchaResponse = await session.get(captchaUrl, {
      responseType: "arraybuffer",
    });
    const captchaBase64 = Buffer.from(captchaResponse.data, "binary").toString(
      "base64"
    );

    // Store session
    gstSessions[sessionId] = { session, createdAt: Date.now() };

    return res.status(200).json({
      sessionId,
      image: `data:image/png;base64,${captchaBase64}`,
    });
  } catch (error) {
    console.error("Captcha Fetch Error:", error.message);
    return res.status(500).json({ error: "Error in fetching captcha" });
  }
});

// Get GST Details
router.post("/api/v1/getGSTDetails", async (req, res) => {
  try {
    const { sessionId, GSTIN, captcha } = req.body;

    if (!sessionId || !GSTIN || !captcha) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = gstSessions[sessionId];

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired session ID" });
    }

    const gstData = { gstin: GSTIN.trim(), captcha: captcha.trim() };

    // Fetch GST details
    const response = await user.session.post(
      "https://services.gst.gov.in/services/api/search/taxpayerDetails",
      gstData
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("GST Details Fetch Error:", error.message);

    if (error.response) {
      return res
        .status(error.response.status)
        .json({ error: error.response.data });
    }

    return res.status(500).json({ error: "Error in fetching GST Details" });
  }
});

module.exports = router;
