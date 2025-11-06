import React, { useState } from "react";
import "../../components/styles/PanelStyles.css";
import "../../components/styles/StudentUpload.css"; // add modern page styles

const UploadDocuments = ({ user }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
    console.log("Files selected:", e.target.files);
  };

  const handleUpload = async () => {
    if (!user?.uid) {
      alert("No user ID available. Please log in first.");
      console.error("Upload attempt without user UID");
      return;
    }

    if (files.length === 0) {
      alert("Please select at least one file to upload.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Convert files to names for demo purposes (replace with URLs/base64 in production)
      const documentList = files.map((file) => file.name);
      console.log("Uploading documents:", documentList);

      const res = await fetch(`http://localhost:5000/students/${user.uid}/documents`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documents: documentList }),
      });

      const data = await res.json();
      console.log("Upload response:", data);

      if (data.success) {
        setMessage("✅ " + data.message);
        setFiles([]);
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("⚠️ Error uploading documents.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-page">
      <header className="page-header">
        <h2>Upload Documents</h2>
        <p className="muted">Attach your certificates and transcripts.</p>
      </header>

      <section className="surface">
        <div className="form-grid">
          <label className="label" htmlFor="docs">Select documents</label>
          <input id="docs" className="input file-input" type="file" multiple onChange={handleFileChange} />
          <div className="actions">
            <button className="btn primary" onClick={handleUpload} disabled={loading}>
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {message && <p className="status-message">{message}</p>}
        </div>

        {files.length > 0 && (
          <div className="selected-files">
            <h4>Selected Files</h4>
            <ul>
              {files.map((f, idx) => (
                <li key={idx}>{f.name}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <footer className="page-footer">
        <div className="footer-content">
          <div className="footer-left">
            <strong>Career Guidance</strong>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <nav className="footer-right" aria-label="Footer">
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <a href="/privacy">Privacy</a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default UploadDocuments;
