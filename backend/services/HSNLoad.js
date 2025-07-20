const xlsx = require("xlsx");
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

const prisma = new PrismaClient();
const filePath = "./data/List.xlsx"; // Path to uploaded Excel file

// Function to read HSN data from Excel
const readHSNFromExcel = (filePath) => {
  if (!fs.existsSync(filePath)) {
    throw new Error("Excel file not found.");
  }

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);

  return data.map((row) => ({
    hsnCode: String(row.HSN || row["HSN Code"] || "").trim(), // Ensure hsnCode is always a string
    description: row["Name of Commodity"] || "No description",
    gstRate: isNaN(parseFloat(row["GST"])) ? 0 : parseFloat(row["GST"]), // Ensure gstRate always has a numeric value
  }));
};

// Function to save HSN data to MongoDB
const saveToMongoDB = async (hsnData) => {
  try {
    await prisma.hSNCode.createMany({
      data: hsnData,
    });
    console.log(`Uploaded ${hsnData.length} HSN codes!`);
    return { success: true, message: `${hsnData.length} HSN codes uploaded!` };
  } catch (error) {
    console.error("Error saving HSN data:", error.message);
    return { success: false, message: "Error saving HSN data." };
  }
};

// Function to process and upload HSN codes
const loadHSNCodes = async () => {
  const hsnData = readHSNFromExcel(filePath);
  if (hsnData.length === 0) {
    return { success: false, message: "No data found in the file." };
  }

  const result = await saveToMongoDB(hsnData);
  await prisma.$disconnect();
  return result;
};

module.exports = { loadHSNCodes };
