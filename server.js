import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import freeLancerRoutes from "./routes/freeLancerRoutes.js";
import pricingRoutes from "./routes/pricingRoutes.js";
import projectshowRoutes from "./routes/projectshowRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Database Connect
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", freeLancerRoutes);
app.use("/api", pricingRoutes);
app.use("/api", projectshowRoutes);
app.use("/api", bookingRoutes);

app.get("/", (req, res) => {
  res.send("Server is up and running");
});

app.listen(PORT, "localhost", () => {
  console.log(`Server is running on localhost:${PORT}`);
});
