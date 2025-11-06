// updateCoursesWithInstitution.js
import { dbAdmin } from "./config/firebaseConfig.js"; // adjust path if needed

// Mapping of facultyId → institutionId
const facultyToInstitution = {
  "WrevlnirTnURoxIRtaa1": "2esMdjiBFKhM0gZFHdq5l86P2Nw1",
  "h8UtdTlQO4F9THkdqLV0": "2esMdjiBFKhM0gZFHdq5l86P2Nw1",
  "ofYbnx2rZPwOoXgqlXot": "5AHoP7jVxxgZqThGcZKU",
  "zUaF8GwuljZun75X2S4K": "Inst5AHoP7jVxxgZqThGcZKUD012",
  "nryLjNXw3qqr4UKkqxJX": "2esMdjiBFKhM0gZFHdq5l86P2Nw1"
};

const updateCourses = async () => {
  try {
    const snapshot = await dbAdmin.collection("courses").get();

    if (snapshot.empty) {
      console.log("No courses found in the collection.");
      return;
    }

    for (const doc of snapshot.docs) {
      const courseData = doc.data();
      const facultyId = courseData.facultyId;

      const institutionId = facultyToInstitution[facultyId];

      if (!institutionId) {
        console.warn(`No institutionId found for course "${courseData.name}" with facultyId: ${facultyId}`);
        continue; // skip if mapping not found
      }

      await dbAdmin.collection("courses").doc(doc.id).update({
        institutionId
      });

      console.log(`Updated course "${courseData.name}" with institutionId: ${institutionId}`);
    }

    console.log("✅ All courses updated successfully!");
  } catch (error) {
    console.error("Error updating courses:", error);
  }
};

updateCourses();
