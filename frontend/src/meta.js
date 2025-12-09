import axios from "axios";

const API = "http://localhost:8000/meta";

export const fetchGrades = () => axios.get(`${API}/grades`);
export const fetchBoards = () => axios.get(`${API}/boards`);
export const fetchSubjects = () => axios.get(`${API}/subjects`);
export const fetchLanguages = () => axios.get(`${API}/languages`);
