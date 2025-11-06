import express from "express";
import {
  registerStudent,
  loginStudent,
  verifyStudent,
  applyCourse,
  viewAdmissions,
  uploadDocuments,
  viewOpportunities,
  applyJob,
  getJobNotifications,
  getCourses
} from "../controllers/studentController.js";

const router = express.Router();

// Registration & Login
router.post("/register", registerStudent);
router.post("/login", loginStudent);          // now exists
router.post("/verify", verifyStudent);

// Course applications
router.post("/apply", applyCourse);

// Admissions
router.get("/admissions/:studentId", viewAdmissions);

// Upload documents
router.patch("/:studentId/documents", uploadDocuments);

// Job features
router.get("/opportunities", viewOpportunities); // alias to match frontend URL
router.post("/apply-job", applyJob);
router.get("/:studentId/job-notifications", getJobNotifications);

// Fetch courses
router.get("/courses", getCourses);

export default router;
