import React, { useState } from "react";

const PostJob = ({ companyId }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    academicPerformance: "",
    certificates: "",
    workExperience: "",
    relevance: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!companyId) {
      console.error("PostJob Error: companyId is undefined!");
      setMessage("⚠️ Cannot post job: companyId is missing.");
      return;
    }

    setLoading(true);
    setMessage("");

    const jobData = {
      title: formData.title,
      description: formData.description,
      qualifications: {
        academicPerformance: Number(formData.academicPerformance),
        certificates: Number(formData.certificates),
        workExperience: Number(formData.workExperience),
        relevance: formData.relevance.split(",").map((s) => s.trim()),
      },
      companyId,
    };

    // Logging for debugging
    console.log("Posting job with data:", jobData);

    try {
      const res = await fetch("https://careerplatform-xu14.onrender.com/companies/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });

      const data = await res.json();

      console.log("Response from server:", data);

      if (data.success) {
        setMessage("✅ Job posted successfully!");
        setFormData({
          title: "",
          description: "",
          academicPerformance: "",
          certificates: "",
          workExperience: "",
          relevance: "",
        });
      } else {
        setMessage(`❌ ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Post job error:", error);
      setMessage(`⚠️ Error posting job: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-job-container" style={styles.container}>
      <h2 style={styles.heading}>Post a Job</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={formData.title}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <textarea
          name="description"
          placeholder="Job Description"
          value={formData.description}
          onChange={handleChange}
          required
          style={styles.textarea}
        />
        <input
          type="number"
          name="academicPerformance"
          placeholder="Minimum Academic Score (%)"
          value={formData.academicPerformance}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="number"
          name="certificates"
          placeholder="Minimum Extra Certificates"
          value={formData.certificates}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="number"
          name="workExperience"
          placeholder="Minimum Work Experience (years)"
          value={formData.workExperience}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="relevance"
          placeholder="Relevant Skills (comma separated)"
          value={formData.relevance}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

// -------------------- Inline Styling --------------------
const styles = {
  container: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    width: "450px",
    margin: "40px auto",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    color: "#0066cc",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  textarea: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    minHeight: "80px",
    fontSize: "16px",
  },
  button: {
    backgroundColor: "#0066cc",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },
  message: {
    textAlign: "center",
    marginTop: "15px",
    color: "#333",
  },
};

export default PostJob;
