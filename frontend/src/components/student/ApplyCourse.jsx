import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase/config"; // your Firebase config
import { onAuthStateChanged } from "firebase/auth";
import "../../components/styles/PanelStyles.css";

const ApplyCourse = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingCourseId, setLoadingCourseId] = useState(null); // track loading per course

  // Watch Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setCurrentUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("https://careerplatform-z4jj.onrender.com/students/courses");
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

    setLoadingCourseId(courseId); // mark this course as loading

    try {
      const activeUser = currentUser || auth.currentUser;
      if (!activeUser) {
        alert("Login session expired. Please log in again.");
        return;
      }

      const token = await activeUser.getIdToken(true);

      const payload = {
        studentId: activeUser.uid,
        courseId,
        institutionId,
      };

      console.log("📦 Payload:", payload);

      const res = await fetch("https://careerplatform-z4jj.onrender.com/students/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("🧾 Backend response:", data);

      if (data.success) {
        alert("Course application submitted successfully!");
      } else {
        alert(data.message || "Failed to apply for course");
      }
    } catch (error) {
      console.error("Apply course error:", error);
      alert("Error applying for course");
    } finally {
      setLoadingCourseId(null); // reset loading state
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
              disabled={loadingCourseId === course.id}
            >
              {loadingCourseId === course.id ? "Applying..." : "Apply"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplyCourse;
