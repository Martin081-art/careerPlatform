import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import "../../components/styles/AuthForms.css";

const RegisterStudent = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    academicRecords: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const auth = getAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset message
    setMessage("");

    if (!formData.name || !formData.email || !formData.password || !formData.academicRecords) {
      setMessage("⚠️ All fields are required");
      return;
    }

    try {
      setLoading(true); // Start loading

      // 1️⃣ Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // 2️⃣ Send email verification
      await sendEmailVerification(user);

      // 3️⃣ Register student in backend Firestore
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
        setMessage("✅ Student registered successfully! Please check your email to verify your account.");
        // Optional: redirect to login after 5 seconds
        setTimeout(() => navigate("/student/login"), 5000);
      } else {
        setMessage(`⚠️ ${data.message || "Registration failed."}`);
      }
    } catch (error) {
      console.error("Register error:", error);
      // Better error feedback
      if (error.code === "auth/email-already-in-use") {
        setMessage("⚠️ This email is already registered.");
      } else if (error.code === "auth/invalid-email") {
        setMessage("⚠️ Invalid email address.");
      } else if (error.code === "auth/weak-password") {
        setMessage("⚠️ Password must be at least 6 characters.");
      } else {
        setMessage(error.message || "⚠️ Registration failed. Please try again.");
      }
    } finally {
      setLoading(false); // Stop loading
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
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="academicRecords"
          placeholder="Academic Records"
          value={formData.academicRecords}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p style={{ marginTop: "10px", textAlign: "center" }}>
          Already have an account? <Link to="/student/login">Login</Link>
        </p>

        {message && <p style={{ marginTop: "10px", color: message.startsWith("✅") ? "green" : "red" }}>{message}</p>}
      </form>
    </div>
  );
};

export default RegisterStudent;
