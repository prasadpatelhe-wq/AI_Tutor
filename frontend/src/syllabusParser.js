// src/syllabusParser.js
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import mammoth from "mammoth";

// Regex pattern to detect numbered chapter titles like "1. Real Numbers"
const chapterRegex = /\b(\d+)\.\s*([A-Z][A-Za-z\s]+)|Chapter\s+(\d+)\s*[:\-]?\s*(.*)/g;

export async function extractTextFromFile(file) {
  const ext = file.name.split(".").pop().toLowerCase();

  if (ext === "docx") {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  if (ext === "pdf") {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    for (let i = 0; i < pdf.numPages; i++) {
      const page = await pdf.getPage(i + 1);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(" ") + "\n";
    }
    return text;
  }

  throw new Error("Unsupported file type. Please upload a DOCX or PDF.");
}

export function parseChaptersFromText(text) {
  const chapters = [];
  let match;
  const lines = text.split("\n");

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    while ((match = chapterRegex.exec(line))) {
      const number = match[1] || match[3];
      const title = match[2] || match[4];
      if (title) {
        chapters.push({
          id: number || chapters.length + 1,
          title: title.trim(),
          summary: `Overview of ${title.trim()}`,
        });
      }
    }
  }

  // fallback in case regex misses
  if (chapters.length === 0) {
    const firstLines = lines.filter((l) => l.length < 80);
    firstLines.forEach((t, i) => {
      chapters.push({ id: i + 1, title: t, summary: `Overview of ${t}` });
    });
  }

  return chapters;
}
