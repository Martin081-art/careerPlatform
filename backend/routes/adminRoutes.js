import express from "express";
import {
  getInstitutions,
  addInstitution,
  deleteInstitution,
  updateInstitution,
  getFaculties,
  addFaculty,
  deleteFaculty,
  updateFaculty,
  getCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  getCompanies,
  updateCompanyStatus,
  deleteCompany,
  getReports,
  getRegisteredUsers,
  publishAdmission,
  addCompany,
  admitStudent,
  addAdmin,      // <-- add admin
  adminLogin,    // <-- admin login
} from "../controllers/adminController.js";

const router = express.Router();

// -------------------- Institutions --------------------
router.get("/institutions", getInstitutions);
router.post("/institutes", addInstitution);
router.delete("/institutes/:id", deleteInstitution);
router.patch("/institutes/:id", updateInstitution);

// -------------------- Faculties --------------------
router.get("/faculties", getFaculties);
router.post("/faculties", addFaculty);
router.delete("/faculties/:id", deleteFaculty);
router.patch("/faculties/:id", updateFaculty);

// -------------------- Courses --------------------
router.get("/courses", getCourses);
router.post("/courses", addCourse);
router.delete("/courses/:id", deleteCourse);
router.patch("/courses/:id", updateCourse);

// -------------------- Companies --------------------
router.post("/companies", addCompany);
router.get("/companies", getCompanies);
router.patch("/companies/:id", updateCompanyStatus);
router.delete("/companies/:id", deleteCompany);

// -------------------- Admins --------------------
router.post("/admins", addAdmin);         // add new admin
router.post("/admins/login", adminLogin); // login admin

// -------------------- Reports --------------------
router.get("/reports", getReports);

// -------------------- Admissions routes --------------------
router.patch("/admissions/:courseId/publish", publishAdmission);
router.patch("/admissions/:applicationId/admit", admitStudent);
router.get("/users", getRegisteredUsers);

export default router;
