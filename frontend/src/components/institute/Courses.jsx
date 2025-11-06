import React, { useState, useEffect } from "react";
import "../../components/styles/Panel.css";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState("");

  useEffect(() => {
    // fetch courses from backend
  }, []);

  const addCourse = () => {
    if (!newCourse) return;
    // call API to add course
    setNewCourse("");
  };

  return (
    <div className="dashboard-main">
      <h1>Courses</h1>
      <div className="card-grid">
        {courses.map(course => (
          <div className="card" key={course.id}>
            <h3>{course.name}</h3>
            <button>Edit</button>
            <button>Delete</button>
          </div>
        ))}
        <div className="card">
          <input 
            type="text" 
            value={newCourse} 
            onChange={e => setNewCourse(e.target.value)} 
            placeholder="New Course Name" 
          />
          <button onClick={addCourse}>Add Course</button>
        </div>
      </div>
    </div>
  );
};

export default Courses;
