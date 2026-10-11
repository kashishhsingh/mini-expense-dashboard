const express = require("express");
const router = express.Router();

const {
    createExpense,
    getExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense,
    getSummary
} = require("../controllers/expenseController");

// Create an expense
router.post("/", createExpense);

// Get summary — keep this route before the :id route
router.get("/summary", getSummary);

// Get all expenses or filter by category
router.get("/", getExpenses);

// Get one expense
router.get("/:id", getExpenseById);

// Update an expense
router.put("/:id", updateExpense);

// Delete an expense
router.delete("/:id", deleteExpense);

module.exports = router;