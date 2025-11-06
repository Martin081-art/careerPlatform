import { dbAdmin, adminAuth } from "../config/firebaseConfig.js";

// -------------------- Register Student --------------------
export const registerStudent = async (req, res) => {
  try {
    const { name, email, academicRecords, uid } = req.body;

    if (!name || !email || !academicRecords || !uid) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const emailVerificationLink = await adminAuth.generateEmailVerificationLink(email);

    await dbAdmin.collection("students").doc(uid).set({
      name,
      email,
      academicRecords,
      createdAt: new Date().toISOString(),
      documents: [],
      coursesApplied: [],
      phone: "",
      qualification: "",
      admittedInstitution: "",
      selectedCourse: "",
      status: "",
    });

    res.json({
      success: true,
      message: "Student registered successfully!",
      studentId: uid,
      emailVerificationLink,
    });
  } catch (error) {
    console.error("Register student error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- Student Login --------------------
export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Backend does not verify password directly; Firebase handles it
    return res.status(501).json({
      success: false,
      message: "Login must be done via Firebase Auth client SDK."
    });
  } catch (error) {
    console.error("Login student error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- Verify Student Token --------------------
export const verifyStudent = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: "Token is required" });

    const decodedToken = await adminAuth.verifyIdToken(token);
    const studentDoc = await dbAdmin.collection("students").doc(decodedToken.uid).get();

    if (!studentDoc.exists) return res.status(404).json({ success: false, message: "Student record not found" });

    const student = studentDoc.data();
    res.json({
      success: true,
      message: "Token verified successfully",
      student: { uid: decodedToken.uid, email: decodedToken.email, ...student },
    });
  } catch (error) {
    console.error("Verify student error:", error);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

// -------------------- Apply for Course --------------------
export const applyCourse = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    const courseDoc = await dbAdmin.collection("courses").doc(courseId).get();
    if (!courseDoc.exists) return res.status(404).json({ success: false, message: "Course not found" });

    const course = courseDoc.data();
    const institutionId = course.institutionId;
    if (!institutionId) return res.status(400).json({ success: false, message: "Institution ID missing in course" });

    const existingApps = await dbAdmin.collection("applications")
      .where("studentId", "==", studentId)
      .where("courseId", "==", courseId)
      .get();

    if (!existingApps.empty) return res.status(400).json({ success: false, message: "Already applied to this course" });

    const institutionApps = await dbAdmin.collection("applications")
      .where("studentId", "==", studentId)
      .where("institutionId", "==", institutionId)
      .get();

    if (institutionApps.size >= 2) return res.status(400).json({ success: false, message: "Max 2 courses per institution" });

    const docRef = await dbAdmin.collection("applications").add({
      studentId,
      courseId,
      institutionId,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    res.json({ success: true, applicationId: docRef.id });
  } catch (error) {
    console.error("Apply course error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- View Admissions --------------------
export const viewAdmissions = async (req, res) => {
  try {
    const { studentId } = req.params;
    const snapshot = await dbAdmin.collection("admissions").where("studentId", "==", studentId).get();
    const admissions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, admissions });
  } catch (error) {
    console.error("View admissions error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- Upload Documents --------------------
export const uploadDocuments = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { documents } = req.body;
    if (!documents || !Array.isArray(documents)) return res.status(400).json({ success: false, message: "Documents must be an array" });

    await dbAdmin.collection("students").doc(studentId).update({
      documents,
      updatedAt: new Date().toISOString(),
    });

    res.json({ success: true, message: "Documents uploaded successfully" });
  } catch (error) {
    console.error("Upload documents error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- View Opportunities --------------------
export const viewOpportunities = async (req, res) => {
  try {
    const snapshot = await dbAdmin.collection("opportunities").get();
    const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, jobs });
  } catch (error) {
    console.error("View opportunities error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- Apply for Job --------------------
export const applyJob = async (req, res) => {
  try {
    const { studentId, jobId } = req.body;

    const existing = await dbAdmin.collection("jobApplications")
      .where("studentId", "==", studentId)
      .where("jobId", "==", jobId)
      .get();

    if (!existing.empty) return res.status(400).json({ success: false, message: "Already applied to this job" });

    const docRef = await dbAdmin.collection("jobApplications").add({
      studentId,
      jobId,
      status: "pending",
      appliedAt: new Date().toISOString(),
    });

    res.json({ success: true, applicationId: docRef.id });
  } catch (error) {
    console.error("Apply job error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- Get Job Notifications --------------------
export const getJobNotifications = async (req, res) => {
  try {
    const { studentId } = req.params;
    const studentDoc = await dbAdmin.collection("students").doc(studentId).get();
    if (!studentDoc.exists) return res.status(404).json({ success: false, message: "Student not found" });

    const snapshot = await dbAdmin.collection("opportunities").get();
    const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, jobs });
  } catch (error) {
    console.error("Get job notifications error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- Get Courses --------------------
export const getCourses = async (req, res) => {
  try {
    const snapshot = await dbAdmin.collection("courses").get();
    const courses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, courses });
  } catch (error) {
    console.error("Fetch courses error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
