import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ Added Link
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
  const navigate = useNavigate();
  const auth = getAuth();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.academicRecords) {
      alert("All fields are required");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      const res = await fetch("https://careerplatform-o67g.onrender.com/students/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          name: formData.name,
          email: formData.email,
          academicRecords: formData.academicRecords,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setVerificationLink(data.emailVerificationLink);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Register error:", error);
      alert(error.message);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(verificationLink);
    alert("Verification link copied to clipboard!");
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Student Register</h2>
        <input type="text" name="name" placeholder="Full Name" required onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
        <input type="text" name="academicRecords" placeholder="Academic Records" required onChange={handleChange} />
        <button type="submit">Register</button>

        {/* ✅ Already have an account link */}
        <p style={{ marginTop: "10px", textAlign: "center" }}>
          Already have an account? <Link to="/student/login">Login</Link>
        </p>
      </form>

      {verificationLink && (
        <div className="verification-link-container">
          <p>Email Verification Link:</p>
          <input
            type="text"
            readOnly
            value={verificationLink}
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <button onClick={copyLink}>Copy Link</button>
        </div>
      )}
    </div>
  );
};

export default RegisterStudent;
