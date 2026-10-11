const API_URL = "/api/expenses";

const expenseForm = document.getElementById("expenseForm");
const itemInput = document.getElementById("item");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const filterCategory = document.getElementById("filterCategory");
const expenseTableBody = document.getElementById("expenseTableBody");
const message = document.getElementById("message");

let allExpenses = [];

// Display a success or error message
function showMessage(text, isError = false) {
    message.textContent = text;
    message.className = isError
        ? "error-message"
        : "success-message";
}

// Format numbers as Indian rupees
function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    }).format(amount);
}

// Safely display user-entered text in the table
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}

// Load all expenses from the API
async function loadExpenses() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Could not load expenses");
        }

        allExpenses = await response.json();

        updateDashboard();
        await renderExpenses();
    } catch (error) {
        showMessage(
            "Unable to connect to the API. Check whether the server is running.",
            true
        );

        expenseTableBody.innerHTML = `
            <tr>
                <td colspan="5">Unable to load expenses.</td>
            </tr>
        `;
    }
}

// Update the summary cards using map(), filter(), and reduce()
function updateDashboard() {
    // map(): create a list of expense amounts
    const amounts = allExpenses.map(expense => expense.amount);

    // reduce(): calculate the total amount
    const total = amounts.reduce(
        (sum, amount) => sum + amount,
        0
    );

    // reduce(): find the highest expense amount
    const highest = amounts.reduce(
        (max, amount) => Math.max(max, amount),
        0
    );

    // filter(): find expenses belonging to each category
    const foodExpenses = allExpenses.filter(
        expense => expense.category === "Food"
    );

    const travelExpenses = allExpenses.filter(
        expense => expense.category === "Travel"
    );

    const billsExpenses = allExpenses.filter(
        expense => expense.category === "Bills"
    );

    // reduce(): calculate category totals
    const foodTotal = foodExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
    );

    const travelTotal = travelExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
    );

    const billsTotal = billsExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
    );

    const highestExpense = allExpenses.find(
        expense => expense.amount === highest
    );

    document.getElementById("totalExpenses").textContent =
        formatCurrency(total);

    document.getElementById("expenseCount").textContent =
        allExpenses.length;

    document.getElementById("highestExpense").textContent =
        highestExpense
            ? `${highestExpense.item} (${formatCurrency(highest)})`
            : "None";

    document.getElementById("foodTotal").textContent =
        formatCurrency(foodTotal);

    document.getElementById("travelTotal").textContent =
        formatCurrency(travelTotal);

    document.getElementById("billsTotal").textContent =
        formatCurrency(billsTotal);
}

// Display expenses, using the category query when selected
async function renderExpenses() {
    try {
        const category = filterCategory.value;

        const url = category
            ? `${API_URL}?category=${encodeURIComponent(category)}`
            : API_URL;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Could not display expenses");
        }

        const displayedExpenses = await response.json();

        if (displayedExpenses.length === 0) {
            expenseTableBody.innerHTML = `
                <tr>
                    <td colspan="5">No expenses found.</td>
                </tr>
            `;
            return;
        }

        // map(): turn each expense into a table row
        expenseTableBody.innerHTML = displayedExpenses.map(expense => `
            <tr>
                <td>${expense.id}</td>
                <td>${escapeHTML(expense.item)}</td>
                <td>${formatCurrency(expense.amount)}</td>
                <td>${escapeHTML(expense.category)}</td>
                <td>
                    <button
                        type="button"
                        class="edit-button"
                        data-action="edit"
                        data-id="${expense.id}"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        class="delete-button"
                        data-action="delete"
                        data-id="${expense.id}"
                    >
                        Delete
                    </button>
                </td>
            </tr>
        `).join("");
    } catch (error) {
        showMessage("Could not display expenses.", true);
    }
}

// Create an expense using POST
expenseForm.addEventListener("submit", async event => {
    event.preventDefault();

    const item = itemInput.value.trim();
    const amount = Number(amountInput.value);
    const category = categoryInput.value;

    if (!item) {
        showMessage("Please enter an item name.", true);
        return;
    }

    if (
        amountInput.value.trim() === "" ||
        !Number.isFinite(amount) ||
        amount < 0
    ) {
        showMessage("Please enter a valid, non-negative amount.", true);
        return;
    }

    if (!category) {
        showMessage("Please select a category.", true);
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                item,
                amount,
                category
            })
        });

        const data = response.status === 204
            ? null
            : await response.json();

        if (!response.ok) {
            throw new Error(data?.error || "Could not add expense");
        }

        expenseForm.reset();
        filterCategory.value = "";

        showMessage("Expense added successfully!");

        await loadExpenses();
    } catch (error) {
        showMessage(error.message, true);
    }
});

// Handle Edit and Delete button clicks
expenseTableBody.addEventListener("click", async event => {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    if (action === "edit") {
        await editExpense(id);
    }

    if (action === "delete") {
        await deleteExpense(id);
    }
});

// Update an expense using PUT
async function editExpense(id) {
    const expense = allExpenses.find(item => item.id === id);

    if (!expense) {
        showMessage("Expense not found.", true);
        return;
    }

    const newItem = prompt("Enter item name:", expense.item);

    if (newItem === null) return;

    if (!newItem.trim()) {
        showMessage("Item name cannot be empty.", true);
        return;
    }

    const amountText = prompt(
        "Enter amount:",
        String(expense.amount)
    );

    if (amountText === null) return;

    if (amountText.trim() === "") {
        showMessage("Amount is required.", true);
        return;
    }

    const newAmount = Number(amountText);

    if (!Number.isFinite(newAmount) || newAmount < 0) {
        showMessage("Enter a valid, non-negative amount.", true);
        return;
    }

    const newCategory = prompt(
        "Enter category: Food, Travel, or Bills",
        expense.category
    );

    if (newCategory === null) return;

    const category = newCategory.trim();

    if (!["Food", "Travel", "Bills"].includes(category)) {
        showMessage("Use Food, Travel, or Bills as the category.", true);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                item: newItem.trim(),
                amount: newAmount,
                category
            })
        });

        const data = response.status === 204
            ? null
            : await response.json();

        if (!response.ok) {
            throw new Error(data?.error || "Could not update expense");
        }

        showMessage("Expense updated successfully!");

        await loadExpenses();
    } catch (error) {
        showMessage(error.message, true);
    }
}

// Delete an expense using DELETE
async function deleteExpense(id) {
    const confirmed = confirm(
        "Are you sure you want to delete this expense?"
    );

    if (!confirmed) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || "Could not delete expense");
        }

        showMessage("Expense deleted successfully!");

        await loadExpenses();
    } catch (error) {
        showMessage(error.message, true);
    }
}

// Refresh the list when the category filter changes
filterCategory.addEventListener("change", renderExpenses);

// Load the initial dashboard data
loadExpenses();