import { dbAdmin, adminAuth } from "../config/firebaseConfig.js";

// -------------------- Institutions --------------------
export const getInstitutions = async (req, res) => {
  try {
    const snapshot = await dbAdmin.collection("institutes").get();
    const institutions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, institutions });
  } catch (error) {
    console.error("Get institutions error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addInstitution = async (req, res) => {
  try {
    const { name, email, address } = req.body;
    const docRef = await dbAdmin.collection("institutes").add({
      name,
      email,
      address,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    res.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error("Add institution error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    await dbAdmin.collection("institutes").doc(id).delete();
    res.json({ success: true });
  } catch (error) {
    console.error("Delete institution error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body; // e.g., { name: "New Name" }
    await dbAdmin.collection("institutes").doc(id).update(updateData);
    res.json({ success: true, message: "Institution updated successfully" });
  } catch (error) {
    console.error("Update institution error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- Faculties --------------------
export const getFaculties = async (req, res) => {
  try {
    const snapshot = await dbAdmin.collection("faculties").get();
    const faculties = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, faculties });
  } catch (error) {
    console.error("Get faculties error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addFaculty = async (req, res) => {
  try {
    const { name, institutionId } = req.body;
    const docRef = await dbAdmin.collection("faculties").add({ name, institutionId });
    res.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error("Add faculty error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    await dbAdmin.collection("faculties").doc(id).delete();
    res.json({ success: true });
  } catch (error) {
    console.error("Delete faculty error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    await dbAdmin.collection("faculties").doc(id).update(updateData);
    res.json({ success: true, message: "Faculty updated successfully" });
  } catch (error) {
    console.error("Update faculty error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- Courses --------------------
export const getCourses = async (req, res) => {
  try {
    const snapshot = await dbAdmin.collection("courses").get();
    const courses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, courses });
  } catch (error) {
    console.error("Get courses error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addCourse = async (req, res) => {
  try {
    const { name, facultyId } = req.body;
    const docRef = await dbAdmin.collection("courses").add({ name, facultyId });
    res.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error("Add course error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await dbAdmin.collection("courses").doc(id).delete();
    res.json({ success: true });
  } catch (error) {
    console.error("Delete course error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    await dbAdmin.collection("courses").doc(id).update(updateData);
    res.json({ success: true, message: "Course updated successfully" });
  } catch (error) {
    console.error("Update course error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- Companies --------------------
// Add company
export const addCompany = async (req, res) => {
  try {
    const { name, email, address } = req.body;
    const docRef = await dbAdmin.collection("companies").add({
      name,
      email,
      address,
      status: "pending",
      createdAt: new Date().toISOString()
    });
    res.json({ success: true, companyId: docRef.id });
  } catch (error) {
    console.error("Add company error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCompanies = async (req, res) => {
  try {
    const snapshot = await dbAdmin.collection("companies").get();
    const companies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, companies });
  } catch (error) {
    console.error("Get companies error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCompanyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await dbAdmin.collection("companies").doc(id).update({ status });
    res.json({ success: true });
  } catch (error) {
    console.error("Update company status error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    await dbAdmin.collection("companies").doc(id).delete();
    res.json({ success: true });
  } catch (error) {
    console.error("Delete company error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- Admins --------------------
export const addAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    const userRecord = await adminAuth.createUser({
      email: username,
      password,
      displayName: username,
    });
    await dbAdmin.collection("admins").doc(userRecord.uid).set({
      username,
      createdAt: new Date().toISOString(),
    });
    res.json({ success: true, message: "Admin added successfully", adminId: userRecord.uid });
  } catch (error) {
    console.error("Add admin error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- Reports --------------------
export const getReports = async (req, res) => {
  try {
    // Fetch counts in parallel
    const [
      studentsSnap,
      institutionsSnap,
      companiesSnap,
      opportunitiesSnap,
      applicationsSnap,
    ] = await Promise.all([
      dbAdmin.collection("students").get(),
      dbAdmin.collection("institutes").get(),
      dbAdmin.collection("companies").get(),
      dbAdmin.collection("opportunities").get(),
      dbAdmin.collection("applications").get(),
    ]);

    // Summarize
    const reports = {
      totalStudents: studentsSnap.size,
      totalInstitutions: institutionsSnap.size,
      totalCompanies: companiesSnap.size,
      totalJobs: opportunitiesSnap.size,
      totalApplications: applicationsSnap.size,
    };

    // Send response
    res.json({ success: true, reports });
  } catch (error) {
    console.error("Get reports error:", error);
    res.status(500).json({ success: false, message: "Failed to load reports" });
  }
};


// -------------------- Admissions --------------------
// -------------------- Admissions --------------------
export const publishAdmission = async (req, res) => {
  try {
    const { courseId } = req.params;

    const applicationsSnapshot = await dbAdmin
      .collection("applications")
      .where("courseId", "==", courseId)
      .where("status", "==", "admitted")
      .get();

    if (applicationsSnapshot.empty) {
      return res.status(404).json({ success: false, message: "No admitted students found" });
    }

    const admittedStudents = [];
    let institutionId = null;
    applicationsSnapshot.forEach(doc => {
      const data = doc.data();
      admittedStudents.push(data.studentId);
      institutionId = data.institutionId; // all from same institution
    });

    const admissionRef = await dbAdmin.collection("admissions").add({
      courseId,
      institutionId,
      publishedAt: new Date().toISOString(),
      admittedStudents
    });

    res.json({
      success: true,
      message: "Admission published successfully",
      admissionId: admissionRef.id
    });
  } catch (error) {
    console.error("Publish admission error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- Admit Student --------------------
export const admitStudent = async (req, res) => {
  try {
    const { applicationId } = req.params;

    // Get the application document
    const applicationDoc = await dbAdmin.collection("applications").doc(applicationId).get();
    if (!applicationDoc.exists) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    const applicationData = applicationDoc.data();

    // Move to admissions collection
    await dbAdmin.collection("admissions").doc(applicationId).set({
      ...applicationData,
      status: "admitted",
      admittedAt: new Date().toISOString(),
    });

    // Optionally delete from applications
    await dbAdmin.collection("applications").doc(applicationId).delete();

    res.json({ success: true, message: "Student admitted successfully" });
  } catch (error) {
    console.error("Admit student error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getRegisteredUsers = async (req, res) => {
  try {
    const snapshot = await dbAdmin.collection("users").get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, users });
  } catch (error) {
    console.error("Get registered users error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


