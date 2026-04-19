import cors from "cors";
import "dotenv/config";
import express from "express";

import connectDB from "./config/db.js";

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
