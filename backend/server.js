import express from "express";
import cors from "cors";

// Routes
import studentRoutes from "./routes/studentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import instituteRoutes from "./routes/instituteRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";

const app = express();
const PORT = 5000;

// ------------------- Middleware -------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------- Routes -------------------
// Student module
app.use("/students", studentRoutes);

// Admin module
app.use("/admin", adminRoutes);

// Institute module
app.use("/institute", instituteRoutes);

// Company module
app.use("/companies", companyRoutes);

// ------------------- Root -------------------

app.get("/", (req, res) => {
  res.send("✅ Server is alive and running!");
});


// ------------------- Start server -------------------
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
