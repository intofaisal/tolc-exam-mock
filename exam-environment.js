// Global variables
let examType = '';
let examData = null;
let currentSection = 0;
let currentQuestion = 0;
let userAnswers = [];
let examTimer = null;
let startTime = null;
let totalTime = 0; // in seconds
let isFullScreen = false;

// DOM Elements
const examTypeElement = document.getElementById('exam-type');
const sectionNameElement = document.getElementById('section-name');
const timerDisplay = document.getElementById('timer-display');
const questionText = document.getElementById('question-text');
const questionImageContainer = document.getElementById('question-image-container');
const optionsContainer = document.getElementById('options-container');
const prevButton = document.getElementById('prev-question');
const nextButton = document.getElementById('next-question');
const currentQuestionElement = document.getElementById('current-question');
const totalQuestionsElement = document.getElementById('total-questions');
const endExamButton = document.getElementById('end-exam');
const warningModal = document.getElementById('warning-modal');
const continueExamButton = document.getElementById('continue-exam');
const endExamModal = document.getElementById('end-exam-modal');
const cancelEndExamButton = document.getElementById('cancel-end-exam');
const confirmEndExamButton = document.getElementById('confirm-end-exam');

// Initialize the exam
document.addEventListener('DOMContentLoaded', async function() {
    // Get exam type from localStorage
    examType = localStorage.getItem('examType') || 'TOLC-I';
    
    // Update the exam type in the header
    examTypeElement.textContent = examType;
    
    try {
        // Fetch the exam data
        const response = await fetch('data/questions.json');
        const data = await response.json();
        
        // Set the exam data based on the exam type
        examData = data[examType];
        
        if (!examData) {
            throw new Error(`No data found for exam type: ${examType}`);
        }
        
        // Initialize user answers array
        initializeUserAnswers();
        
        // Set the total time based on exam type from the exam data
        totalTime = examData.duration * 60; // Convert minutes to seconds
        
        // Start the timer
        startTimer();
        
        // Load the first question
        loadQuestion();
        
        // Request full screen
        requestFullScreen();
        
        // Set up event listeners
        setupEventListeners();
        
    } catch (error) {
        console.error('Error initializing exam:', error);
        alert('Failed to load exam data. Please try again later.');
        window.location.href = 'exam.html';
    }
});

// Initialize user answers array
function initializeUserAnswers() {
    userAnswers = [];
    
    // Initialize with empty answers for each section and question
    // Use the questionCount property to determine how many questions to include
    examData.sections.forEach(section => {
        // Get the actual number of questions available
        const availableQuestions = section.questions.length;
        // Get the target number of questions for this section
        const targetQuestions = section.questionCount || availableQuestions;
        // Use the smaller of the two to avoid errors
        const questionCount = Math.min(targetQuestions, availableQuestions);
        
        const sectionAnswers = Array(questionCount).fill(null);
        userAnswers.push(sectionAnswers);
    });
}

// Start the exam timer
function startTimer() {
    startTime = new Date();
    
    examTimer = setInterval(() => {
        const currentTime = new Date();
        const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
        const remainingSeconds = totalTime - elapsedSeconds;
        
        if (remainingSeconds <= 0) {
            // Time's up, end the exam
            clearInterval(examTimer);
            endExam();
        } else {
            // Update the timer display
            updateTimerDisplay(remainingSeconds);
        }
    }, 1000);
}

// Update the timer display
function updateTimerDisplay(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    timerDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    
    // Change timer color when less than 5 minutes remaining
    if (seconds < 300) {
        timerDisplay.parentElement.style.backgroundColor = '#ef4444';
    }
}

// Load the current question
function loadQuestion() {
    const section = examData.sections[currentSection];
    
    // Get the actual number of questions to use for this section
    const questionCount = Math.min(section.questionCount || section.questions.length, section.questions.length);
    
    // Make sure currentQuestion is within bounds
    if (currentQuestion >= questionCount) {
        currentQuestion = questionCount - 1;
    }
    
    const question = section.questions[currentQuestion];
    
    // Update section name
    sectionNameElement.textContent = `Section: ${section.name}`;
    
    // Update question text
    questionText.textContent = question.text;
    
    // Handle question image if present
    if (question.imageUrl) {
        questionImageContainer.innerHTML = `<img src="${question.imageUrl}" alt="Question Image">`;
        questionImageContainer.style.display = 'flex';
    } else {
        questionImageContainer.innerHTML = '';
        questionImageContainer.style.display = 'none';
    }
    
    // Clear previous options
    optionsContainer.innerHTML = '';
    
    // Add options
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.dataset.index = index;
        
        // Check if this option is selected
        if (userAnswers[currentSection][currentQuestion] === index) {
            optionElement.classList.add('selected');
        }
        
        // Check if option is text or image
        if (typeof option === 'string' && !option.startsWith('http')) {
            // Text option
            optionElement.innerHTML = `
                <div class="option-prefix">${String.fromCharCode(65 + index)}</div>
                <div class="option-text">${option}</div>
            `;
        } else {
            // Image option
            optionElement.innerHTML = `
                <div class="option-prefix">${String.fromCharCode(65 + index)}</div>
                <div class="option-image">
                    <img src="${option}" alt="Option ${String.fromCharCode(65 + index)}">
                </div>
            `;
        }
        
        // Add click event listener
        optionElement.addEventListener('click', () => {
            // Remove selected class from all options
            document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            optionElement.classList.add('selected');
            
            // Save the answer
            userAnswers[currentSection][currentQuestion] = index;
        });
        
        optionsContainer.appendChild(optionElement);
    });
    
    // Update question pagination
    currentQuestionElement.textContent = currentQuestion + 1;
    // Use the questionCount property if available, otherwise use the actual length
    const totalQuestions = Math.min(section.questionCount || section.questions.length, section.questions.length);
    totalQuestionsElement.textContent = totalQuestions;
    
    // Update navigation buttons
    updateNavigationButtons();
}

