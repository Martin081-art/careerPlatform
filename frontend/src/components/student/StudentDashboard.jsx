import React from "react";
import { Link } from "react-router-dom";

const StudentDashboard = ({ student }) => {
  if (!student) return <p>Please login to view your dashboard.</p>;

  return (
    <div>
      <h2>Welcome, {student.name}</h2>
      <p>Email: {student.email}</p>
      <p>Status: {student.status}</p>
      <p>Admitted Institution: {student.admittedInstitution || "Not admitted yet"}</p>
      <p>Selected Course: {student.selectedCourse || "None"}</p>

      <h3>Actions</h3>
      <Link to="/apply-course">
        <button>Apply for Course</button>
      </Link>
      <Link to="/upload-document">
        <button>Upload Documents</button>
      </Link>
    </div>
  );
};

export default StudentDashboard;
