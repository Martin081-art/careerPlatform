import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "./config/firebaseConfig.js"; // your Firebase admin setup

// Routes
import studentRoutes from "./routes/studentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import instituteRoutes from "./routes/instituteRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ------------------- Middleware -------------------
// Parse JSON & URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------- CORS -------------------
const allowedOrigins = [
  "http://localhost:3000",
  "https://learning-platform-c696a.web.app"
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // server-to-server requests
    if(allowedOrigins.indexOf(origin) === -1){
      return callback(new Error(`CORS policy does not allow access from: ${origin}`), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ------------------- Test CORS -------------------
app.get("/cors-test", (req, res) => {
  res.json({ message: "✅ CORS is working!" });
});

// ------------------- Routes -------------------
app.use("/students", studentRoutes);
app.use("/admin", adminRoutes);
app.use("/institute", instituteRoutes);
app.use("/companies", companyRoutes);

// ------------------- Test Firebase -------------------
app.get("/test-firebase", async (req, res) => {
  try {
    const users = await admin.auth().listUsers(10);
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ------------------- Root -------------------
app.get("/", (req, res) => {
  res.send("✅ Server is alive and running!");
});

// ------------------- Start server -------------------
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
