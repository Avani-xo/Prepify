document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements for navbar and theme
  const navbarToggle = document.getElementById('navbar-toggle');
  const navbarMenu = document.getElementById('navbar-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const themeSwitch = document.getElementById('theme-switch');
  const html = document.documentElement;
  const logoLink = document.querySelector('.logo-link');
  
  // DOM Elements for landing page
  const getStartedBtn = document.getElementById('get-started-btn');
  const startNowBtn = document.getElementById('start-now-btn');
  const landingPage = document.getElementById('landing-page');
  
  // DOM Elements for app
  // Setup Screen
  const setupScreen = document.getElementById('setup-screen');
  const topicInput = document.getElementById('topic-input');
  const addTopicBtn = document.getElementById('add-topic-btn');
  const topicTags = document.querySelector('.topic-tags');
  const questionCount = document.getElementById('question-count');
  const questionCountDisplay = document.getElementById('question-count-display');
  const questionCountInput = document.getElementById('question-count-input');
  const startInterviewBtn = document.getElementById('start-interview-btn');
  
  // Loading Screen
  const loadingScreen = document.getElementById('loading-screen');
  const loadingMessage = document.getElementById('loading-message');
  
  // Interview Screen
  const interviewScreen = document.getElementById('interview-screen');
  const progressFill = document.querySelector('.progress-fill');
  const currentQuestionEl = document.getElementById('current-question');
  const totalQuestionsEl = document.getElementById('total-questions');
  const timerDisplay = document.getElementById('timer-display');
  const questionTopic = document.getElementById('question-topic');
  const questionDifficulty = document.getElementById('question-difficulty');
  const questionText = document.getElementById('question-text');
  const answerInput = document.getElementById('answer-input');
  const submitAnswerBtn = document.getElementById('submit-answer-btn');
  const skipQuestionBtn = document.getElementById('skip-question-btn');
  
  // Feedback Screen
  const feedbackScreen = document.getElementById('feedback-screen');
  const backToInterviewBtn = document.getElementById('back-to-interview-btn');
  const reviewQuestionText = document.getElementById('review-question-text');
  const reviewQuestionTopic = document.getElementById('review-question-topic');
  const reviewQuestionDifficulty = document.getElementById('review-question-difficulty');
  const reviewUserAnswer = document.getElementById('review-user-answer');
  const scoreValue = document.getElementById('score-value');
  const feedbackContent = document.getElementById('feedback-content');
  const suggestionsContent = document.getElementById('suggestions-content');
  const nextQuestionBtn = document.getElementById('next-question-btn');
  
  // Results Screen
  const resultsScreen = document.getElementById('results-screen');
  const overallScore = document.getElementById('overall-score');
  const questionsAnswered = document.getElementById('questions-answered');
  const avgTime = document.getElementById('avg-time');
  const questionList = document.getElementById('question-list');
  const restartBtn = document.getElementById('restart-btn');
  
  // Default Topics
  const DEFAULT_TOPICS = {
    "Computer Science": [
      "Data Structures", "Algorithms", "Object-Oriented Programming", 
      "Design Patterns", "Database Systems", "Operating Systems", 
      "Computer Networks", "Web Development", "Machine Learning", 
      "Cybersecurity", "Cloud Computing", "System Design"
    ],
    "Business": [
      "Marketing", "Finance", "Accounting", "Management", 
      "Entrepreneurship", "Business Strategy", "Human Resources", 
      "Supply Chain Management", "Business Analytics", "Economics"
    ],
    "Engineering": [
      "Electrical Engineering", "Mechanical Engineering", 
      "Civil Engineering", "Chemical Engineering", "Biomedical Engineering",
      "Industrial Engineering", "Aerospace Engineering"
    ],
    "Healthcare": [
      "Anatomy", "Physiology", "Pharmacology", "Pathology", 
      "Clinical Skills", "Medical Ethics", "Public Health"
    ],
    "Science": [
      "Physics", "Chemistry", "Biology", "Mathematics", 
      "Environmental Science", "Astronomy", "Geology"
    ]
  };
  
  // Application State
  const state = {
    topics: [],
    questionType: 'theory',
    difficultyLevel: 'mixed',
    questionCount: 5,
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    evaluations: [],
    startTime: null,
    questionStartTime: null,
    questionTimes: [],
    timerInterval: null
  };
  
  // Initialize the application
  function init() {
    // Set up navbar and theme functionality
    setupNavbar();
    setupThemeToggle();
    
    // Set up landing page navigation
    setupLandingPage();
    
    // Set up app functionality
    // Set up event listeners
    addTopicBtn.addEventListener('click', addTopic);
    topicInput.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        addTopic();
      }
    });
    
    // Set up suggestions
    setupTopicSuggestions();
    
    // Initialize the slider and question count input
    updateQuestionCount();
    questionCount.addEventListener('input', updateQuestionCount);
    questionCountInput.addEventListener('input', updateQuestionCountFromInput);
    
    // Set up radio buttons
    document.querySelectorAll('input[name="question-type"]').forEach(radio => {
      radio.addEventListener('change', updateQuestionType);
    });
    
    document.querySelectorAll('input[name="difficulty-level"]').forEach(radio => {
      radio.addEventListener('change', updateDifficultyLevel);
    });
    
    startInterviewBtn.addEventListener('click', startInterview);
    submitAnswerBtn.addEventListener('click', submitAnswer);
    skipQuestionBtn.addEventListener('click', skipQuestion);
    backToInterviewBtn.addEventListener('click', backToInterview);
    nextQuestionBtn.addEventListener('click', nextQuestion);
    restartBtn.addEventListener('click', restartInterview);
  }
  
  // Setup Navbar functionality
  function setupNavbar() {
    // Toggle mobile menu
    navbarToggle.addEventListener('click', () => {
      navbarMenu.classList.toggle('active');
      
      // Animate hamburger menu
      navbarToggle.classList.toggle('active');
    });
    
    // Handle nav link clicks
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // Close the mobile menu
        navbarMenu.classList.remove('active');
        navbarToggle.classList.remove('active');
        
        // Update active state
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Handle navigation to app
        if (link.getAttribute('href') === '#app') {
          e.preventDefault();
          showScreen(setupScreen);
        }
      });
    });
    
    // Make logo clickable
    logoLink.addEventListener('click', () => {
      showScreen(landingPage);
      updateActiveNavLink('#home');
    });
  }
  
  // Setup theme toggle functionality
  function setupThemeToggle() {
    // Check for saved theme preference or user's system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      html.setAttribute('data-theme', savedTheme);
      themeSwitch.checked = savedTheme === 'dark';
    } else if (prefersDark) {
      html.setAttribute('data-theme', 'dark');
      themeSwitch.checked = true;
    }
    
    // Add event listener for theme switch
    themeSwitch.addEventListener('change', () => {
      if (themeSwitch.checked) {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      } else {
        html.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      }
    });
  }
  
  // Setup landing page navigation
  function setupLandingPage() {
    // Navigate from landing page to app
    getStartedBtn.addEventListener('click', () => {
      showScreen(setupScreen);
      updateActiveNavLink('#app');
    });
    
    startNowBtn.addEventListener('click', () => {
      showScreen(setupScreen);
      updateActiveNavLink('#app');
    });
  }
  
  // Update active nav link
  function updateActiveNavLink(href) {
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === href) {
        link.classList.add('active');
      }
    });
  }
  
  // Set up topic suggestions
  function setupTopicSuggestions() {
    // Create the topic suggestions container
    const setupCard = document.querySelector('#setup-screen .card');
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'topic-suggestions';
    suggestionsContainer.innerHTML = '<h3>Suggested Topics</h3>';
    
    // Create category buttons
    const categoryButtons = document.createElement('div');
    categoryButtons.className = 'category-buttons';
    
    Object.keys(DEFAULT_TOPICS).forEach(category => {
      const button = document.createElement('button');
      button.textContent = category;
      button.className = 'category-btn';
      button.addEventListener('click', () => showTopicSuggestions(category));
      categoryButtons.appendChild(button);
    });
    
    // Create suggestions list
    const suggestionsList = document.createElement('div');
    suggestionsList.className = 'suggestions-list';
    
    suggestionsContainer.appendChild(categoryButtons);
    suggestionsContainer.appendChild(suggestionsList);
    
    // Insert before the start interview button
    setupCard.appendChild(suggestionsContainer);
    
    // Show first category by default
    showTopicSuggestions(Object.keys(DEFAULT_TOPICS)[0]);
  }
  
  // Show topic suggestions for a category
  function showTopicSuggestions(category) {
    // Highlight the active category
    document.querySelectorAll('.category-btn').forEach(btn => {
      if (btn.textContent === category) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    // Render topics
    const suggestionsList = document.querySelector('.suggestions-list');
    suggestionsList.innerHTML = '';
    
    DEFAULT_TOPICS[category].forEach(topic => {
      const suggestionChip = document.createElement('div');
      suggestionChip.className = 'suggestion-chip';
      suggestionChip.textContent = topic;
      suggestionChip.addEventListener('click', () => {
        if (!state.topics.includes(topic)) {
          state.topics.push(topic);
          renderTopics();
        }
      });
      suggestionsList.appendChild(suggestionChip);
    });
  }
  
  // Update the displayed question count
  function updateQuestionCount() {
    state.questionCount = parseInt(questionCount.value);
    questionCountDisplay.textContent = state.questionCount;
    questionCountInput.value = state.questionCount;
  }
  
  // Update question count from input field
  function updateQuestionCountFromInput() {
    let count = parseInt(questionCountInput.value);
    
    // Enforce min/max bounds
    if (count < 1) count = 1;
    if (count > 100) count = 100;
    
    state.questionCount = count;
    questionCountDisplay.textContent = count;
    
    // Update slider if within its range
    if (count <= 50) {
      questionCount.value = count;
    }
  }
  
  // Update the question type
  function updateQuestionType(e) {
    state.questionType = e.target.value;
  }
  
  // Update the difficulty level
  function updateDifficultyLevel(e) {
    state.difficultyLevel = e.target.value;
  }
  
  // Add a topic to the list
  function addTopic() {
    const topic = topicInput.value.trim();
    if (topic && !state.topics.includes(topic)) {
      state.topics.push(topic);
      renderTopics();
      topicInput.value = '';
    }
  }
  
  // Remove a topic from the list
  function removeTopic(topic) {
    state.topics = state.topics.filter(t => t !== topic);
    renderTopics();
  }
  
  // Render the topic tags
  function renderTopics() {
    topicTags.innerHTML = '';
    state.topics.forEach(topic => {
      const topicTag = document.createElement('div');
      topicTag.className = 'topic-tag';
      topicTag.innerHTML = `
        ${topic}
        <i class="fas fa-times" data-topic="${topic}"></i>
      `;
      topicTag.querySelector('i').addEventListener('click', () => removeTopic(topic));
      topicTags.appendChild(topicTag);
    });
  }
  
  // Start the interview session
  async function startInterview() {
    if (state.topics.length === 0) {
      alert('Please add at least one topic');
      return;
    }
    
    // Reset state
    state.currentQuestionIndex = 0;
    state.answers = [];
    state.evaluations = [];
    state.questionTimes = [];
    
    // Show loading screen
    showScreen(loadingScreen);
    loadingMessage.textContent = 'Generating your personalized interview questions...';
    
    try {
      // Generate questions
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topics: state.topics,
          questionType: state.questionType,
          difficultyLevel: state.difficultyLevel,
          questionCount: state.questionCount
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }
      
      state.questions = await response.json();
      
      // Update UI
      totalQuestionsEl.textContent = state.questions.length;
      
      // Start interview
      state.startTime = new Date();
      showQuestion();
      
    } catch (error) {
      console.error('Error starting interview:', error);
      alert('Failed to generate questions. Please try again.');
      showScreen(setupScreen);
    }
  }
  
  // Show the current question
  function showQuestion() {
    const question = state.questions[state.currentQuestionIndex];
    
    if (!question) {
      endInterview();
      return;
    }
    
    // Update UI
    currentQuestionEl.textContent = state.currentQuestionIndex + 1;
    progressFill.style.width = `${((state.currentQuestionIndex) / state.questions.length) * 100}%`;
    
    questionTopic.textContent = question.topic;
    questionDifficulty.textContent = question.difficulty;
    questionDifficulty.dataset.difficulty = question.difficulty.toLowerCase();
    
    questionText.textContent = question.question;
    
    // Reset answer input
    answerInput.value = '';
    
    // Show interview screen
    showScreen(interviewScreen);
    
    // Start timer for this question
    state.questionStartTime = new Date();
    startTimer();
    
    // Focus on answer input
    answerInput.focus();
  }
  
  // Submit an answer
  async function submitAnswer() {
    const question = state.questions[state.currentQuestionIndex];
    const userAnswer = answerInput.value.trim();
    
    if (!userAnswer) {
      alert('Please enter an answer');
      return;
    }
    
    // Stop timer
    stopTimer();
    
    // Record time taken
    const endTime = new Date();
    const timeTaken = (endTime - state.questionStartTime) / 1000; // in seconds
    state.questionTimes.push(timeTaken);
    
    // Save answer
    state.answers[state.currentQuestionIndex] = userAnswer;
    
    // Show loading screen while evaluating
    showScreen(loadingScreen);
    loadingMessage.textContent = 'Evaluating your answer...';
    
    try {
      // Send for evaluation
      const response = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question,
          userAnswer
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to evaluate answer');
      }
      
      const evaluation = await response.json();
      state.evaluations[state.currentQuestionIndex] = evaluation;
      
      // Show feedback
      showFeedback();
      
    } catch (error) {
      console.error('Error evaluating answer:', error);
      alert('Failed to evaluate answer. Please try again.');
      showScreen(interviewScreen);
      startTimer();
    }
  }
  
  // Skip the current question
  function skipQuestion() {
    // Stop timer
    stopTimer();
    
    // Record skipped question
    state.answers[state.currentQuestionIndex] = 'SKIPPED';
    state.evaluations[state.currentQuestionIndex] = {
      score: 0,
      feedback: 'Question was skipped',
      suggestions: 'Try answering the question next time'
    };
    
    // Record time as 0
    state.questionTimes.push(0);
    
    // Move to next question
    state.currentQuestionIndex++;
    showQuestion();
  }
  
  // Show feedback for the current question
  function showFeedback() {
    const question = state.questions[state.currentQuestionIndex];
    const userAnswer = state.answers[state.currentQuestionIndex];
    const evaluation = state.evaluations[state.currentQuestionIndex];
    
    // Update UI
    reviewQuestionText.textContent = question.question;
    reviewQuestionTopic.textContent = question.topic;
    reviewQuestionDifficulty.textContent = question.difficulty;
    reviewQuestionDifficulty.dataset.difficulty = question.difficulty.toLowerCase();
    
    reviewUserAnswer.textContent = userAnswer;
    
    scoreValue.textContent = evaluation.score;
    feedbackContent.innerHTML = evaluation.feedback;
    suggestionsContent.innerHTML = evaluation.suggestions;
    
    // Show feedback screen
    showScreen(feedbackScreen);
  }
  
  // Go back to the interview
  function backToInterview() {
    showScreen(interviewScreen);
    startTimer();
  }
  
  // Move to the next question
  function nextQuestion() {
    state.currentQuestionIndex++;
    
    if (state.currentQuestionIndex >= state.questions.length) {
      endInterview();
    } else {
      showQuestion();
    }
  }
  
  // End the interview and show results
  function endInterview() {
    // Calculate results
    const scores = state.evaluations.map(e => e ? parseFloat(e.score) : 0);
    const totalScore = scores.reduce((sum, score) => sum + score, 0);
    const averageScore = state.evaluations.length > 0 ? (totalScore / state.evaluations.length).toFixed(1) : 0;
    
    const answeredCount = state.answers.filter(a => a && a !== 'SKIPPED').length;
    
    const totalTime = state.questionTimes.reduce((sum, time) => sum + time, 0);
    const averageTime = answeredCount > 0 ? totalTime / answeredCount : 0;
    
    // Update UI
    overallScore.textContent = averageScore;
    questionsAnswered.textContent = `${answeredCount}/${state.questions.length}`;
    avgTime.textContent = formatTime(averageTime);
    
    // Render question list
    renderQuestionList();
    
    // Render charts
    renderTopicChart();
    renderDifficultyChart();
    
    // Show results screen
    showScreen(resultsScreen);
  }
  
  // Render the list of questions with scores
  function renderQuestionList() {
    questionList.innerHTML = '';
    
    state.questions.forEach((question, index) => {
      const evaluation = state.evaluations[index];
      const score = evaluation ? evaluation.score : 'N/A';
      
      const questionItem = document.createElement('div');
      questionItem.className = 'question-item';
      questionItem.innerHTML = `
        <div class="question-item-header">
          <div><strong>Q${index + 1}:</strong> ${question.topic}</div>
          <div class="question-item-score">${score}/10</div>
        </div>
        <p>${question.question}</p>
      `;
      
      questionList.appendChild(questionItem);
    });
  }
  
  // Render the topic performance chart
  function renderTopicChart() {
    const topicData = {};
    
    state.questions.forEach((question, index) => {
      const topic = question.topic;
      const evaluation = state.evaluations[index];
      const score = evaluation ? parseFloat(evaluation.score) : 0;
      
      if (!topicData[topic]) {
        topicData[topic] = {
          scores: [],
          total: 0,
          count: 0
        };
      }
      
      topicData[topic].scores.push(score);
      topicData[topic].total += score;
      topicData[topic].count++;
    });
    
    const topics = Object.keys(topicData);
    const averages = topics.map(topic => {
      return topicData[topic].total / topicData[topic].count;
    });
    
    const ctx = document.getElementById('topic-chart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: topics,
        datasets: [{
          label: 'Average Score',
          data: averages,
          backgroundColor: 'rgba(99, 102, 241, 0.7)',
          borderColor: 'rgba(99, 102, 241, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 10
          }
        }
      }
    });
  }
  
  // Render the difficulty performance chart
  function renderDifficultyChart() {
    const difficultyData = {
      easy: { scores: [], total: 0, count: 0 },
      medium: { scores: [], total: 0, count: 0 },
      hard: { scores: [], total: 0, count: 0 }
    };
    
    state.questions.forEach((question, index) => {
      const difficulty = question.difficulty.toLowerCase();
      const evaluation = state.evaluations[index];
      const score = evaluation ? parseFloat(evaluation.score) : 0;
      
      if (difficultyData[difficulty]) {
        difficultyData[difficulty].scores.push(score);
        difficultyData[difficulty].total += score;
        difficultyData[difficulty].count++;
      }
    });
    
    const difficulties = Object.keys(difficultyData);
    const averages = difficulties.map(difficulty => {
      return difficultyData[difficulty].count > 0
        ? difficultyData[difficulty].total / difficultyData[difficulty].count
        : 0;
    });
    
    const ctx = document.getElementById('difficulty-chart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: difficulties.map(d => d.charAt(0).toUpperCase() + d.slice(1)),
        datasets: [{
          label: 'Average Score',
          data: averages,
          backgroundColor: [
            'rgba(34, 197, 94, 0.7)',  // Easy - Green
            'rgba(234, 179, 8, 0.7)',   // Medium - Yellow
            'rgba(239, 68, 68, 0.7)'    // Hard - Red
          ],
          borderColor: [
            'rgba(34, 197, 94, 1)',
            'rgba(234, 179, 8, 1)',
            'rgba(239, 68, 68, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 10
          }
        }
      }
    });
  }
  
  // Restart the interview
  function restartInterview() {
    // Clear state
    state.questions = [];
    state.currentQuestionIndex = 0;
    state.answers = [];
    state.evaluations = [];
    state.questionTimes = [];
    
    // Show setup screen
    showScreen(setupScreen);
  }
  
  // Timer functions
  function startTimer() {
    state.timerInterval = setInterval(updateTimer, 1000);
  }
  
  function stopTimer() {
    clearInterval(state.timerInterval);
  }
  
  function updateTimer() {
    const currentTime = new Date();
    const elapsedSeconds = Math.floor((currentTime - state.questionStartTime) / 1000);
    timerDisplay.textContent = formatTime(elapsedSeconds);
  }
  
  // Format seconds into MM:SS
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  // Show a specific screen
  function showScreen(screen) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(s => {
      s.classList.remove('active');
    });
    
    // Show the requested screen
    screen.classList.add('active');
    
    // Scroll to top
    window.scrollTo(0, 0);
  }
  
  // Initialize the application
  init();
}); 