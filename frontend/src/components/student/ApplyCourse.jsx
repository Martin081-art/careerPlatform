import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase/config"; // your Firebase config
import { onAuthStateChanged } from "firebase/auth";
import "../../components/styles/PanelStyles.css";

const ApplyCourse = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // ✅ Watch Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setCurrentUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("https://careerplatform-xu14.onrender.com/students/courses");
        const data = await res.json();
        if (data.success) {
          setCourses(data.courses);
        } else {
          alert(data.message || "Failed to fetch courses");
        }
      } catch (error) {
        console.error("Fetch courses error:", error);
        alert("Failed to fetch courses");
      }
    };

    fetchCourses();
  }, []);

  const handleApply = async (courseId, institutionId) => {
  if (!user && !currentUser) {
    alert("You must be logged in to apply for a course");
    return;
  }

  setLoading(true);

  try {
    const activeUser = currentUser || auth.currentUser;
    if (!activeUser) {
      alert("Login session expired. Please log in again.");
      return;
    }

    const token = await activeUser.getIdToken(true);

    // ✅ Ensure we include studentId and institutionId in the payload
    const payload = {
      studentId: activeUser.uid,
      courseId,
      institutionId, // from the course object
    };

    console.log("🎯 Apply button clicked");
    console.log("📘 Course ID:", courseId);
    console.log("🏛️ Institution ID:", institutionId);
    console.log("👤 Current user state:", { user, currentUser });
    console.log("🪪 Firebase UID (studentId):", activeUser.uid);
    console.log("📦 Payload being sent to backend:", payload);

    const res = await fetch("https://careerplatform-xu14.onrender.com/students/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    console.log("🧾 Raw backend response:", data);

    if (data.success) {
      alert("Course application submitted successfully!");
    } else {
      alert(data.message || "Failed to apply for course");
    }
  } catch (error) {
    console.error("Apply course error:", error);
    alert("Error applying for course");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="student-panel-container">
      <h2>Available Courses</h2>
      {courses.length === 0 && <p>No courses available.</p>}
      <div className="card-grid">
        {courses.map((course) => (
          <div key={course.id} className="card">
            <h3>{course.name}</h3>
            <p>Institution ID: {course.institutionId}</p>
            <button
              onClick={() => handleApply(course.id, course.institutionId)}
              disabled={loading}
            >
              {loading ? "Applying..." : "Apply"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplyCourse;
