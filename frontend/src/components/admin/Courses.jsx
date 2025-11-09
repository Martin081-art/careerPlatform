import React, { useEffect, useState } from "react";
import "../../components/styles/AdminCourses.css"; // modern styles

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [facultyId, setFacultyId] = useState("");
  const [name, setName] = useState("");

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const res = await fetch("https://careerplatform-z4jj.onrender.com/admin/courses");
      const data = await res.json();
      console.log("Fetched courses:", data);
      if (data.success) setCourses(data.courses);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  // Fetch all faculties
  const fetchFaculties = async () => {
    try {
      const res = await fetch("https://careerplatform-z4jj.onrender.com/admin/faculties");
      const data = await res.json();
      console.log("Fetched faculties:", data);
      if (data.success) setFaculties(data.faculties);
    } catch (err) {
      console.error("Error fetching faculties:", err);
    }
  };

  // Fetch all institutions
  const fetchInstitutions = async () => {
    try {
      const res = await fetch("https://careerplatform-z4jj.onrender.com/admin/institutions");
      const data = await res.json();
      console.log("Fetched institutions:", data);
      if (data.success) setInstitutions(data.institutions);
    } catch (err) {
      console.error("Error fetching institutions:", err);
    }
  };

  // Add new course
  const addCourse = async () => {
    if (!name || !facultyId) {
      alert("Please fill all fields");
      return;
    }

    // Get the selected faculty and its institutionId
    const selectedFaculty = faculties.find(fac => fac.id === facultyId);
    const institutionId = selectedFaculty?.institutionId;

    console.log("Selected faculty:", selectedFaculty);
    console.log("Derived institutionId:", institutionId);

    if (!institutionId) {
      alert("Selected faculty has no associated institution");
      return;
    }

    try {
      const res = await fetch("https://careerplatform-z4jj.onrender.com/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, facultyId, institutionId }), // Send both IDs
      });

      const data = await res.json();
      console.log("Add course response:", data);

      if (data.success) {
        alert(`Course added successfully!\nSaved data:\n${JSON.stringify({ name, facultyId, institutionId }, null, 2)}`);
        fetchCourses(); // Refresh course list
        setName("");
        setFacultyId("");
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
      console.log("Delete course response:", data);
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
        <p className="muted">Create, view, and remove courses associated with faculties.</p>
      </header>

      <section className="surface">
        <div className="form-grid">
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Course Name"
          />

          {/* Dropdown for faculty selection with institution name */}
          <select
            className="input"
            value={facultyId}
            onChange={(e) => setFacultyId(e.target.value)}
          >
            <option value="">Select Faculty</option>
            {faculties.map((fac) => {
              const institution = institutions.find(inst => inst.id === fac.institutionId);
              return (
                <option key={fac.id} value={fac.id}>
                  {fac.name} ({institution ? institution.name : "Unknown"})
                </option>
              );
            })}
          </select>
        </div>

        <div className="actions">
          <button className="btn primary" onClick={addCourse}>Add Course</button>
        </div>
      </section>

      <section className="surface">
        <ul className="courses-list">
          {courses.map((course) => {
            const faculty = faculties.find(f => f.id === course.facultyId);
            const institution = institutions.find(i => i.id === course.institutionId);
            return (
              <li key={course.id} className="course-item">
                <div className="course-info">
                  <strong className="course-name">{course.name}</strong>
                  <span className="course-meta">
                    Faculty: {faculty ? faculty.name : "Unknown"} | 
                    Institution: {institution ? institution.name : "Unknown"}
                  </span>
                </div>
                <button className="btn danger" onClick={() => deleteCourse(course.id)}>Delete</button>
              </li>
            );
          })}
        </ul>
      </section>

      <footer className="page-footer">
        <div className="footer-content">
          <div className="footer-left">
            <strong>Career Guidance Admin</strong>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <nav className="footer-right" aria-label="Footer">
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <a href="/privacy">Privacy</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
