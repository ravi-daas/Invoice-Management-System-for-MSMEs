const express = require("express");
const router = express.Router();
require("dotenv").config();
const {
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  createInvoice,
} = require("../services/invoiceService");

// Create an invoice
router.post("/", async (req, res) => {
  try {
    const newInvoice = await createInvoice(req.body);
    res.status(201).json(newInvoice);
  } catch (error) {
    console.error("Error creating invoice: ", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all invoices
router.get("/", async (req, res) => {
  try {
    const invoices = await getAllInvoices();
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get invoice by ID
router.get("/:id", async (req, res) => {
  try {
    const invoice = await getInvoiceById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Modify an invoice
router.put("/:id", async (req, res) => {
  try {
    const updatedInvoice = await updateInvoice(req.params.id, req.body);
    res.json(updatedInvoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an invoice
router.delete("/:id", async (req, res) => {
  try {
    await deleteInvoice(req.params.id);
    res.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
