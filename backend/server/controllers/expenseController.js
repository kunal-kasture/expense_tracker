import Expense from "../models/expenseModel.js";
export const createExpense = async (req, res) => {
  try {
    const { title, amount, category, paymentMethod, notes, expenseDate } =
      req.body;

    const expense = await Expense.create({
      user: req.user.id,
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
    const expenses = await Expense.find({ user: req.user.id }).sort({
      expenseDate: -1,
    });

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
    const expense = await Expense.findById(id);

    if (!expense) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not found" });
    }

    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this expense",
      });
    }

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
    const expense = await Expense.findById(id);

    if (!expense) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not found" });
    }

    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this expense",
      });
    }

    await Expense.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully ",
      data: {},
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getExpenseStats = async (req, res) => {
  try {
    const mongoose = (await import("mongoose")).default;

    const userId = new mongoose.Types.ObjectId(req.user.id);

    const stats = await Expense.aggregate([
      { $match: { user: userId } },

      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },

      { $project: { _id: 0, category: "$_id", totalAmount: 1, count: 1 } },
    ]);

    const paymentStats = await Expense.aggregate([
      { $match: { user: userId } },

      {
        $group: {
          _id: "$paymentMethod",
          totalAmount: { $sum: { $toDouble: "$amount" } },
        },
      },

      {
        $project: {
          _id: 0,
          paymentMethod: "$_id",
          totalAmount: 1,
        },
      },
    ]);
    const totalSpent = stats.reduce(
      (acc, current) => acc + current.totalAmount,
      0,
    );

    res.status(200).json({
      success: true,
      totalSpent,
      categoryBreakdown: stats,
      paymentBreakdown: paymentStats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
