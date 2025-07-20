const express = require("express");
const {
  createClient,
  getClientById,
  getAllClients,
  updateClient,
  deleteClient,
} = require("../services/clientService");

const router = express.Router();

// Create a new client
router.post("/", async (req, res) => {
  try {
    const client = await createClient(req.body);
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single client by ID
router.get("/:id", async (req, res) => {
  try {
    const client = await getClientById(req.params.id);
    if (!client) return res.status(404).json({ error: "Client not found" });
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all clients
router.get("/", async (req, res) => {
  try {
    const clients = await getAllClients();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a client
router.put("/:id", async (req, res) => {
  try {
    const updatedClient = await updateClient(req.params.id, req.body);
    res.json(updatedClient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a client
router.delete("/:id", async (req, res) => {
  try {
    await deleteClient(req.params.id);
    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