// Update navigation buttons state
function updateNavigationButtons() {
    // Disable prev button if on first question
    prevButton.disabled = currentQuestion === 0;
    
    // Update next button text and state based on whether it's the last question
    const section = examData.sections[currentSection];
    // Get the actual number of questions to use for this section
    const questionCount = Math.min(section.questionCount || section.questions.length, section.questions.length);
    const isLastQuestion = currentQuestion === questionCount - 1;
    
    if (isLastQuestion) {
        if (currentSection === examData.sections.length - 1) {
            // Last question of last section
            nextButton.textContent = 'Finish Exam';
        } else {
            // Last question of current section
            nextButton.textContent = 'Next Section';
        }
    } else {
        nextButton.textContent = 'Next';
        nextButton.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
    }
}

// Handle next button click
function handleNextButton() {
    const section = examData.sections[currentSection];
    // Get the actual number of questions to use for this section
    const questionCount = Math.min(section.questionCount || section.questions.length, section.questions.length);
    const isLastQuestion = currentQuestion === questionCount - 1;
    
    if (isLastQuestion) {
        if (currentSection === examData.sections.length - 1) {
            // Last question of last section, end the exam
            showEndExamConfirmation();
        } else {
            // Last question of current section, move to next section
            currentSection++;
            currentQuestion = 0;
            loadQuestion();
        }
    } else {
        // Move to next question in current section
        currentQuestion++;
        loadQuestion();
    }
}

// Handle previous button click
function handlePrevButton() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
}

// Request full screen mode
function requestFullScreen() {
    const element = document.documentElement;
    
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
    
    isFullScreen = true;
}

// Exit full screen mode
function exitFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
    
    isFullScreen = false;
}

// Show warning modal
function showWarningModal() {
    warningModal.classList.add('active');
}

// Hide warning modal
function hideWarningModal() {
    warningModal.classList.remove('active');
}

// Show end exam confirmation modal
function showEndExamConfirmation() {
    endExamModal.classList.add('active');
}

// Hide end exam confirmation modal
function hideEndExamConfirmation() {
    endExamModal.classList.remove('active');
}

// End the exam and go to results page
function endExam() {
    // Calculate elapsed time
    const currentTime = new Date();
    const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
    
    // Save exam results to localStorage
    const results = {
        examType: examType,
        userAnswers: userAnswers,
        examData: examData,
        timeTaken: elapsedSeconds
    };
    
    localStorage.setItem('examResults', JSON.stringify(results));
    
    // Exit full screen
    exitFullScreen();
    
    // Redirect to results page
    window.location.href = 'results.html';
}

// Set up event listeners
function setupEventListeners() {
    // Navigation buttons
    nextButton.addEventListener('click', handleNextButton);
    prevButton.addEventListener('click', handlePrevButton);
    
    // End exam button
    endExamButton.addEventListener('click', showEndExamConfirmation);
    
    // Warning modal continue button
    continueExamButton.addEventListener('click', hideWarningModal);
    
    // End exam confirmation buttons
    cancelEndExamButton.addEventListener('click', hideEndExamConfirmation);
    confirmEndExamButton.addEventListener('click', endExam);
    
    // Focus guard
    document.addEventListener('mousemove', (e) => {
        // Show warning if mouse moves to top of screen
        if (e.clientY < 10 && isFullScreen) {
            showWarningModal();
        }
    });
    
    // Handle full screen change
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement && isFullScreen) {
            showWarningModal();
            isFullScreen = false;
        } else if (document.fullscreenElement) {
            isFullScreen = true;
        }
    });
    
    // Handle visibility change (tab switching)
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden' && isFullScreen) {
            // User switched tabs or minimized window
            showWarningModal();
        }
    });
    
    // Prevent keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Prevent F11 (fullscreen toggle)
        if (e.key === 'F11') {
            e.preventDefault();
        }
        
        // Prevent Alt+Tab
        if (e.altKey && e.key === 'Tab') {
            e.preventDefault();
            showWarningModal();
        }
        
        // Prevent Ctrl+W (close tab)
        if (e.ctrlKey && e.key === 'w') {
            e.preventDefault();
            showWarningModal();
        }
    });
}
