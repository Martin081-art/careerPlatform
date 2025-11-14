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
  const [signupClicked, setSignupClicked] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSignupClicked(true);
    setMessage(""); // Clear previous messages
    setVerificationLink("");

    try {
      const res = await fetch(
        "https://careerplatform-z4jj.onrender.com/institute/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      console.log("Response status:", res.status);

      let data = {};
      try {
        data = await res.json();
        console.log("Response JSON:", data);
      } catch (jsonError) {
        console.error("Error parsing JSON response:", jsonError);
        setMessage("⚠️ Server returned invalid JSON.");
        return;
      }

      if (res.ok && data.success) {
        setVerificationLink(data.emailVerificationLink);
        setMessage(
          "✅ Institute registered successfully! Verify your email before login."
        );
      } else {
        setMessage(`❌ ${data.message || "Registration failed"}`);
        console.error("Server error details:", data);
      }
    } catch (error) {
      console.error("Network or unexpected error:", error);
      setMessage("⚠️ Unable to register institute. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (verificationLink) {
      navigator.clipboard.writeText(verificationLink);
      alert("Verification link copied to clipboard!");
    }
  };

  return (
    <div className="landing-container" style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h1 className="landing-title" style={{ textAlign: "center", marginBottom: "30px" }}>
        Register Institution
      </h1>

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

      {message && (
        <p style={{ marginTop: "15px", textAlign: "center", fontWeight: "500" }}>
          {message}
        </p>
      )}

      {verificationLink && (
        <div className="verify-section" style={{ marginTop: "20px", textAlign: "center" }}>
          <p>✅ Please verify your email before logging in.</p>
          <a
            href={verificationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="verify-link"
            style={{
              display: "inline-block",
              margin: "10px 0",
              padding: "8px 16px",
              backgroundColor: "#22c55e",
              color: "#fff",
              borderRadius: "6px",
              textDecoration: "none",
            }}
          >
            Verify Email
          </a>
          <p style={{ fontSize: "13px", color: "#666", marginTop: "10px" }}>
            Or copy this link:
            <br />
            <button
              onClick={copyLink}
              className="verify-link-button"
              style={{
                marginTop: "5px",
                padding: "5px 10px",
                fontSize: "12px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {verificationLink}
            </button>
          </p>
        </div>
      )}

      {signupClicked && (
        <div style={{ marginTop: "25px", textAlign: "center" }}>
          <p className="switch-text">
            Already have an account?{" "}
            <Link to="/institute/login" className="link">
              Login here
            </Link>
          </p>
          <Link
            to="/"
            className="back-btn"
            style={{
              display: "inline-block",
              marginTop: "10px",
              padding: "8px 16px",
              backgroundColor: "#111213",
              color: "#fff",
              borderRadius: "6px",
              textDecoration: "none",
            }}
          >
            Back to Home
          </Link>
        </div>
      )}
    </div>
  );
}

export default RegisterInstitute;
