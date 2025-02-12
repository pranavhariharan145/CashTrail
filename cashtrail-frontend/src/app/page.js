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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Expense Tracker</h1>

      {/* New Expense Button */}
      <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4" onClick={() => setShowForm(!showForm)}>
        New
      </button>

      {/* Form (Only shows when showForm is true) */}
      {showForm && (
        <form className="mb-4 p-4 border rounded bg-gray-100" onSubmit={handleSubmit}>
          <input type="date" name="date" value={formData.date} onChange={handleChange} className="border p-2 mb-2 w-full" required />
          <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} className="border p-2 mb-2 w-full" required />
          <input type="text" name="payee" placeholder="Payee" value={formData.payee} onChange={handleChange} className="border p-2 mb-2 w-full" required />
          <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} className="border p-2 mb-2 w-full" required />
          <input type="text" name="account" placeholder="Account" value={formData.account} onChange={handleChange} className="border p-2 mb-2 w-full" required />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Add Expense</button>
        </form>
      )}

      {/* Expenses Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-black">
            <th className="border p-2"></th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Payee</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Account</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense._id} className="text-center">
              <td className="border p-2">
                <input type="checkbox" />
              </td>
              <td className="border p-2">{new Date(expense.date).toLocaleDateString()}</td>
              <td className="border p-2">{expense.category}</td>
              <td className="border p-2">{expense.payee}</td>
              <td className="border p-2">${expense.amount}</td>
              <td className="border p-2">{expense.account}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
