import cors from "cors";
import "dotenv/config";
import express from "express";
import authRoute from "./routes/userAuth.js";
import setupSwagger from "./swagger.js";

import connectDB from "./config/db.js";

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/auth", authRoute);
setupSwagger(app);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
