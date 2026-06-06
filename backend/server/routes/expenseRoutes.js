import express from "express";
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController.js";

const router = express.Router();

router.route("/").post(createExpense).get(getExpenses);
router.route("/:id").put(updateExpense).delete(deleteExpense);

export default router;
