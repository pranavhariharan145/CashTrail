const express = require("express");
const Expense = require("../models/expschema");

const router = express.Router();

// Add a new expense
router.post("/", async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
