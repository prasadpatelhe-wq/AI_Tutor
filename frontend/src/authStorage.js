const STORAGE_KEY = 'ai_tutor_current_student_v1';

export const loadStoredStudent = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    if (!parsed.id) return null;
    return parsed;
  } catch (err) {
    console.warn('Failed to load stored student', err);
    return null;
  }
};

export const saveStoredStudent = (student) => {
  try {
    if (!student || typeof student !== 'object') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(student));
  } catch (err) {
    console.warn('Failed to save student', err);
  }
};

export const clearStoredStudent = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear student', err);
  }
};

