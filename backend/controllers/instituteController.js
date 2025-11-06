import { adminAuth, dbAdmin } from "../config/firebaseConfig.js";

// ------------------- Register Institute -------------------
export const registerInstitute = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;
    if (!name || !email || !password || !address) return res.status(400).json({ success:false, message:"All fields required" });

    const userRecord = await adminAuth.createUser({ email, password, displayName: name });
    const emailVerificationLink = await adminAuth.generateEmailVerificationLink(email);

    await dbAdmin.collection("institutes").doc(userRecord.uid).set({
      name, email, address, status: "pending", createdAt: new Date().toISOString()
    });

    res.json({ success: true, message: "Institute registered. Verify email before login.", instituteId: userRecord.uid, emailVerificationLink });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success:false, message: error.message });
  }
};

// ------------------- Login Institute -------------------
export const loginInstitute = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) 
      return res.status(400).json({ success: false, message: "Email required" });

    // Get Firebase Auth user
    const user = await adminAuth.getUserByEmail(email);
    if (!user.emailVerified) 
      return res.status(403).json({ success: false, message: "Email not verified" });

    // Get Firestore document for institute
    const docRef = dbAdmin.collection("institutes").doc(user.uid);
    const doc = await docRef.get();
    if (!doc.exists) 
      return res.status(404).json({ success: false, message: "Institute not found" });

    // Send back institute data **including its Firestore ID**
    res.json({
      success: true,
      institute: {
        id: doc.id,       // <--- this is the instituteId
        ...doc.data()
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ------------------- Profile -------------------
export const getInstituteProfile = async (req, res) => {
  try {
    const { instituteId } = req.params;
    const doc = await dbAdmin.collection("institutes").doc(instituteId).get();
    if (!doc.exists) return res.status(404).json({ success:false, message:"Institute not found" });

    res.json({ success:true, institute: doc.data() });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ success:false, message: error.message });
  }
};

export const updateInstituteProfile = async (req, res) => {
  try {
    const { instituteId } = req.params;
    const updateData = req.body;
    await dbAdmin.collection("institutes").doc(instituteId).update(updateData);

    res.json({ success:true, message:"Institute profile updated successfully" });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success:false, message: error.message });
  }
};

// ------------------- Faculties -------------------
export const getFaculties = async (req, res) => {
  try {
    const { instituteId } = req.params;
    const snapshot = await dbAdmin.collection("faculties").where("instituteId", "==", instituteId).get();
    const faculties = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success:true, faculties });
  } catch (error) {
    console.error("Get faculties error:", error);
    res.status(500).json({ success:false, message: error.message });
  }
};

export const addFaculty = async (req, res) => {
  try {
    const { instituteId } = req.params;
    const { name } = req.body;
    const docRef = await dbAdmin.collection("faculties").add({ name, instituteId });
    res.json({ success:true, id: docRef.id });
  } catch (error) {
    console.error("Add faculty error:", error);
    res.status(500).json({ success:false, message: error.message });
  }
};

export const updateFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const updateData = req.body;
    await dbAdmin.collection("faculties").doc(facultyId).update(updateData);
    res.json({ success:true, message:"Faculty updated successfully" });
  } catch (error) {
    console.error("Update faculty error:", error);
    res.status(500).json({ success:false, message: error.message });
  }
};

export const deleteFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;
    await dbAdmin.collection("faculties").doc(facultyId).delete();
    res.json({ success:true });
  } catch (error) {
    console.error("Delete faculty error:", error);
    res.status(500).json({ success:false, message: error.message });
  }
};

// ------------------- Courses -------------------
export const getCourses = async (req, res) => {
  try {
    const { instituteId } = req.params;
    const snapshot = await dbAdmin.collection("courses").where("instituteId", "==", instituteId).get();
    const courses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success:true, courses });
  } catch (error) {
    console.error("Get courses error:", error);
    res.status(500).json({ success:false, message: error.message });
  }
};

