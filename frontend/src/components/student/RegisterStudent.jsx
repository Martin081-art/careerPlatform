import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import "../../components/styles/AuthForms.css";

const RegisterStudent = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    academicRecords: "",
  });
  const [verificationLink, setVerificationLink] = useState("");
  const [message, setMessage] = useState("");
  const auth = getAuth();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.academicRecords
    ) {
      alert("All fields are required");
      return;
    }

    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Register student in backend
      const res = await fetch(
        "https://careerplatform-z4jj.onrender.com/students/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: user.uid,
            name: formData.name,
            email: formData.email,
            academicRecords: formData.academicRecords,
          }),
        }
      );

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

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          required
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
        />
        <input
          type="text"
          name="academicRecords"
          placeholder="Academic Records"
          required
          onChange={handleChange}
        />

        <button type="submit">Register</button>

        <p style={{ marginTop: "10px", textAlign: "center" }}>
          Already have an account? <Link to="/student/login">Login</Link>
        </p>

        {message && <p style={{ marginTop: "10px" }}>{message}</p>}

        {verificationLink && (
          <div className="verify-section">
            <p>✅ Please verify your email before logging in.</p>
            <p>Click below to verify your email:</p>
            <a
              href={verificationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="verify-link"
            >
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
