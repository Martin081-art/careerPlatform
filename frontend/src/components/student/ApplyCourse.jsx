import React, { useState, useEffect } from "react";
import { auth } from "../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import "../../components/styles/PanelStyles.css";

const gradeValue = { "A": 5, "B": 4, "C": 3, "D": 2, "E": 1 };

const ApplyCourse = () => {
  const [courses, setCourses] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingCourseId, setLoadingCourseId] = useState(null);
  const [studentRecords, setStudentRecords] = useState(null);

  // Watch Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setCurrentUser(firebaseUser);
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken(true);
          const res = await fetch(
            `https://careerplatform-z4jj.onrender.com/students/${firebaseUser.uid}/profile`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const data = await res.json();
          if (data.success) {
            console.log("✅ Fetched student academic records:", data.student.academicRecords);
            // normalize all keys to lowercase
            const normalizedRecords = {};
            Object.entries(data.student.academicRecords).forEach(([key, val]) => {
              normalizedRecords[key.toLowerCase()] = val;
            });
            setStudentRecords(normalizedRecords);
          }
        } catch (err) {
          console.error("❌ Failed to fetch student records:", err);
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
        if (data.success) {
          console.log("📚 Fetched courses:", data.courses);
          setCourses(data.courses);
        }
      } catch (err) {
        console.error("❌ Failed to fetch courses:", err);
      }
    };
    fetchCourses();
  }, []);

  // Check if student meets course requirements
  const meetsRequirements = (requirements, courseName) => {
    if (!requirements || !studentRecords) return false;

    console.log(`\n🔍 Checking requirements for course: ${courseName}`);
    let allMatched = true;

    Object.entries(requirements).forEach(([subject, minGrade]) => {
      const studentGrade = studentRecords[subject.toLowerCase()]; // normalize subject key
      const matched = studentGrade && gradeValue[studentGrade] >= gradeValue[minGrade];
      console.log(
        `Subject: ${subject}, Required: ${minGrade}, Student: ${studentGrade || "N/A"}, Matched: ${matched}`
      );
      if (!matched) allMatched = false;
    });

    console.log(allMatched ? "✅ All requirements matched!" : "❌ Some requirements not met.");
    return allMatched;
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
      console.error("❌ Apply course error:", err);
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
          const eligible = meetsRequirements(course.requirements, course.name);
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
