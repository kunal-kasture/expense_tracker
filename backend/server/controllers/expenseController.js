import Expense from "../models/Expense.js";
export const createExpense = async (req, res) => {
  try {
    const { title, amount, category, paymentMethod, notes, expenseDate } =
      req.body;

    const expense = await Expense.create({
      title,
      amount,
      category,
      paymentMethod,
      notes,
      expenseDate,
    });

    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({}).sort({ expenseDate: -1 });

    res
      .status(200)
      .json({ success: true, count: expenses.length, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
