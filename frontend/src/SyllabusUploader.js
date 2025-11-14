import React, { useState, useContext } from "react";
import { SyllabusContext } from "./SyllabusContext";
import axios from "axios";

const SyllabusUploader = () => {
  const { loadSyllabus, syllabus } = useContext(SyllabusContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // 🧠 Simple local fallback extractor — detects "1. Chapter Name" style text
  const extractChaptersLocally = async (file) => {
    const text = await file.text();
    const lines = text.split(/\r?\n/);
    const chapters = [];
    const regex = /^\d+\.\s*(.+)$/;

    lines.forEach((line) => {
      const match = line.match(regex);
      if (match) {
        const title = match[1].trim();
        if (title.split(" ").length > 1) {
          chapters.push({
            id: String(chapters.length + 1),
            title,
            summary: `This chapter covers ${title} in detail.`,
          });
        }
      }
    });

    return chapters;
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("📁 Please select a syllabus file first!");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // ✅ Try backend extraction first
      const response = await axios.post("http://localhost:8000/syllabus/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      let chapters = response.data?.chapters || [];

      // ✅ If backend succeeded but gave too few chapters, fall back locally
      if (chapters.length < 3) {
        console.warn("⚠️ Backend returned too few chapters — using local fallback");
        const localChapters = await extractChaptersLocally(selectedFile);
        if (localChapters.length > chapters.length) {
          chapters = localChapters;
        }
      }

      // ✅ Filter valid chapters
      const filteredChapters = chapters.filter((ch) =>
        /^[A-Za-z0-9]/.test(ch.title)
      );
      

      loadSyllabus({ chapters: filteredChapters });
      alert(`✅ Syllabus loaded successfully with ${filteredChapters.length} chapters.`);
    } catch (err) {
      console.error("❌ Upload failed, trying local fallback:", err);

      // 🧩 Try local fallback if backend 500s
      try {
        const localChapters = await extractChaptersLocally(selectedFile);
        if (localChapters.length > 0) {
          loadSyllabus({ chapters: localChapters });
          alert(`✅ Syllabus extracted locally with ${localChapters.length} chapters.`);
        } else {
          alert("❌ Failed to extract syllabus. Please check the file format.");
        }
      } catch (fallbackErr) {
        console.error("❌ Local extraction also failed:", fallbackErr);
        alert("❌ Could not process syllabus file.");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="kid-card"
      style={{
        textAlign: "center",
        padding: "20px",
        marginTop: "20px",
        background: "linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1))",
      }}
    >
      <h4 style={{ color: "#667eea", marginBottom: "15px" }}>📘 Upload Your Syllabus</h4>

      {!syllabus?.chapters?.length ? (
        <>
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            style={{ marginBottom: "15px" }}
          />
          <button
            className="big-button"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "⏳ Uploading..." : "🚀 Upload Syllabus"}
          </button>
        </>
      ) : (
        <p style={{ color: "#555" }}>
          ✅ Syllabus loaded with {syllabus.chapters.length} chapters.
        </p>
      )}
    </div>
  );
};

export default SyllabusUploader;
