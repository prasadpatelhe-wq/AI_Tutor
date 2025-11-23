import React, { useContext, useEffect, useState } from "react";
import FlashcardView from "./FlashcardView";
import { SyllabusContext } from "./SyllabusContext";
import { fetchGrades, fetchBoards, fetchSubjects } from "./meta";

// Import modular components
import WelcomeView from "./views/WelcomeView";
import SelectionView from "./views/SelectionView";
import ChapterSelectionView from "./views/ChapterSelectionView";
import DashboardView from "./views/DashboardView";
import VideoView from "./views/VideoView";
import QuizView from "./views/QuizView";
import RewardsView from "./views/RewardsView";
import ChatView from "./views/ChatView";
import ParentView from "./views/ParentView";

// Import styles and API functions
import { styles } from "./styles";
import {
  verifyParentPin as apiVerifyParentPin,
  logoutParent as apiLogoutParent,
  getVideoForSubject as apiGetVideoForSubject,
  simulateAttentionCheck as apiSimulateAttentionCheck,
  completeVideoWatching as apiCompleteVideoWatching,
  generateQuiz as apiGenerateQuiz,
  calculateQuizScore as apiCalculateQuizScore,
  buyPerk as apiBuyPerk,
  generateLearningRoadmap as apiGenerateLearningRoadmap,
  chatWithTutor as apiChatWithTutor,
  getStudentScore as apiGetStudentScore,
} from "./api";

