import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Expense title is required"],
      trim: true,
      maxlength: [100, "Expense title cannot exceed 100 characters"],
    },
    amount: {
      type: Number,
      required: [true, "Expense amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Expense category is required"],
      trim: true,
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      enum: {
        values: ["Cash", "Card", "UPI", "Net Banking"],
        message: "{VALUE} is not a supported payment method",
      },
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Expense Notes cannot exceed by 500 characters"],
    },
    expenseDate: {
      type: Date,
      required: [true, "Expense date is required"],
      default: Date.now,
    },
  },
  { timestamps: true },
);

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
