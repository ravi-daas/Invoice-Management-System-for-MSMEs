const express = require("express");
const cors = require("cors");
const app = express();
const invoiceRoutes = require("./routes/invoices");
const quotationRoutes = require("./routes/quotations");
const clientRoutes = require("./routes/clients");
const productsRoutes = require("./routes/products");
const inventoryRoutes = require("./routes/inventory");
const profileRoutes = require("./routes/profile");
const hsnRoutes = require("./routes/hsn");
const hsnLoadRoutes = require("./routes/hsnLoadRoutes");
const gstRoutes = require("./routes/gst");

app.use(cors());
app.use(express.json());
app.use("/invoices", invoiceRoutes);
app.use("/quotations", quotationRoutes);
app.use("/clients", clientRoutes);
app.use("/products", productsRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/profile", profileRoutes);
app.use("/hsn", hsnRoutes);
app.use("/hsnLoad", hsnLoadRoutes);
app.use("/gst", gstRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
