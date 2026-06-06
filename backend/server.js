import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./server/config/db.js";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "UP", message: "Server is running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port no. ${PORT}`);
});
