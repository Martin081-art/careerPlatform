import express from "express";
import { 
  registerInstitute,
  loginInstitute,
  getInstituteProfile,
  updateInstituteProfile,
  getFaculties,
  addFaculty,
  updateFaculty,
  deleteFaculty,
  getCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  getStudentApplications,
  updateStudentStatus,
  publishAdmissions,
  publishSingleApplication
} from "../controllers/instituteController.js";

const router = express.Router();
console.log("✅ Institute routes loaded");


// ------------------- Register & Login -------------------
router.post("/register", registerInstitute);
router.post("/login", loginInstitute);

// ------------------- Profile -------------------
router.get("/:instituteId", getInstituteProfile);
router.put("/:instituteId", updateInstituteProfile);

router.get("/test", (req, res) => {
  res.json({ message: "✅ Institute route is working!" });
});

// ------------------- Faculties -------------------
router.get("/:instituteId/faculties", getFaculties);
router.post("/:instituteId/faculties", addFaculty);
router.patch("/:instituteId/faculties/:facultyId", updateFaculty);
router.delete("/:instituteId/faculties/:facultyId", deleteFaculty);

// ------------------- Courses -------------------
router.get("/:instituteId/courses", getCourses);
router.post("/:instituteId/courses", addCourse);
router.patch("/:instituteId/courses/:courseId", updateCourse);
router.delete("/:instituteId/courses/:courseId", deleteCourse);

// ------------------- Student Applications & Admissions -------------------
router.get("/:instituteId/applications", getStudentApplications);
router.patch("/:instituteId/admissions/:studentId", updateStudentStatus);
router.patch("/:instituteId/admissions/publish", publishAdmissions);

// ------------------- Publish single application -------------------
router.patch("/:instituteId/admissions/application/:applicationId", publishSingleApplication);


export default router;
