const express = require("express");
const Expense = require("../models/expschema");

const router = express.Router();

// Add a new expense POST
router.post("/", async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET request to retreive the data in mongo as json    
router.get("/", async (req, res) => {
    try {
      const expenses = await Expense.find(); // Fetch all expenses from MongoDB
      res.json(expenses); // Send response
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch expenses" });
    }
  });

// DELETE request to remove an expense by ID
router.delete("/:id", async (req, res) => {
    try {
      const expense = await Expense.findByIdAndDelete(req.params.id);
      if (!expense) {
        return res.status(404).json({ error: "Expense not found" });
      }
      res.json({ message: "Expense deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete expense" });
    }
  });
  
  

module.exports = router;
