import React from "react";
import "../glass.css";

const SUBJECTS = [
  { name: "Math", gradeBand: "8-10", progress: 62, syllabus: "CBSE" },
  { name: "Science", gradeBand: "8-10", progress: 48, syllabus: "CBSE" },
  { name: "English", gradeBand: "5-7", progress: 74, syllabus: "ICSE" },
  { name: "Social Studies", gradeBand: "1-4", progress: 33, syllabus: "State" },
];

const CHAPTERS = [
  { id: 1, title: "Real Numbers", lessons: 5, summary: "Irrational numbers, Euclid division lemma, number lines." },
  { id: 2, title: "Polynomials", lessons: 6, summary: "Zeros, factorization, remainder theorem, graphs." },
  { id: 3, title: "Quadratic Equations", lessons: 4, summary: "Forms, discriminant, roots, word problems." },
];

const GradeTag = ({ band }) => {
  const label = band === "8-10" ? "Teen" : band === "5-7" ? "Pre-Teen" : "Kids";
  return <span className="glass-grade">{label} • {band}</span>;
};

const ProgressBar = ({ value }) => (
  <div className="glass-progress-rail">
    <div className="glass-progress-fill" style={{ width: `${value}%` }} />
  </div>
);

const SubjectCard = ({ subject }) => (
  <article className="glass-card">
    <header>
      <GradeTag band={subject.gradeBand} />
      <span className="glass-chip">{subject.syllabus}</span>
    </header>
    <h3 style={{ margin: 0 }}>{subject.name}</h3>
    <p className="glass-subtext">Chapter-based roadmap, quizzes, flashcards, and AI tutor.</p>
    <ProgressBar value={subject.progress} />
    <div className="glass-footer">
      <button className="glass-btn primary">Start Learning</button>
      <button className="glass-btn ghost">AI Tutor</button>
    </div>
  </article>
);

const ChapterAccordion = ({ chapters }) => (
  <div className="glass-accordion">
    {chapters.map((ch, idx) => (
      <details key={ch.id} open={idx === 0}>
        <summary>
          <span>{ch.title}</span>
          <span className="glass-pill">{ch.lessons} lessons</span>
        </summary>
        <p className="glass-subtext" style={{ marginTop: 12 }}>{ch.summary}</p>
        <div className="glass-tab-row">
          <button className="glass-tab active">Learn</button>
          <button className="glass-tab">Quiz</button>
          <button className="glass-tab">AI Tutor</button>
        </div>
      </details>
    ))}
  </div>
);

export default function GlassDashboard({ onBack }) {
  return (
    <div className="glass-page">
      <div className="glass-topbar">
        <div>
          <p className="glass-breadcrumb">Home / Grade 9 / Science</p>
          <h1>Glassmorphic Learning Dashboard</h1>
        </div>
        <div className="glass-actions">
          <button className="glass-btn ghost back" onClick={onBack}>← Back</button>
          <button className="glass-btn primary">Resume</button>
        </div>
      </div>

      <div className="glass-grid">
        <section className="glass-subjects">
          {SUBJECTS.map((s) => (
            <SubjectCard key={s.name} subject={s} />
          ))}
        </section>

        <section className="glass-side">
          <h2 style={{ margin: 0 }}>Chapters</h2>
          <ChapterAccordion chapters={CHAPTERS} />
          <div className="glass-side-card glass-cta-block">
            <h3 style={{ margin: 0 }}>Flashcards</h3>
            <p className="glass-subtext">Stay fresh with spaced repetition at the chapter level.</p>
            <button className="glass-btn primary">Open Flashcards</button>
          </div>
        </section>
      </div>
    </div>
  );
}
