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
  addAdmin, // <-- import the new admin controller
} from "../controllers/adminController.js";

const router = express.Router();

// -------------------- Institutions --------------------
router.get("/institutions", getInstitutions);
router.post("/institutes", addInstitution);
router.delete("/institutes/:id", deleteInstitution);

// -------------------- Faculties --------------------
router.get("/faculties", getFaculties);
router.post("/faculties", addFaculty);
router.delete("/faculties/:id", deleteFaculty);

// -------------------- Courses --------------------
router.get("/courses", getCourses);
router.post("/courses", addCourse);
router.delete("/courses/:id", deleteCourse);

// -------------------- Companies --------------------
router.post("/companies", addCompany);

router.get("/companies", getCompanies);
router.patch("/companies/:id", updateCompanyStatus);
router.delete("/companies/:id", deleteCompany);

// -------------------- Admins --------------------
router.post("/admins", addAdmin); // <-- new route to add admin

// -------------------- Reports --------------------
router.get("/reports", getReports);

// -------------------- Update routes --------------------
router.patch("/institutes/:id", updateInstitution);
router.patch("/faculties/:id", updateFaculty);
router.patch("/courses/:id", updateCourse);



// -------------------- Admissions routes --------------------
router.patch("/admissions/:courseId/publish", publishAdmission);
router.get("/users", getRegisteredUsers);
router.patch("/admissions/:applicationId/admit", admitStudent);


export default router;
