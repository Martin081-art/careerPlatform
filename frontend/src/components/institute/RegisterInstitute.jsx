import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../components/styles/LandingPage.css";

const RegisterInstitute = () => {
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
        setMessage("Institute registered successfully! ✅ Verify your email before login.");
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
      <h1 className="landing-title">🏫 Register Institution</h1>

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

      {verificationLink && (
        <div className="verification-link-container" style={{ marginTop: "20px" }}>
          <p>{message}</p>
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

      <p className="switch-text">
        Already have an account? <Link to="/institute/login">Login here</Link>
      </p>

      <Link to="/" className="back-btn">⬅ Back to Home</Link>
    </div>
  );
};

export default RegisterInstitute;
