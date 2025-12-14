import axios from 'axios';

// API Configuration
export const API_BASE_URL = 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Normalizes backend error payloads (e.g., FastAPI/Pydantic) into a user-friendly string
const formatErrorDetail = (detail) => {
  if (!detail) return '';

  // String details can be returned as-is
  if (typeof detail === 'string') return detail;

  // Arrays may contain strings or objects with msg/loc
  if (Array.isArray(detail)) {
    return detail
      .map((item) => formatErrorDetail(item))
      .filter(Boolean)
      .join('; ');
  }

  // Objects from FastAPI validation errors usually have msg + loc
  if (typeof detail === 'object') {
    const msg = detail.msg || detail.message || detail.error;
    const loc = detail.loc
      ? Array.isArray(detail.loc)
        ? detail.loc.join('.')
        : detail.loc
      : '';

    if (msg && loc) return `${loc}: ${msg}`;
    if (msg) return msg;

    try {
      return JSON.stringify(detail);
    } catch (err) {
      console.error('Error stringifying detail', err);
      return '';
    }
  }

  // Fallback for numbers/booleans/etc.
  try {
    return String(detail);
  } catch {
    return '';
  }
};

const getErrorMessage = (error, fallback) => {
  const detail = error?.response?.data?.detail;
  const parsed = formatErrorDetail(detail);

  if (parsed) return parsed;
  if (error?.message) return error.message;
  return fallback || 'Something went wrong';
};

// API Functions
export const verifyParentPin = async (pin, setLoading, setGameState, setParentStatus) => {
  setLoading(prev => ({ ...prev, parent: true }));
  try {
    const response = await api.post('/verify_parent', { pin });
    if (response.data.success) {
      setGameState((prev) => ({ ...prev, parent_authenticated: true }));
      setParentStatus('✅ Parent access granted!');
    } else {
      setParentStatus('❌ Wrong PIN. Try again!');
    }
  } catch (error) {
    console.error('Parent verification error:', error);
    setParentStatus('❌ Error verifying PIN. Please try again.');
  } finally {
    setLoading(prev => ({ ...prev, parent: false }));
  }
};