const App = () => {
  // Game State
  const [gameState, setGameState] = useState({
    coins: 100,
    total_score: 0, // Added total_score
    total_coins_earned: 100,
    coin_board: [],
    streak_days: 0,
    quizzes_completed: 0,
    videos_watched: 0,
    current_level: 1,
    unlocked_perks: [],
    daily_progress: { videos: 0, quizzes: 0, study_time: 0 },
    attention_score: 100,
    parent_authenticated: false,
  });

  // App States
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [currentVideo, setCurrentVideo] = useState({});
  const [userGrade, setUserGrade] = useState('');
  const [userBoard, setUserBoard] = useState('');
  const [userSubject, setUserSubject] = useState('');
  const [userSubjectId, setUserSubjectId] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatMessage, setChatMessage] = useState('');
  const [learningPlan, setLearningPlan] = useState('Click to generate your plan!');
  const [attentionAlert, setAttentionAlert] = useState('');
  const [socraticQuestion, setSocraticQuestion] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoPlayerHtml, setVideoPlayerHtml] = useState('');
  const [quizIntro, setQuizIntro] = useState('');
  const [quizContainerVisible, setQuizContainerVisible] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [answerOptions, setAnswerOptions] = useState(['', '', '', '']);
  const [quizProgress, setQuizProgress] = useState('');
  const [quizResults, setQuizResults] = useState(null);
  const [perkResult, setPerkResult] = useState('');
  const [parentPin, setParentPin] = useState('');
  const [parentStatus, setParentStatus] = useState('');
  const [selectionStatus, setSelectionStatus] = useState('');
  const [videoCompletionMsg, setVideoCompletionMsg] = useState('');
  const [attentionStatus, setAttentionStatus] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [flashcards, setFlashcards] = useState([]);
  const [loadingFlashcards, setLoadingFlashcards] = useState(false);
  const [grades, setGrades] = useState([]);
  const [boards, setBoards] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const {
    syllabus,
    currentChapter,
    nextChapter,
    loadSyllabus,
    fetchChaptersFromDB,
    dbChapters,
    selectedDbChapter,
    setSelectedDbChapter
  } = useContext(SyllabusContext);

  // Front page subject, grade, board loader
  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [g, b, s] = await Promise.all([
          fetchGrades(),
          fetchBoards(),
          fetchSubjects(),
        ]);

        setGrades(g.data);
        setBoards(b.data);
        setSubjects(s.data);
      } catch (err) {
        console.error("Failed loading dropdowns:", err);
      }
    };

    loadDropdowns();
    getStudentScore(); // Fetch initial score
  }, []);

  useEffect(() => {
    if (!quizContainerVisible || !Array.isArray(quizQuestions) || quizQuestions.length === 0) {
      setCurrentQuestion('');
      setAnswerOptions([]);
      return;
    }

    const safeIndex = Math.min(currentQuestionIndex, quizQuestions.length - 1);
    const activeQuestion = quizQuestions[safeIndex] || {};
    const questionNumber = safeIndex + 1;
    const questionText = activeQuestion.question_text || activeQuestion.question || '';

    let options = Array.isArray(activeQuestion.options) ? activeQuestion.options : [];
    const questionType = (activeQuestion.type || activeQuestion.question_type || '').toString().toLowerCase();
    if (questionType === 'true_false' || questionType === 'true/false') {
      const normalized = options
        .map((opt) => (typeof opt === 'string' ? opt.trim() : opt))
        .filter((opt) => opt !== undefined && opt !== null && opt !== '');
      options = normalized.slice(0, 2);

      if (options.length < 2) {
        options = ['True', 'False'];
      }
    }

    setCurrentQuestion(`Question ${questionNumber}: ${questionText}`);
    setAnswerOptions(options);
  }, [quizContainerVisible, quizQuestions, currentQuestionIndex]);

  // Loading States
  const [loading, setLoading] = useState({
    roadmap: false,
    chat: false,
    quiz: false,
    video: false,
    parent: false,
    perk: false,
  });



  // Sample Data
  const SAMPLE_VIDEOS = {
    Math: [
      { title: 'Fun with Fractions! 🥧', duration: '15:30', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    ],
  };

  const PERKS_SHOP = [
    { name: 'Golden Star Badge ⭐', cost: 50, description: 'Show everyone you\'re a star student!' },
  ];

  // Helper Functions
  const addCoins = (amount, source = 'Reward') => {
    if (!amount) return;
    setGameState((prev) => {
      const updatedCoins = prev.coins + amount;
      const updatedTotal = prev.total_coins_earned + amount;
      const updatedBoard = [
        ...(prev.coin_board || []),
        {
          id: `${Date.now()}-${(prev.coin_board || []).length}`,
          source,
          amount,
          total: updatedTotal,
          timestamp: new Date().toISOString(),
        },
      ];
      return {
        ...prev,
        coins: updatedCoins,
        total_coins_earned: updatedTotal,
        coin_board: updatedBoard,
      };
    });
  };



  const getCoinDisplay = () => `🏆 Score: ${gameState.total_score || 0}`;

  // API Wrapper Functions
  const verifyParentPin = async (pin) => {
    await apiVerifyParentPin(pin, setLoading, setGameState, setParentStatus);
  };

  const logoutParent = async () => {
    await apiLogoutParent(setGameState);
  };

  const getVideoForSubject = async (subject) => {
    return await apiGetVideoForSubject(subject, setLoading, SAMPLE_VIDEOS);
  };

  const simulateAttentionCheck = async () => {
    return await apiSimulateAttentionCheck(setGameState, setSocraticQuestion, setAttentionAlert);
  };

  const completeVideoWatching = async (subject) => {
    await apiCompleteVideoWatching(subject, addCoins, setGameState, setVideoCompletionMsg);
  };

  const generateQuiz = async () => {
    return await apiGenerateQuiz(selectedDbChapter, userSubject, userGrade, setLoading);
  };

  const calculateQuizScore = async (answers, questions, passedAddCoins, passedSetGameState, difficulty, chapterId, subjectId) => {
    const result = await apiCalculateQuizScore(
      answers,
      questions,
      addCoins,
      setGameState,
      difficulty,
      chapterId,
      subjectId,
      1 // Hardcoded studentId
    );
    // Refresh score after quiz
    getStudentScore();
    return result;
  };

  const buyPerk = async (perkIndex) => {
    await apiBuyPerk(perkIndex, PERKS_SHOP, setLoading, setGameState, setPerkResult);
  };

  const generateLearningRoadmap = async () => {
    await apiGenerateLearningRoadmap(userGrade, userBoard, userSubject, setLoading, setLearningPlan);
  };

  const chatWithTutor = async (message) => {
    await apiChatWithTutor(message, chatHistory, userSubject, userGrade, setLoading, setChatHistory, setChatMessage);
  };

  const getStudentScore = async () => {
    const scoreData = await apiGetStudentScore(1); // Hardcoded student ID 1 for now
    if (scoreData) {
      setGameState(prev => ({ ...prev, total_score: scoreData.total_score }));
    }
  };

  // Event Handlers
  const switchToSelection = () => setCurrentScreen('selection');

  const handleParentLogin = async () => {
    await verifyParentPin(parentPin);
  };

  const handleSubjectChange = (event) => {
    const subjectId = event.target.value || null;
    setUserSubjectId(subjectId);

    const selected = subjects.find(
      (subject) => String(subject.id) === String(subjectId)
    );
    setUserSubject(selected?.name || "");
  };

  const setupLearning = async () => {
    if (!userGrade || !userBoard || !userSubjectId || !userSubject) {
      setSelectionStatus("❌ Please select all options!");
      return;
    }

    try {
      await fetchChaptersFromDB(userSubjectId);
      setCurrentScreen("selectChapter");
    } catch (error) {
      console.error("Setup error:", error);
      setSelectionStatus("❌ Something went wrong while setting up learning.");
    }
  };

  const loadVideoForSubject = async () => {
    const video = await getVideoForSubject(userSubject);
    setVideoTitle(`Now Playing: ${video.title}`);
    setVideoPlayerHtml(`<iframe width="100%" height="100%" src="${video.url}" frameborder="0" allowfullscreen></iframe>`);
    setCurrentVideo(video);
  };

  const checkAttention = async () => {
    const needsCheck = await simulateAttentionCheck();
    if (needsCheck) {
      setAttentionStatus('⚠️ Pay attention!');
    } else {
      setAttentionStatus('✅ Excellent focus!');
      setAttentionAlert('');
      setSocraticQuestion('');
    }
  };

  const handleSocraticAnswer = (answer) => {
    if (answer) {
      setAttentionAlert('');
      setSocraticQuestion('');
      setAttentionStatus('👏 Great answer!');
    }
  };

  const startQuizSession = async () => {
    const data = await generateQuiz();
    // If data is the full object {basic: ..., medium: ...}, we can just store it or store basic.
    // Since QuizView handles it, we just return it.
    // But to keep App.js state consistent if used elsewhere, let's store basic questions if available.
    const basicQuestions = data?.basic || [];
    setQuizQuestions(basicQuestions);
    setQuizAnswers(new Array(basicQuestions.length).fill(-1));
    setQuizContainerVisible(true);
    setCurrentQuestionIndex(0);
    setQuizProgress(`Progress: 0/${basicQuestions.length}`);
    return data;
  };

  const handleQuizAnswer = (answerIndex) => {
    const newAnswers = [...quizAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setQuizAnswers(newAnswers);

    // No longer auto-advancing. User must click "Next"
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setQuizProgress(`Progress: ${nextIndex + 1}/${quizQuestions.length}`);
    }
  };

  const submitQuizFinal = async () => {
    const result = await calculateQuizScore(quizAnswers, quizQuestions);
    setQuizResults(result);
    setQuizContainerVisible(false);
  };

  // Render
  return (
    <div className="container fade-in">
      <style>{styles}</style>

      {currentScreen === 'welcome' && (
        <WelcomeView
          switchToSelection={switchToSelection}
          parentPin={parentPin}
          setParentPin={setParentPin}
          handleParentLogin={handleParentLogin}
          loading={loading}
          parentStatus={parentStatus}
        />
      )}

      {currentScreen === 'selection' && (
        <SelectionView
          userGrade={userGrade}
          setUserGrade={setUserGrade}
          userBoard={userBoard}
          setUserBoard={setUserBoard}
          userSubjectId={userSubjectId}
          handleSubjectChange={handleSubjectChange}
          grades={grades}
          boards={boards}
          subjects={subjects}
          setupLearning={setupLearning}
          selectionStatus={selectionStatus}
        />
      )}

      {currentScreen === "selectChapter" && (
        <ChapterSelectionView
          selectedDbChapter={selectedDbChapter}
          setSelectedDbChapter={setSelectedDbChapter}
          dbChapters={dbChapters}
          setCurrentScreen={setCurrentScreen}
        />
      )}

      {currentScreen === 'main' && (
        <div>
          <div className="header-section">
            <div className="coin-display">{getCoinDisplay()}</div>
            <button className="warning-button" onClick={() => setCurrentScreen('welcome')}>
              🏠 Back to Home
            </button>
          </div>
          <div className="tab-container">
            <button className={`tab-nav ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
              🏠 Dashboard
            </button>
            <button className={`tab-nav ${activeTab === 'video' ? 'active' : ''}`} onClick={() => setActiveTab('video')}>
              📺 Watch & Learn
            </button>
            <button className={`tab-nav ${activeTab === 'quiz' ? 'active' : ''}`} onClick={() => setActiveTab('quiz')}>
              🎯 Quiz Time
            </button>
            <button className={`tab-nav ${activeTab === 'rewards' ? 'active' : ''}`} onClick={() => setActiveTab('rewards')}>
              🏆 Rewards & Shop
            </button>
            <button className={`tab-nav ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
              💬 AI Tutor Chat
            </button>
            <button className={`tab-nav ${activeTab === 'parent' ? 'active' : ''}`} onClick={() => setActiveTab('parent')}>
              👨‍👩‍👧‍👦 Parent Zone
            </button>
            <button className={`tab-nav ${activeTab === 'flashcards' ? 'active' : ''}`} onClick={() => setActiveTab('flashcards')}>
              🃏 Flashcards
            </button>
          </div>

          {activeTab === 'home' && (
            <DashboardView
              gameState={gameState}
              generateLearningRoadmap={generateLearningRoadmap}
              loading={loading}
              learningPlan={learningPlan}
            />
          )}

          {activeTab === 'video' && (
            <VideoView
              videoTitle={videoTitle}
              videoPlayerHtml={videoPlayerHtml}
              userSubject={userSubject}
              loadVideoForSubject={loadVideoForSubject}
              loading={loading}
              completeVideoWatching={completeVideoWatching}
              videoCompletionMsg={videoCompletionMsg}
              checkAttention={checkAttention}
              attentionStatus={attentionStatus}
              attentionAlert={attentionAlert}
              socraticQuestion={socraticQuestion}
              handleSocraticAnswer={handleSocraticAnswer}
            />
          )}

          {activeTab === 'quiz' && (
            <QuizView
              userSubject={userSubject}
              startQuizSession={startQuizSession}
              loading={loading}
              quizContainerVisible={quizContainerVisible}
              currentQuestion={currentQuestion}
              answerOptions={answerOptions}
              quizAnswers={quizAnswers}
              currentQuestionIndex={currentQuestionIndex}
              handleQuizAnswer={handleQuizAnswer}
              quizProgress={quizProgress}
              quizQuestions={quizQuestions}
              submitQuizFinal={submitQuizFinal}
              quizResults={quizResults}
              handleNextQuestion={handleNextQuestion}
              userSubjectId={userSubjectId}
              selectedDbChapter={selectedDbChapter}
              calculateQuizScore={calculateQuizScore}
              addCoins={addCoins}
              setGameState={setGameState}
            />
          )}

          {activeTab === 'flashcards' && (
            <FlashcardView
              studentId={1}
              chapterId={selectedDbChapter}
            />
          )}

          {activeTab === 'rewards' && (
            <RewardsView
              gameState={gameState}
              PERKS_SHOP={PERKS_SHOP}
              buyPerk={buyPerk}
              loading={loading}
              perkResult={perkResult}
            />
          )}

          {activeTab === 'chat' && (
            <ChatView
              userSubject={userSubject}
              chatHistory={chatHistory}
              chatMessage={chatMessage}
              setChatMessage={setChatMessage}
              chatWithTutor={chatWithTutor}
              loading={loading}
              setChatHistory={setChatHistory}
            />
          )}

          {activeTab === 'parent' && (
            <ParentView
              gameState={gameState}
              userGrade={userGrade}
              userBoard={userBoard}
              userSubject={userSubject}
              logoutParent={logoutParent}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default App;