export const addCourse = async (req, res) => {
  try {
    const { instituteId } = req.params;
    const { name, facultyId } = req.body;
    const docRef = await dbAdmin.collection("courses").add({ name, facultyId, instituteId });
    res.json({ success:true, id: docRef.id });
  } catch (error) {
    console.error("Add course error:", error);
    res.status(500).json({ success:false, message: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const updateData = req.body;
    await dbAdmin.collection("courses").doc(courseId).update(updateData);
    res.json({ success:true, message:"Course updated successfully" });
  } catch (error) {
    console.error("Update course error:", error);
    res.status(500).json({ success:false, message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    await dbAdmin.collection("courses").doc(courseId).delete();
    res.json({ success:true });
  } catch (error) {
    console.error("Delete course error:", error);
    res.status(500).json({ success:false, message: error.message });
  }
};

// ------------------- Student Applications -------------------
export const getStudentApplications = async (req, res) => {
  try {
    const { instituteId } = req.params;

    // Fetch applications for the institute
    const snapshot = await dbAdmin.collection("applications")
      .where("institutionId", "==", instituteId)
      .get();

    const applications = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const appData = doc.data();

        // Fetch student name
        let studentName = "Unknown Student";
        if (appData.studentId) {
          const studentDoc = await dbAdmin.collection("students").doc(appData.studentId).get();
          if (studentDoc.exists) studentName = studentDoc.data().name;
        }

        // Fetch course name
        let courseName = "Unknown Course";
        if (appData.courseId) {
          const courseDoc = await dbAdmin.collection("courses").doc(appData.courseId).get();
          if (courseDoc.exists) courseName = courseDoc.data().name;
        }

        return {
          id: doc.id,
          ...appData,
          studentName,
          courseName
        };
      })
    );

    res.json({ success: true, applications });
  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



export const updateStudentStatus = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    const allowedStatuses = ["approved", "rejected", "pending"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    await dbAdmin.collection("applications").doc(studentId).update({ status });

    res.json({ success:true, message:"Student status updated successfully" });
  } catch (error) {
    console.error("Update student status error:", error);
    res.status(500).json({ success:false, message: error.message });
  }
};


export const publishAdmissions = async (req, res) => {
  try {
    const { instituteId } = req.params;
    const { courseId } = req.body;

    if (!courseId)
      return res.status(400).json({ success: false, message: "CourseId required" });

    // Fetch all applications for this course + institute
    const snapshot = await dbAdmin.collection("applications")
      .where("institutionId", "==", instituteId)
      .where("courseId", "==", courseId)
      .get();

    if (snapshot.empty) {
      return res.json({ success: true, message: "No applications found for this course" });
    }

    const batch = dbAdmin.batch();
    let count = 0;

    snapshot.docs.forEach(doc => {
      const appData = doc.data();

      // Only publish applications whose status is approved or rejected
      if (appData.status === "approved" || appData.status === "rejected") {
        const appRef = dbAdmin.collection("applications").doc(doc.id);
        batch.update(appRef, { status: "published" });
        count++;
      }
    });

    if (count === 0) {
      return res.json({ success: true, message: "No approved/rejected applications to publish" });
    }

    await batch.commit();

    res.json({ success: true, message: `${count} applications published successfully` });

  } catch (error) {
    console.error("Publish admissions error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
 
// ------------------- Publish Single Application -------------------
export const publishSingleApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    if (!applicationId) {
      return res.status(400).json({ success: false, message: "Application ID is required" });
    }

    const appRef = dbAdmin.collection("applications").doc(applicationId);
    const appDoc = await appRef.get();

    if (!appDoc.exists) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    const appData = appDoc.data();

    // Only publish applications with status approved or rejected
    if (!["approved", "rejected"].includes(appData.status)) {
      return res.status(400).json({ success: false, message: "Only approved or rejected applications can be published" });
    }

    await appRef.update({ status: "published" });

    res.json({ success: true, message: "Application published successfully", applicationId });
  } catch (error) {
    console.error("Publish single application error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



