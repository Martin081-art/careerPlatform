import React, { useEffect, useState } from "react";
import "../../components/styles/AdminCourses.css"; // modern styles

const validGrades = ["A", "B", "C", "D", "E"];

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [facultyId, setFacultyId] = useState("");
  const [name, setName] = useState("");
  const [requirements, setRequirements] = useState({
    Maths: "A",
    Accounting: "A",
    Sesotho: "A",
    Science: "A",
    Biology: "A",
    English: "A",
  });

  // Fetch functions
  const fetchCourses = async () => {
    try {
      const res = await fetch("https://careerplatform-z4jj.onrender.com/admin/courses");
      const data = await res.json();
      if (data.success) setCourses(data.courses);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const fetchFaculties = async () => {
    try {
      const res = await fetch("https://careerplatform-z4jj.onrender.com/admin/faculties");
      const data = await res.json();
      if (data.success) setFaculties(data.faculties);
    } catch (err) {
      console.error("Error fetching faculties:", err);
    }
  };

  const fetchInstitutions = async () => {
    try {
      const res = await fetch("https://careerplatform-z4jj.onrender.com/admin/institutions");
      const data = await res.json();
      if (data.success) setInstitutions(data.institutions);
    } catch (err) {
      console.error("Error fetching institutions:", err);
    }
  };

  // Handle requirements change
  const handleRequirementChange = (subject, grade) => {
    setRequirements(prev => ({ ...prev, [subject]: grade }));
  };

  // Add new course
  const addCourse = async () => {
    if (!name || !facultyId) {
      alert("Please fill all fields");
      return;
    }

    const selectedFaculty = faculties.find(fac => fac.id === facultyId);
    const institutionId = selectedFaculty?.institutionId;
    if (!institutionId) {
      alert("Selected faculty has no associated institution");
      return;
    }

    // Validate requirements
    for (const [subject, grade] of Object.entries(requirements)) {
      if (!validGrades.includes(grade)) {
        alert(`Invalid grade for ${subject}. Must be one of ${validGrades.join(", ")}`);
        return;
      }
    }

    try {
      const res = await fetch("https://careerplatform-z4jj.onrender.com/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, facultyId, institutionId, requirements }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Course added successfully!");
        setName("");
        setFacultyId("");
        setRequirements({
          Maths: "A",
          Accounting: "A",
          Sesotho: "A",
          Science: "A",
          Biology: "A",
          English: "A",
        });
        fetchCourses();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error adding course:", err);
      alert("Server error. Check console logs.");
    }
  };

  // Delete course
  const deleteCourse = async (id) => {
    try {
      const res = await fetch(`https://careerplatform-z4jj.onrender.com/admin/courses/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) fetchCourses();
    } catch (err) {
      console.error("Error deleting course:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchFaculties();
    fetchInstitutions();
  }, []);

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h3>Manage Courses</h3>
        <p className="muted">Create, view, and remove courses with requirements.</p>
      </header>

      <section className="surface">
        <div className="form-grid">
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Course Name"
          />

          <select
            className="input"
            value={facultyId}
            onChange={(e) => setFacultyId(e.target.value)}
          >
            <option value="">Select Faculty</option>
            {faculties.map(fac => {
              const inst = institutions.find(i => i.id === fac.institutionId);
              return <option key={fac.id} value={fac.id}>{fac.name} ({inst ? inst.name : "Unknown"})</option>;
            })}
          </select>

          {/* Requirements Inputs */}
          {Object.keys(requirements).map(subject => (
            <div key={subject}>
              <label>{subject}</label>
              <select
                value={requirements[subject]}
                onChange={(e) => handleRequirementChange(subject, e.target.value)}
              >
                {validGrades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="actions">
          <button className="btn primary" onClick={addCourse}>Add Course</button>
        </div>
      </section>

      <section className="surface">
        <ul className="courses-list">
          {courses.map(course => {
            const fac = faculties.find(f => f.id === course.facultyId);
            const inst = institutions.find(i => i.id === course.institutionId);
            return (
              <li key={course.id} className="course-item">
                <div className="course-info">
                  <strong>{course.name}</strong>
                  <span>
                    Faculty: {fac ? fac.name : "Unknown"} | 
                    Institution: {inst ? inst.name : "Unknown"}
                  </span>
                  {course.requirements && (
                    <ul className="requirements-list">
                      {Object.entries(course.requirements).map(([subj, grade]) => (
                        <li key={subj}>{subj}: {grade}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <button className="btn danger" onClick={() => deleteCourse(course.id)}>Delete</button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