export const logoutParent = async (setGameState) => {
  try {
    await api.post('/logout_parent');
    setGameState((prev) => ({ ...prev, parent_authenticated: false }));
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const getVideoForSubject = async (subject, setLoading, SAMPLE_VIDEOS) => {
  setLoading(prev => ({ ...prev, video: true }));
  try {
    const response = await api.get(`/get_video_for_subject?subject=${subject}`);
    return response.data;
  } catch (error) {
    console.error('Get video error:', error);
    return SAMPLE_VIDEOS[subject]?.[0] || { title: 'Sample Video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' };
  } finally {
    setLoading(prev => ({ ...prev, video: false }));
  }
};

export const simulateAttentionCheck = async (setGameState, setSocraticQuestion, setAttentionAlert) => {
  try {
    const response = await api.get('/simulate_attention_check');
    const { attention_level, needs_check, socratic_question } = response.data || {};

    setGameState((prev) => ({ ...prev, attention_score: attention_level || 100 }));

    if (needs_check && socratic_question) {
      setSocraticQuestion(socratic_question);
      setAttentionAlert(`🚨 Focus Check! 🚨\n\n${socratic_question}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Attention check error:', error);
    return false;
  }
};

export const completeVideoWatching = async (subject, addCoins, setGameState, setVideoCompletionMsg) => {
  try {
    const response = await api.post('/complete_video_watching', { subject });
    const { coins_earned } = response.data;

    addCoins(coins_earned, subject ? `Video - ${subject}` : 'Video Reward');
    setGameState((prev) => ({
      ...prev,
      videos_watched: prev.videos_watched + 1,
      daily_progress: { ...prev.daily_progress, videos: prev.daily_progress.videos + 1 },
    }));
    setVideoCompletionMsg(`🎉 Great job! You earned ${coins_earned} coins for watching the video! 🎉`);
  } catch (error) {
    console.error('Complete video error:', error);
    setVideoCompletionMsg('🎉 Great job! Video completed!');
  }
};

export const generateQuiz = async (selectedDbChapter, selectedDbSubchapter, dbSubchapters, userSubject, userGrade, setLoading, studentId) => {
  setLoading(prev => ({ ...prev, quiz: true }));

  try {
    if (!selectedDbChapter) {
      console.error("❌ No chapter selected!");
      return null;
    }

    // 1️⃣ Fetch chapter details
    const chapterResponse = await api.get(`/chapters/${selectedDbChapter}`);
    const chapter = chapterResponse.data;

    // Locate chosen subchapter (already fetched list)
    const subchapter = (dbSubchapters || []).find(sc => String(sc.id) === String(selectedDbSubchapter));

    // 2️⃣ Call backend
    const response = await api.post(`/generate_quiz?student_id=${studentId}`, {
      subject: userSubject,
      grade_band: userGrade,
      chapter_id: String(chapter.id),
      chapter_title: chapter.title || "",
      chapter_summary: chapter.summary || chapter.description || "",
      subchapter_id: subchapter ? String(subchapter.id) : undefined,
      subchapter_title: subchapter?.title || "",
      subchapter_summary: subchapter?.description || "",
      num_questions: 5,
      difficulty: "basic", // This might be ignored by backend if it generates all, but good to keep
    });

    console.log("🔥 Backend quiz response:", response.data);

    // 3️⃣ Return full response (contains basic, medium, hard)
    return response.data;

  } catch (error) {
    console.error("Generate quiz error:", error);
    return null;
  } finally {
    setLoading(prev => ({ ...prev, quiz: false }));
  }
};

export const calculateQuizScore = async (answers, questions, addCoins, setGameState, difficulty, chapterId, subjectId, studentId) => {
  try {
    const correctAnswers = questions.map(q => q.correct_option_index ?? q.correct ?? -1);
    const response = await api.post('/calculate_quiz_score', {
      answers,
      correct_answers: correctAnswers,
      difficulty: difficulty || 'basic',
      chapter_id: chapterId,
      subject_id: subjectId,
      student_id: studentId
    });

    const { score, percentage, coins_earned, message } = response.data;

    addCoins(coins_earned, 'Quiz Correct Answers');
    setGameState((prev) => ({
      ...prev,
      quizzes_completed: prev.quizzes_completed + 1,
      daily_progress: { ...prev.daily_progress, quizzes: prev.daily_progress.quizzes + 1 },
    }));

    return { score, percentage, coins: coins_earned, message };
  } catch (error) {
    console.error('Calculate quiz score error:', error);
    // Fallback calculation
    const correctAnswers = questions.map(q => q.correct_option_index ?? q.correct);
    const correct = answers.reduce((acc, a, i) => acc + (a === correctAnswers[i] ? 1 : 0), 0);
    const total = questions.length;
    const percentage = (correct / total) * 100;
    const coins = correct * 10;
    if (coins) {
      addCoins(coins, 'Quiz Correct Answers');
    }
    setGameState((prev) => ({
      ...prev,
      quizzes_completed: prev.quizzes_completed + 1,
      daily_progress: { ...prev.daily_progress, quizzes: prev.daily_progress.quizzes + 1 },
    }));
    return { score: `${correct}/${total}`, percentage, coins, message: correct > 0 ? `Great job! You earned ${coins} coins!` : 'Keep practicing!' };
  }
};

export const buyPerk = async (perkIndex, PERKS_SHOP, setLoading, setGameState, setPerkResult) => {
  setLoading(prev => ({ ...prev, perk: true }));
  try {
    const response = await api.post('/buy_perk', { perk_index: perkIndex });

    if (response.data.success) {
      const perk = PERKS_SHOP[perkIndex];
      setGameState((prev) => ({
        ...prev,
        coins: prev.coins - perk.cost,
        unlocked_perks: [...prev.unlocked_perks, perk.name]
      }));
      setPerkResult(`🎉 You bought ${perk.name}! Enjoy your new perk!`);
    } else {
      setPerkResult(response.data.message || '❌ Unable to purchase perk!');
    }
  } catch (error) {
    console.error('Buy perk error:', error);
    setPerkResult('❌ Error purchasing perk. Please try again.');
  } finally {
    setLoading(prev => ({ ...prev, perk: false }));
  }
};

export const getLeaderboard = async (gameState) => {
  try {
    const response = await api.get('/leaderboard');
    return response.data.leaderboard;
  } catch (error) {
    console.error('Leaderboard error:', error);
    return `
    🏆 Your Progress 🏆
    - 🪙 Total Coins Earned: ${gameState.total_coins_earned}
    - 🎯 Quizzes Completed: ${gameState.quizzes_completed}
    - 📺 Videos Watched: ${gameState.videos_watched}
      `;
  }
};

export const getParentDashboard = async (gameState) => {
  try {
    const response = await api.get('/parent_dashboard');
    return response.data.dashboard;
  } catch (error) {
    console.error('Parent dashboard error:', error);
    if (!gameState.parent_authenticated) return '🔒 Please log in as parent first!';
    return '👨‍👩‍👧‍👦 Parent Dashboard - Error loading data';
  }
};

export const generateLearningRoadmap = async (userGrade, userBoard, userSubject, setLoading, setLearningPlan) => {
  setLoading(prev => ({ ...prev, roadmap: true }));
  try {
    const response = await api.post('/generate_roadmap', {
      grade: userGrade,
      board: userBoard,
      subject: userSubject
    });

    setLearningPlan(response.data.roadmap);
  } catch (error) {
    console.error('Generate roadmap error:', error);
    setLearningPlan('❌ Unable to generate roadmap. Please ensure you have selected your grade, board, and subject, and that the backend is running.');
  } finally {
    setLoading(prev => ({ ...prev, roadmap: false }));
  }
};

export const chatWithTutor = async (...args) => {
  /**
   * Supports two call styles:
   * 1) New (returns response): chatWithTutor(message, subject, grade, studentId?)
   * 2) Legacy (stateful): chatWithTutor(message, chatHistory, userSubject, userGrade, setLoading, setChatHistory, setChatMessage)
   */
  const isLegacy =
    Array.isArray(args[1]) &&
    typeof args[4] === 'function' &&
    typeof args[5] === 'function' &&
    typeof args[6] === 'function';

  if (isLegacy) {
    const [message, chatHistory, userSubject, userGrade, setLoading, setChatHistory, setChatMessage] = args;
    if (!message?.trim()) return null;

    setLoading((prev) => ({ ...prev, chat: true }));

    const newChatHistory = [...chatHistory, { role: 'user', content: message }];
    setChatHistory(newChatHistory);
    setChatMessage('');

    try {
      const response = await api.post('/chat_with_tutor', {
        message,
        subject: userSubject || 'General',
        grade: userGrade || '10th',
      });

      const botResponse = response.data?.response || 'Sorry, I didn\'t get a response from the AI.';
      setChatHistory([...newChatHistory, { role: 'assistant', content: botResponse }]);
      return response.data;
    } catch (error) {
      console.error('Chat error:', error);
      let errorMessage = '❌ Sorry, I\'m having trouble connecting right now.';

      if (error.response?.status === 403) {
        errorMessage = '❌ API Authentication failed. Please check your EURIAI API key.';
      } else if (error.response?.status === 503) {
        errorMessage = '❌ AI Tutor service is currently unavailable. Please try again later.';
      } else if (!error.response) {
        errorMessage = '❌ Cannot connect to backend. Please make sure the backend is running.';
      }

      setChatHistory([...newChatHistory, { role: 'assistant', content: errorMessage }]);
      return { response: errorMessage };
    } finally {
      setLoading((prev) => ({ ...prev, chat: false }));
    }
  }

  const [message, subject, grade, studentId] = args;
  if (!message?.trim()) return { response: '' };

  try {
    const response = await api.post('/chat_with_tutor', {
      message,
      subject: subject || 'General',
      grade: grade || '10th',
      student_id: studentId,
    });
    return response.data;
  } catch (error) {
    console.error('Chat error:', error);

    let errorMessage = 'Sorry, I\'m having trouble connecting right now.';
    if (error.response?.status === 403) {
      errorMessage = 'API Authentication failed. Please check your EURIAI API key.';
    } else if (error.response?.status === 503) {
      errorMessage = 'AI Tutor service is currently unavailable. Please try again later.';
    } else if (!error.response) {
      errorMessage = 'Cannot connect to backend. Please make sure the backend is running.';
    }

    return { response: `❌ ${errorMessage}` };
  }
};

export const getStudentScore = async (studentId) => {
  try {
    const response = await api.get(`/student_score/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Get student score error:', error);
    return null;
  }
};

export const registerStudent = async (studentData) => {
  try {
    const { confirmPassword, ...payload } = studentData; // drop confirmPassword before sending
    const response = await api.post('/students/register', payload);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: getErrorMessage(error, 'Registration failed') };
  }
};

export const loginStudent = async (credentials) => {
  try {
    const response = await api.post('/students/login', credentials);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: getErrorMessage(error, 'Login failed') };
  }
};

export const requestOtp = async ({ channel, identifier, purpose }) => {
  try {
    const response = await api.post('/students/otp/request', { channel, identifier, purpose });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Request OTP error:', error);
    return { success: false, message: getErrorMessage(error, 'Failed to send OTP') };
  }
};

export const verifyOtp = async ({ channel, identifier, purpose, otp }) => {
  try {
    const response = await api.post('/students/otp/verify', { channel, identifier, purpose, otp });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Verify OTP error:', error);
    return { success: false, message: getErrorMessage(error, 'Invalid OTP') };
  }
};

export const loginStudentOtp = async ({ phone, otp }) => {
  try {
    const response = await api.post('/students/login_otp', { phone, otp });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('OTP login error:', error);
    return { success: false, message: getErrorMessage(error, 'OTP login failed') };
  }
};

export const registerStudentOtp = async (payload) => {
  try {
    const response = await api.post('/students/register_otp', payload);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('OTP registration error:', error);
    return { success: false, message: getErrorMessage(error, 'Registration failed') };
  }
};

export const requestPasswordReset = async ({ email }) => {
  try {
    const response = await api.post('/students/password_reset/request', { email });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Password reset request error:', error);
    return { success: false, message: getErrorMessage(error, 'Failed to request password reset') };
  }
};

export const confirmPasswordReset = async ({ email, otp, newPassword }) => {
  try {
    const response = await api.post('/students/password_reset/confirm', {
      email,
      otp,
      new_password: newPassword,
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Password reset confirm error:', error);
    return { success: false, message: getErrorMessage(error, 'Failed to reset password') };
  }
};

export const getStudent = async (studentId) => {
  try {
    const response = await api.get(`/students/${studentId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Get student error:', error);
    return { success: false, message: getErrorMessage(error, 'Failed to load student') };
  }
};
