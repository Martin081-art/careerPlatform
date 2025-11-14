import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import "../../components/styles/PanelStyles.css";

const gradeValue = { "A": 5, "B": 4, "C": 3, "D": 2, "E": 1 };

const ApplyCourse = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingCourseId, setLoadingCourseId] = useState(null);
  const [studentRecords, setStudentRecords] = useState(null);

  // Watch Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setCurrentUser(firebaseUser);
      if (firebaseUser) {
        // Fetch student academic records from backend
        try {
          const token = await firebaseUser.getIdToken(true);
          const res = await fetch(
            `https://careerplatform-z4jj.onrender.com/students/profile/${firebaseUser.uid}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const data = await res.json();
          if (data.success) {
            setStudentRecords(data.student.academicRecords);
          }
        } catch (err) {
          console.error("Failed to fetch student records:", err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("https://careerplatform-z4jj.onrender.com/students/courses");
        const data = await res.json();
        if (data.success) setCourses(data.courses);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };
    fetchCourses();
  }, []);

  // Check if student meets course requirements
  const meetsRequirements = (requirements) => {
    if (!requirements || !studentRecords) return false;
    return Object.entries(requirements).every(([subject, minGrade]) => {
      const studentGrade = studentRecords[subject];
      return studentGrade && gradeValue[studentGrade] >= gradeValue[minGrade];
    });
  };

  const handleApply = async (courseId, institutionId) => {
    if (!currentUser) {
      alert("You must be logged in to apply for a course");
      return;
    }

    setLoadingCourseId(courseId);

    try {
      const token = await currentUser.getIdToken(true);
      const res = await fetch("https://careerplatform-z4jj.onrender.com/students/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId: currentUser.uid,
          courseId,
          institutionId,
        }),
      });

      const data = await res.json();
      if (data.success) alert("Course application submitted successfully!");
      else alert(data.message || "Failed to apply for course");
    } catch (err) {
      console.error("Apply course error:", err);
      alert("Error applying for course");
    } finally {
      setLoadingCourseId(null);
    }
  };

  return (
    <div className="student-panel-container">
      <h2>Available Courses</h2>
      {courses.length === 0 && <p>No courses available.</p>}

      <div className="card-grid">
        {courses.map((course) => {
          const eligible = meetsRequirements(course.requirements);
          return (
            <div key={course.id} className="card">
              <h3>{course.name}</h3>
              <p><strong>Institution ID:</strong> {course.institutionId}</p>

              {course.requirements && (
                <>
                  <p><strong>Requirements:</strong></p>
                  <ul>
                    {Object.entries(course.requirements).map(([subject, grade]) => (
                      <li key={subject}>
                        {subject.charAt(0).toUpperCase() + subject.slice(1)}: minimum {grade}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <button
                onClick={() => handleApply(course.id, course.institutionId)}
                disabled={loadingCourseId === course.id || !eligible}
                style={{
                  backgroundColor: eligible ? "#00bcd4" : "#ccc",
                  cursor: eligible ? "pointer" : "not-allowed",
                }}
              >
                {loadingCourseId === course.id ? "Applying..." : eligible ? "Apply" : "Does not meet requirements"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApplyCourse;
