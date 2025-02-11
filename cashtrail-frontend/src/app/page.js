"use client"; // Required for fetching data in Next.js

import { useEffect, useState } from "react";

export default function ExpenseTable() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/expenses") // Replace with your backend API
      .then((res) => res.json())
      .then((data) => setExpenses(data))
      .catch((err) => console.error("Error fetching expenses:", err));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Expense Tracker</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
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
