import express from "express";
import {
  createExpense,
  getExpenses,
} from "../controllers/expenseController.js";

const router = express.Router();

router.route("/").post(createExpense).get(getExpenses);

export default router;
