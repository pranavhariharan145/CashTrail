"use client"; // Required for fetching data in Next.js

import { useEffect, useState } from "react";

export default function ExpenseTable() {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    category: "",
    payee: "",
    amount: "",
    account: "",
  });
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const toggleSelection = (id) => {
    setSelectedExpenses((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((expenseId) => expenseId !== id) // Remove if selected
        : [...prevSelected, id] // Add if not selected
    );
  };
  const toggleSelectAll = () => {
    if (selectedExpenses.length === expenses.length) {
      setSelectedExpenses([]); // Deselect all
    } else {
      setSelectedExpenses(expenses.map((expense) => expense._id)); // Select all
    }
  };



  // Fetch expenses from MongoDB
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/expenses");
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit new expense
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Expense added!");
      setShowForm(false);
      setFormData({ date: "", category: "", payee: "", amount: "", account: "" });
      fetchExpenses(); // Refresh table
    } else {
      alert("Failed to add expense.");
    }
  };



  // Delete selected expenses
  const deleteSelected = async () => {
    try {
      await fetch("http://localhost:5000/api/expenses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedExpenses }),
      });

      // Remove deleted items from state
      setExpenses((prev) => prev.filter((expense) => !selectedExpenses.includes(expense._id)));
      setSelectedExpenses([]); // Clear selection after deletion
    } catch (err) {
      console.error("Error deleting expenses:", err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center">
        <div className="text-4xl font-extrabold text-white mt-5 mb-20 ">CashTrail</div>
        <div></div> {/* Empty div to push the heading to the left */}
      </div>
      <h1 className="text-2xl font-bold mt-5 mb-10 ">Welcome Back, User</h1>
      {/* Form (Only shows when showForm is true) */}
      {showForm && (
        <div className="fixed right-0 top-0 h-full w-1/3 bg-white shadow-lg p-4 transition-transform transform translate-x-0">
          <h2 className="text-xl font-bold mb-4">Add Expense</h2>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              name="payee"
              placeholder="Payee"
              value={formData.payee}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              name="account"
              placeholder="Account"
              value={formData.account}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
              Submit
            </button>
            <button type="button" className="text-red-500" onClick={() => setShowForm(false)}>
              Close
            </button>
          </form>
        </div>
      )}


      {/* Expenses Table */}
      <div className="bg-white p-6 shadow-lg rounded-2xl">
        {/* Header Section with Title and Buttons */}
        <div className="flex justify-between items-center p-4">
          <div className="text-black font-bold text-lg">Your Transactions</div>
          <div className="space-x-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={() => setShowForm(!showForm)}>
              Add Transaction
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              onClick={deleteSelected}
              disabled={selectedExpenses.length === 0}>
              Delete Selected
            </button>
          </div>
        </div>

        {/* Table Section */}
        <table className="w-full border-collapse text-black bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left">
                <input type="checkbox" onChange={toggleSelectAll} />
              </th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Payee</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Account</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id} className="hover:bg-gray-50">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedExpenses.includes(expense._id)}
                    onChange={() => toggleSelection(expense._id)}
                  />
                </td>
                <td className="p-4">{new Date(expense.date).toLocaleDateString()}</td>
                <td className="p-4">{expense.category}</td>
                <td className="p-4">{expense.payee}</td>
                <td className="p-4">${expense.amount}</td>
                <td className="p-4">{expense.account}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>



    </div>

  );
}
