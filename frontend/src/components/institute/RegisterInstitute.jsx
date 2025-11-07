import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../components/styles/LandingPage.css";

const RegisterInstitute = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationLink, setVerificationLink] = useState(""); // New state
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://careerplatform-o67g.onrender.com/institute/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, address }),
      });

      const data = await response.json();

      if (data.success) {
        // Store the link in state to display in the UI
        setVerificationLink(data.emailVerificationLink);

        // Optionally navigate after showing link
        // navigate("/institute/login");
      } else {
        alert("❌ " + data.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("⚠️ Unable to register institute.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-container">
      <h1 className="landing-title">🏫 Register Institution</h1>

      <form className="form-container" onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Institution Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="email"
          placeholder="Institution Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="text"
          placeholder="Institution Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="password"
          placeholder="Set Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-field"
        />

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Registering..." : "Sign Up"}
        </button>
      </form>

      {verificationLink && (
        <div style={{ marginTop: "20px", wordBreak: "break-all" }}>
          <p>✅ Registration successful! Click or copy your verification link:</p>
          <a href={verificationLink} target="_blank" rel="noopener noreferrer">
            {verificationLink}
          </a>
        </div>
      )}

      <p className="switch-text">
        Already have an account?{" "}
        <Link to="/institute/login" className="link">
          Login here
        </Link>
      </p>

      <Link to="/" className="back-btn">⬅ Back to Home</Link>
    </div>
  );
};

export default RegisterInstitute;
