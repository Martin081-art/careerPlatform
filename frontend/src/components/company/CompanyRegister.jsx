import React, { useState } from "react";
import "../../components/styles/AuthForms.css";

const CompanyRegister = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [verificationLink, setVerificationLink] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://careerplatform-z4jj.onrender.com/companies/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (data.success) {
        // Show verification message and link
        setMessage(data.message);
        setVerificationLink(data.verificationLink);

        // DO NOT set user or navigate until email is verified
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Register error:", error);
      setMessage("Registration failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Company Registration</h2>

        <input
          type="text"
          name="name"
          placeholder="Company Name"
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

        <button type="submit">Register</button>

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

export default CompanyRegister;
