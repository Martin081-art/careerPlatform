import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../../firebase/config"; // initialized Firebase auth
import { signInWithEmailAndPassword } from "firebase/auth";
import "../../components/styles/AuthForms.css";

const LoginStudent = ({ setUser }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Firebase sign-in
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        alert("Your email is not verified. Please check your inbox.");
        return;
      }

      // Get Firebase ID token
      const token = await user.getIdToken();

      // Verify token with backend
      const res = await fetch("http://localhost:5000/students/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      console.log("Backend verify response:", data);

      if (data.success) {
        // Store student data including UID
        setUser({
          role: "student",
          uid: data.student.uid,
          name: data.student.name,
          email: data.student.email,
          academicRecords: data.student.academicRecords,
          phone: data.student.phone,
          qualification: data.student.qualification,
          admittedInstitution: data.student.admittedInstitution,
          selectedCourse: data.student.selectedCourse,
          status: data.student.status,
          documents: data.student.documents,
          coursesApplied: data.student.coursesApplied,
        });

        // ✅ Navigate to student dashboard after login
        navigate("/dashboard/student");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Student Login</h2>
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
        <button type="submit">Login</button>
        <p style={{ marginTop: "10px", textAlign: "center" }}>
          Don't have an account? <Link to="/student/register">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginStudent;
