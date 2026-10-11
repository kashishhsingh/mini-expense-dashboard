const express = require("express");
const path = require("path");
const expenseRoutes = require("./routes/expenses");

const app = express();
const PORT = 5000;

// Parse JSON data sent by the frontend or Postman
app.use(express.json());

// Serve frontend files from the public folder
app.use(express.static(path.join(__dirname, "public")));

// Expense API routes
app.use("/api/expenses", expenseRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});