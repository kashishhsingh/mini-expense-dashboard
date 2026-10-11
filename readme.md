
# Mini Expense API + Web Dashboard

## Project Description

The Mini Expense API + Web Dashboard is a beginner-friendly full-stack web development project. It allows users to create, view, update, delete, and filter expenses.

The dashboard displays total expenses, expense count, highest expense, and totals for Food, Travel, and Bills.

## Technologies Used

- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- REST API
- JSON
- Postman

## Project Structure

```text
mini-expense-dashboard/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── routes/
│   └── expenses.js
├── controllers/
│   └── expenseController.js
├── server.js
├── package.json
├── .gitignore
└── README.md
```

## Installation

1. Install Node.js.
2. Open this folder in VS Code.
3. Open the terminal.
4. Run:

```bash
npm install
```

## Run the Project

```bash
npm start
```

Open this address in your browser:

http://localhost:5000

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/expenses` | Create an expense |
| GET | `/api/expenses` | Get all expenses |
| GET | `/api/expenses/:id` | Get one expense |
| GET | `/api/expenses?category=Food` | Filter by category |
| PUT | `/api/expenses/:id` | Update an expense |
| DELETE | `/api/expenses/:id` | Delete an expense |
| GET | `/api/expenses/summary` | Get summary information |

Valid categories are Food, Travel, and Bills.

## Features

- Create, read, update, and delete expenses
- Validate incoming data
- Filter expenses by category
- Calculate totals with `reduce()`
- Filter categories with `filter()`
- Display expense information with `map()`
- Responsive dashboard

## Data Storage

This learning project stores expenses in server memory. The sample data resets when the server restarts. A database is not included.

## Testing

Test the API endpoints using Postman and verify their response status codes and JSON responses.
