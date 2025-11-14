import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import "../../components/styles/AuthForms.css";

const RegisterStudent = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    academicRecords: {
      maths: "",
      accounting: "",
      sesotho: "",
      science: "",
      biology: "",
      english: "",
    },
  });

  const [verificationLink, setVerificationLink] = useState("");
  const [message, setMessage] = useState("");
  const auth = getAuth();

  const grades = ["A", "B", "C", "D", "E"];

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if the field is a subject in academicRecords
    if (formData.academicRecords.hasOwnProperty(name)) {
      setFormData({
        ...formData,
        academicRecords: {
          ...formData.academicRecords,
          [name]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for missing fields
    const { name, email, password, academicRecords } = formData;
    if (!name || !email || !password || Object.values(academicRecords).some((g) => !g)) {
      alert("All fields including academic records are required");
      return;
    }

    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Register student in backend
      const res = await fetch("https://careerplatform-z4jj.onrender.com/students/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          name,
          email,
          academicRecords,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("✅ Student registered successfully!");
        setVerificationLink(data.emailVerificationLink);
      } else {
        setMessage(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Register error:", error);
      setMessage("Registration failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Student Registration</h2>

        <input type="text" name="name" placeholder="Full Name" required onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" required onChange={handleChange} />

        <h3>Academic Records (Grades A-E)</h3>
        {Object.keys(formData.academicRecords).map((subject) => (
          <div key={subject} style={{ marginBottom: "10px" }}>
            <label style={{ marginRight: "10px", textTransform: "capitalize" }}>{subject}:</label>
            <select name={subject} value={formData.academicRecords[subject]} onChange={handleChange} required>
              <option value="">Select grade</option>
              {grades.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        ))}

        <button type="submit">Register</button>

        <p style={{ marginTop: "10px", textAlign: "center" }}>
          Already have an account? <Link to="/student/login">Login</Link>
        </p>

        {message && <p style={{ marginTop: "10px" }}>{message}</p>}

        {verificationLink && (
          <div className="verify-section">
            <p>✅ Please verify your email before logging in.</p>
            <p>Click below to verify your email:</p>
            <a href={verificationLink} target="_blank" rel="noopener noreferrer" className="verify-link">
              Verify Email
            </a>
            <p style={{ fontSize: "13px", color: "#666" }}>
              Or copy this link: <br />
              <code>{verificationLink}</code>
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default RegisterStudent;
