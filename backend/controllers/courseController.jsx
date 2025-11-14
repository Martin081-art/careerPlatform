// Helper: validate grade values
const validGrades = ["A", "B", "C", "D", "E"];

export const addCourse = async (req, res) => {
  try {
    const { instituteId } = req.params;
    const { name, facultyId, requirements } = req.body;

    // Validate course name
    if (!name) return res.status(400).json({ success: false, message: "Course name is required" });

    // Validate requirements (optional)
    if (requirements) {
      for (let subject in requirements) {
        const grade = requirements[subject];
        if (!validGrades.includes(grade)) {
          return res.status(400).json({ 
            success: false, 
            message: `Invalid grade for ${subject}. Must be one of ${validGrades.join(", ")}` 
          });
        }
      }
    }

    // Add course to Firestore
    const docRef = await dbAdmin.collection("courses").add({
      name,
      facultyId: facultyId || "",
      instituteId,
      requirements: requirements || {}, // empty object if none
      createdAt: new Date().toISOString(),
    });

    res.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error("Add course error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
