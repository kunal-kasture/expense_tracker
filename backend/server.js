import dns from "dns";
import dotenv from "dotenv";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./server/config/db.js";
import expenseRoutes from "./server/routes/expenseRoutes.js";
import authRoutes from "./server/routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/expenses", expenseRoutes);
app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "UP", message: "Server is running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port no. ${PORT}`);
});
