const mongoose = require("mongoose");
// Schema for mongodb database as mongo does not comes with any schema features
const ExpenseSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  category: { type: String, required: true },
  payee: { type: String, required: true },
  amount: { type: Number, required: true },
  account: { type: String, required: true },
});

const Expense = mongoose.model("Expense", ExpenseSchema);

module.exports = Expense;
