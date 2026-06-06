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

export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedExpense = await Expense.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedExpense) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not found" });
    }

    res.status(200).json({
      success: true,
      data: updatedExpense,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByIdAndDelete(id);

    if (!expense) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not found" });
    }

    res.status(200).json({
      success: true,
      message: "Expense successfully deleted",
      data: {},
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
