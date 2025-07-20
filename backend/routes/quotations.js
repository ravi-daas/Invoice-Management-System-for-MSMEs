const express = require("express");
const {
  createQuotation,
  getQuotationById,
  getAllQuotations,
  updateQuotation,
  deleteQuotation,
} = require("../services/quotationService");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const quotation = await createQuotation(req.body);
    res.status(201).json(quotation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const quotation = await getQuotationById(req.params.id);
    if (!quotation)
      return res.status(404).json({ error: "Quotation not found" });
    res.json(quotation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const quotations = await getAllQuotations();
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedQuotation = await updateQuotation(req.params.id, req.body);
    res.json(updatedQuotation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await deleteQuotation(req.params.id);
    res.json({ message: "Quotation deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
