import { dbAdmin, adminAuth } from "../config/firebaseConfig.js";

export const registerCompany = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Create company in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    // Generate Firebase email verification link
    const verificationLink = await adminAuth.generateEmailVerificationLink(email);

    // Save company in Firestore
    await dbAdmin.collection("companies").doc(userRecord.uid).set({
      name,
      email,
      verified: false,
      createdAt: new Date().toISOString(),
    });

    // Respond with link for user to click/copy
    res.json({
      success: true,
      message: "Company registered successfully. Please verify your email.",
      verificationLink,
    });
  } catch (error) {
    console.error("Register company error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Lookup company in Firestore by email
    const snapshot = await dbAdmin.collection("companies").where("email", "==", email).get();
    if (snapshot.empty) return res.status(400).json({ success: false, message: "Company not found" });

    const companyDoc = snapshot.docs[0];
    const companyData = companyDoc.data();

    // TODO: Validate password with Firebase Auth
    // For now, assume login is successful if email exists
    res.json({ success: true, company: { id: companyDoc.id, name: companyData.name, email: companyData.email } });
  } catch (error) {
    console.error("Login company error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// -------------------- Opportunities --------------------
export const getOpportunities = async (req, res) => {
  try {
    const snapshot = await dbAdmin
      .collection("opportunities")
      .where("companyId", "==", req.query.companyId)
      .get();
    const opportunities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, opportunities });
  } catch (error) {
    console.error("Get opportunities error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addOpportunity = async (req, res) => {
  try {
    const { title, description, qualifications, companyId } = req.body;
    const docRef = await dbAdmin.collection("opportunities").add({
      title,
      description,
      qualifications, // e.g., { academicPerformance, certificates, workExperience, relevance }
      companyId,
      createdAt: new Date().toISOString(),
    });
    res.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error("Add opportunity error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOpportunity = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    await dbAdmin.collection("opportunities").doc(id).update(updateData);
    res.json({ success: true, message: "Opportunity updated successfully" });
  } catch (error) {
    console.error("Update opportunity error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteOpportunity = async (req, res) => {
  try {
    const { id } = req.params;
    await dbAdmin.collection("opportunities").doc(id).delete();
    res.json({ success: true, message: "Opportunity deleted successfully" });
  } catch (error) {
    console.error("Delete opportunity error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- Filtered Applicants --------------------
export const getQualifiedApplicants = async (req, res) => {
  try {
    const { opportunityId } = req.params;
    const opportunityDoc = await dbAdmin.collection("opportunities").doc(opportunityId).get();
    if (!opportunityDoc.exists) return res.status(404).json({ success: false, message: "Opportunity not found" });

    const qualifications = opportunityDoc.data().qualifications;
    const studentsSnapshot = await dbAdmin.collection("students").get();

    // Filter students based on qualifications
    const qualified = studentsSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(student => {
        return (
          student.academicPerformance >= qualifications.academicPerformance &&
          student.certificates?.length >= qualifications.certificates &&
          student.workExperience >= qualifications.workExperience &&
          student.skills?.some(skill => qualifications.relevance.includes(skill))
        );
      });

    res.json({ success: true, applicants: qualified });
  } catch (error) {
    console.error("Get qualified applicants error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
