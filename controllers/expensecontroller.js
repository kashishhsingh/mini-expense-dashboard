let expenses = [
    { id: 1, item: "Coffee", amount: 120, category: "Food" },
    { id: 2, item: "Bus Ticket", amount: 80, category: "Travel" },
    { id: 3, item: "Electricity Bill", amount: 900, category: "Bills" }
];

let nextId = 4;

// POST /api/expenses
// Create a new expense
const createExpense = (req, res) => {
    const { item, amount, category } = req.body;

    if (typeof item !== "string" || !item.trim()) {
        return res.status(400).json({
            error: "item is required"
        });
    }

    if (
        amount === undefined ||
        amount === null ||
        amount === ""
    ) {
        return res.status(400).json({
            error: "amount is required"
        });
    }

    if (typeof amount !== "number" || !Number.isFinite(amount)) {
        return res.status(400).json({
            error: "amount must be a number"
        });
    }

    if (amount < 0) {
        return res.status(400).json({
            error: "amount cannot be negative"
        });
    }

    if (
        typeof category !== "string" ||
        !["Food", "Travel", "Bills"].includes(category)
    ) {
        return res.status(400).json({
            error: "category must be Food, Travel, or Bills"
        });
    }

    const newExpense = {
        id: nextId++,
        item: item.trim(),
        amount,
        category
    };

    expenses.push(newExpense);

    return res.status(201).json(newExpense);
};

// GET /api/expenses
// Get all expenses, or filter by category
const getExpenses = (req, res) => {
    const { category } = req.query;

    if (category && !["Food", "Travel", "Bills"].includes(category)) {
        return res.status(400).json({
            error: "Invalid category"
        });
    }

    const result = category
        ? expenses.filter(expense => expense.category === category)
        : expenses;

    return res.status(200).json(result);
};

// GET /api/expenses/:id
// Get one expense by ID
const getExpenseById = (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
            error: "Invalid expense ID"
        });
    }

    const expense = expenses.find(item => item.id === id);

    if (!expense) {
        return res.status(404).json({
            error: "Expense not found"
        });
    }

    return res.status(200).json(expense);
};

// PUT /api/expenses/:id
// Update an existing expense
const updateExpense = (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
            error: "Invalid expense ID"
        });
    }

    const expense = expenses.find(item => item.id === id);

    if (!expense) {
        return res.status(404).json({
            error: "Expense not found"
        });
    }

    const { item, amount, category } = req.body;

    if (item !== undefined &&
        (typeof item !== "string" || !item.trim())) {
        return res.status(400).json({
            error: "item cannot be empty"
        });
    }

    if (amount !== undefined &&
        (typeof amount !== "number" || !Number.isFinite(amount))) {
        return res.status(400).json({
            error: "amount must be a number"
        });
    }

    if (amount !== undefined && amount < 0) {
        return res.status(400).json({
            error: "amount cannot be negative"
        });
    }

    if (category !== undefined &&
        !["Food", "Travel", "Bills"].includes(category)) {
        return res.status(400).json({
            error: "category must be Food, Travel, or Bills"
        });
    }

    if (item !== undefined) expense.item = item.trim();
    if (amount !== undefined) expense.amount = amount;
    if (category !== undefined) expense.category = category;

    return res.status(200).json(expense);
};

// DELETE /api/expenses/:id
// Delete an expense
const deleteExpense = (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
            error: "Invalid expense ID"
        });
    }

    const index = expenses.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: "Expense not found"
        });
    }

    expenses.splice(index, 1);

    return res.status(204).send();
};

// GET /api/expenses/summary
// Extra: summary endpoint
const getSummary = (req, res) => {
    const totalExpenses = expenses.reduce(
        (total, expense) => total + expense.amount,
        0
    );

    const highestExpense = expenses.reduce(
        (highest, expense) =>
            expense.amount > highest.amount ? expense : highest,
        { id: null, item: "None", amount: 0, category: "" }
    );

    return res.status(200).json({
        totalExpenses,
        count: expenses.length,
        highestExpense
    });
};

module.exports = {
    createExpense,
    getExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense,
    getSummary
};