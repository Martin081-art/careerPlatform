import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../components/styles/AuthForms.css";

const InstituteLogin = ({ setUser }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📌 Submitting login form:", formData);

    try {
      const res = await fetch(
        "https://careerplatform-z4jj.onrender.com/institute/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      console.log("🔹 Raw response:", res);

      const data = await res.json();
      console.log("🧾 Response JSON:", data);

      if (data.success) {
        // Construct user object
        const userObj = {
          role: "institute",
          name: data.institute.name,
          institutionId: data.institute.id,
        };

        // Store in localStorage
        localStorage.setItem("user", JSON.stringify(userObj));
        console.log("✅ User stored in localStorage:", userObj);

        // Update state
        setUser(userObj);
        console.log("✅ User state updated:", userObj);

        // Navigate to dashboard
        navigate("/dashboard/institute");
      } else {
        console.warn("⚠️ Login failed:", data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error("❌ Login error:", error);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Institute Login</h2>
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

        {/* Link to Register page */}
        <p style={{ marginTop: "10px", textAlign: "center" }}>
          Don't have an account? <Link to="/institute/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default InstituteLogin;
