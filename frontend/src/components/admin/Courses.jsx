import React, { useEffect, useState } from "react";
import "../../components/styles/AdminCourses.css"; // add modern styles

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [facultyId, setFacultyId] = useState("");
  const [name, setName] = useState("");

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/courses");
      const data = await res.json();
      if (data.success) setCourses(data.courses);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  // Fetch all faculties for dropdown
  const fetchFaculties = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/faculties");
      const data = await res.json();
      if (data.success) setFaculties(data.faculties);
    } catch (err) {
      console.error("Error fetching faculties:", err);
    }
  };

  // Add new course
  const addCourse = async () => {
    if (!name || !facultyId) {
      alert("Please fill all fields");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, facultyId }),
      });
      const data = await res.json();
      if (data.success) {
        fetchCourses();
        setName("");
        setFacultyId("");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error adding course:", err);
    }
  };

  // Delete course
  const deleteCourse = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/admin/courses/${id}`, {
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

          {/* Dropdown for faculty selection */}
          <select
            className="input"
            value={facultyId}
            onChange={(e) => setFacultyId(e.target.value)}
          >
            <option value="">Select Faculty</option>
            {faculties.map((fac) => (
              <option key={fac.id} value={fac.id}>
                {fac.name}
              </option>
            ))}
          </select>
        </div>

        <div className="actions">
          <button className="btn primary" onClick={addCourse}>Add Course</button>
        </div>
      </section>

      <section className="surface">
        <ul className="courses-list">
          {courses.map((course) => (
            <li key={course.id} className="course-item">
              <div className="course-info">
                <strong className="course-name">{course.name}</strong>
                <span className="course-meta">Faculty: {course.facultyId}</span>
              </div>
              <button className="btn danger" onClick={() => deleteCourse(course.id)}>Delete</button>
            </li>
          ))}
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
