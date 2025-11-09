import React, { useState } from "react";
import { Link } from "react-router-dom";


function RegisterInstitute() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });
  const [verificationLink, setVerificationLink] = useState(""); 
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        "https://careerplatform-z4jj.onrender.com/institute/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (data.success) {
        setVerificationLink(data.emailVerificationLink);
        setMessage("✅ Institute registered successfully! Verify your email before login.");
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("⚠️ Unable to register institute.");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(verificationLink);
    alert("Verification link copied to clipboard!");
  };

  return (
    <div className="landing-container">
      <h1 className="landing-title">Register Institution</h1>

      <form className="form-container" onSubmit={handleRegister}>
        <input
          type="text"
          name="name"
          placeholder="Institution Name"
          required
          value={formData.name}
          onChange={handleChange}
          className="input-field"
        />
        <input
          type="email"
          name="email"
          placeholder="Institution Email"
          required
          value={formData.email}
          onChange={handleChange}
          className="input-field"
        />
        <input
          type="text"
          name="address"
          placeholder="Institution Address"
          required
          value={formData.address}
          onChange={handleChange}
          className="input-field"
        />
        <input
          type="password"
          name="password"
          placeholder="Set Password"
          required
          value={formData.password}
          onChange={handleChange}
          className="input-field"
        />

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Registering..." : "Sign Up"}
        </button>
      </form>

      {message && <p style={{ marginTop: "10px" }}>{message}</p>}

      {verificationLink && (
        <div className="verify-section" style={{ marginTop: "20px" }}>
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
            Or copy this link:
            <br />
            <button
              onClick={copyLink}
              className="verify-link-button"
            >
              {verificationLink}
            </button>
          </p>
        </div>
      )}

      <p className="switch-text">
        Already have an account? <Link to="/institute/login" className="link">Login here</Link>
      </p>

      <Link to="/" className="back-btn">Back to Home</Link>
    </div>
  );
}

export default RegisterInstitute;
