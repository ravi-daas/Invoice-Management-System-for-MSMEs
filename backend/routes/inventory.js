const express = require("express");
const {
  createInventoryState,
  getInventoryWithProducts,
} = require("../services/inventoryService");

const router = express.Router();

// ➤ Create inventory state
router.post("/", async (req, res) => {
  try {
    const inventory = await createInventoryState(req.body);
    res.status(201).json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➤ Get the single inventory (fixed to match frontend)
router.get("/", async (req, res) => {
  try {
    console.log('22 - get products');
    const inventory = await getInventoryWithProducts();
    console.log(inventory);
    if (!inventory) {
      console.log('Inventory Not Found');
      return res.status(404).json({ error: "Inventory not found" });
    }
    res.json(inventory);
  } catch (error) {
    console.log('Catch error in get products');
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
