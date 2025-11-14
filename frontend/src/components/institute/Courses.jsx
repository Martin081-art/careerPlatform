import React, { useState, useEffect } from "react";
import "../../components/styles/Panel.css";

const validGrades = ["A", "B", "C", "D", "E"];
const subjects = ["Maths", "Accounting", "Sesotho", "Science", "Biology", "English"];

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [newCourseName, setNewCourseName] = useState("");
  const [faculties, setFaculties] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [requirements, setRequirements] = useState(
    subjects.reduce((acc, subj) => ({ ...acc, [subj]: "A" }), {})
  );

  useEffect(() => {
    fetchCourses();
    fetchFaculties();
    fetchInstitutions();
  }, []);

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

  const handleRequirementChange = (subject, grade) => {
    setRequirements(prev => ({ ...prev, [subject]: grade }));
  };

  const addCourse = async () => {
    if (!newCourseName || !selectedFaculty) {
      alert("Please enter course name and select faculty");
      return;
    }

    const faculty = faculties.find(f => f.id === selectedFaculty);
    const institutionId = faculty?.institutionId;

    if (!institutionId) {
      alert("Selected faculty has no associated institution");
      return;
    }

    try {
      const res = await fetch("https://careerplatform-z4jj.onrender.com/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCourseName,
          facultyId: selectedFaculty,
          institutionId,
          requirements,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Course added successfully!");
        setNewCourseName("");
        setSelectedFaculty("");
        setRequirements(subjects.reduce((acc, subj) => ({ ...acc, [subj]: "A" }), {}));
        fetchCourses();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error adding course:", err);
      alert("Server error. Check console logs.");
    }
  };

  return (
    <div className="dashboard-main">
      <h1>Courses</h1>

      <div className="card-grid">
        {courses.map(course => {
          const faculty = faculties.find(f => f.id === course.facultyId);
          const institution = institutions.find(i => i.id === course.institutionId);
          return (
            <div className="card" key={course.id}>
              <h3>{course.name}</h3>
              <p>Faculty: {faculty ? faculty.name : "Unknown"}</p>
              <p>Institution: {institution ? institution.name : "Unknown"}</p>
              {course.requirements && (
                <ul className="requirements-list">
                  {Object.entries(course.requirements).map(([subj, grade]) => (
                    <li key={subj}>{subj}: {grade}</li>
                  ))}
                </ul>
              )}
              <button>Edit</button>
              <button>Delete</button>
            </div>
          );
        })}

        {/* Add New Course */}
        <div className="card add-course-card">
          <input
            type="text"
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
            placeholder="New Course Name"
          />

          <select
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
          >
            <option value="">Select Faculty</option>
            {faculties.map(f => {
              const inst = institutions.find(i => i.id === f.institutionId);
              return (
                <option key={f.id} value={f.id}>
                  {f.name} ({inst ? inst.name : "Unknown"})
                </option>
              );
            })}
          </select>

          {/* Subject requirements grid */}
          <div className="requirements-grid">
            {subjects.map(subj => (
              <div className="requirement-field" key={subj}>
                <label>{subj}</label>
                <select
                  value={requirements[subj]}
                  onChange={(e) => handleRequirementChange(subj, e.target.value)}
                >
                  {validGrades.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <button className="btn primary" onClick={addCourse}>Add Course</button>
        </div>
      </div>
    </div>
  );
};

export default Courses;
