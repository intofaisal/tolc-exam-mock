document.addEventListener('DOMContentLoaded', function() {
    // Get results from localStorage
    const resultsData = JSON.parse(localStorage.getItem('examResults'));
    
    if (!resultsData) {
        // No results found, redirect to exam setup page
        alert('No exam results found. Please take an exam first.');
        window.location.href = 'exam.html';
        return;
    }
    
    // Extract data from results
    const { examType, userAnswers, examData, timeTaken } = resultsData;
    
    // Display exam type
    document.getElementById('exam-type-result').textContent = examType;
    
    // Calculate and display scores
    calculateAndDisplayScores(userAnswers, examData, timeTaken);
    
    // Display detailed question analysis
    displayQuestionAnalysis(userAnswers, examData);
    
    // Set up PDF download
    setupPdfDownload(resultsData);
});

// Calculate and display scores
function calculateAndDisplayScores(userAnswers, examData, timeTaken) {
    let totalQuestions = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let blankAnswers = 0;
    let totalScore = 0;
    
    // Calculate section scores
    const sectionScores = examData.sections.map((section, sectionIndex) => {
        const sectionUserAnswers = userAnswers[sectionIndex];
        let sectionCorrect = 0;
        let sectionWrong = 0;
        let sectionBlank = 0;
        let sectionScore = 0;
        
        // Get the actual number of questions to use for this section
        const questionCount = Math.min(section.questionCount || section.questions.length, section.questions.length);
        
        // Only process the number of questions that were actually used in the exam
        for (let questionIndex = 0; questionIndex < questionCount; questionIndex++) {
            const question = section.questions[questionIndex];
            const userAnswer = sectionUserAnswers[questionIndex];
            
            // Count total questions
            totalQuestions++;
            
            if (userAnswer === null) {
                // Blank answer
                blankAnswers++;
                sectionBlank++;
            } else if (userAnswer === question.correctAnswer) {
                // Correct answer
                correctAnswers++;
                sectionCorrect++;
                totalScore += 1;
                sectionScore += 1;
            } else {
                // Wrong answer
                wrongAnswers++;
                sectionWrong++;
                totalScore -= 0.25;
                sectionScore -= 0.25;
            }
        }
        
        return {
            name: section.name,
            totalQuestions: questionCount,
            correct: sectionCorrect,
            wrong: sectionWrong,
            blank: sectionBlank,
            score: sectionScore
        };
    });
    
    // Round total score to 2 decimal places and ensure it's not negative
    totalScore = Math.max(0, Math.round(totalScore * 100) / 100);
    
    // Display total score
    document.getElementById('total-score').textContent = totalScore;
    
    // Display score details
    document.getElementById('total-questions-result').textContent = totalQuestions;
    document.getElementById('correct-answers').textContent = correctAnswers;
    document.getElementById('wrong-answers').textContent = wrongAnswers;
    document.getElementById('blank-answers').textContent = blankAnswers;
    
    // Display time taken
    const hours = Math.floor(timeTaken / 3600);
    const minutes = Math.floor((timeTaken % 3600) / 60);
    const seconds = timeTaken % 60;
    document.getElementById('time-taken').textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Display section scores
    const sectionScoresContainer = document.getElementById('section-scores');
    sectionScoresContainer.innerHTML = '<h2>Section Scores</h2>';
    
    sectionScores.forEach(section => {
        // Calculate percentage score for the progress bar
        const maxSectionScore = section.totalQuestions;
        const percentage = Math.max(0, (section.score / maxSectionScore) * 100);
        
        const sectionElement = document.createElement('div');
        sectionElement.className = 'section-score-item';
        sectionElement.innerHTML = `
            <h3>
                ${section.name}
                <span>${section.score.toFixed(2)} / ${maxSectionScore}</span>
            </h3>
            <div class="section-score-bar">
                <div class="section-score-progress" style="width: ${percentage}%"></div>
            </div>
            <div class="section-score-details">
                <span>Correct: ${section.correct}</span>
                <span>Wrong: ${section.wrong}</span>
                <span>Blank: ${section.blank}</span>
            </div>
        `;
        
        sectionScoresContainer.appendChild(sectionElement);
    });
}

// Display detailed question analysis
function displayQuestionAnalysis(userAnswers, examData) {
    const questionsReviewContainer = document.getElementById('questions-review');
    questionsReviewContainer.innerHTML = '';
    
    examData.sections.forEach((section, sectionIndex) => {
        // Create section header
        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'section-header';
        sectionHeader.innerHTML = `<h3>${section.name}</h3>`;
        questionsReviewContainer.appendChild(sectionHeader);
        
        // Get the actual number of questions to use for this section
        const questionCount = Math.min(section.questionCount || section.questions.length, section.questions.length);
        
        // Create question review items only for questions that were actually used in the exam
        for (let questionIndex = 0; questionIndex < questionCount; questionIndex++) {
            const question = section.questions[questionIndex];
            const userAnswer = userAnswers[sectionIndex][questionIndex];
            const isCorrect = userAnswer === question.correctAnswer;
            const isBlank = userAnswer === null;
            
            let statusClass = '';
            let statusText = '';
            
            if (isBlank) {
                statusClass = 'blank';
                statusText = 'Not Answered';
            } else if (isCorrect) {
                statusClass = 'correct';
                statusText = 'Correct';
            } else {
                statusClass = 'incorrect';
                statusText = 'Incorrect';
            }
            
            const questionReviewItem = document.createElement('div');
            questionReviewItem.className = 'question-review-item';
            
            // Question header
            questionReviewItem.innerHTML = `
                <div class="question-review-header">
                    <span class="question-review-number">Question ${questionIndex + 1}</span>
                    <span class="question-review-status ${statusClass}">${statusText}</span>
                </div>
                <div class="question-review-content">
                    <p>${question.text}</p>
                    ${question.imageUrl ? `<div class="question-image-container"><img src="${question.imageUrl}" alt="Question Image"></div>` : ''}
                </div>
            `;
            
            // Options container
            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'question-review-options';
            
            // Add each option
            question.options.forEach((option, optionIndex) => {
                const isUserSelected = userAnswer === optionIndex;
                const isCorrectOption = question.correctAnswer === optionIndex;
                
                let optionClass = '';
                if (isUserSelected && !isCorrectOption) {
                    optionClass = 'selected';
                } else if (isCorrectOption) {
                    optionClass = 'correct';
                }
                
                const optionElement = document.createElement('div');
                optionElement.className = `question-review-option ${optionClass}`;
                
                // Check if option is text or image
                if (typeof option === 'string' && !option.startsWith('http')) {
                    // Text option
                    optionElement.innerHTML = `
                        <div class="option-prefix">${String.fromCharCode(65 + optionIndex)}</div>
                        <div class="option-text">${option}</div>
                        ${isUserSelected ? '<i class="fas fa-user"></i>' : ''}
                        ${isCorrectOption ? '<i class="fas fa-check"></i>' : ''}
                    `;
                } else {
                    // Image option
                    optionElement.innerHTML = `
                        <div class="option-prefix">${String.fromCharCode(65 + optionIndex)}</div>
                        <div class="option-image">
                            <img src="${option}" alt="Option ${String.fromCharCode(65 + optionIndex)}">
                        </div>
                        ${isUserSelected ? '<i class="fas fa-user"></i>' : ''}
                        ${isCorrectOption ? '<i class="fas fa-check"></i>' : ''}
                    `;
                }
                
                optionsContainer.appendChild(optionElement);
            });
            
            questionReviewItem.appendChild(optionsContainer);
            
            // Add explanation
            if (question.explanation) {
                const explanationElement = document.createElement('div');
                explanationElement.className = 'question-review-explanation';
                explanationElement.innerHTML = `
                    <h4>Explanation:</h4>
                    <p>${question.explanation}</p>
                `;
                questionReviewItem.appendChild(explanationElement);
            }
            
            questionsReviewContainer.appendChild(questionReviewItem);
        }
    });
}

// Set up PDF download
function setupPdfDownload(resultsData) {
    const downloadButton = document.getElementById('download-pdf');
    
    downloadButton.addEventListener('click', function() {
        // Load jsPDF and html2canvas scripts dynamically
        if (typeof jspdf === 'undefined') {
            // First load jsPDF
            const jsPdfScript = document.createElement('script');
            jsPdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            jsPdfScript.onload = function() {
                // Then load html2canvas
                const html2canvasScript = document.createElement('script');
                html2canvasScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
                html2canvasScript.onload = function() {
                    generatePDF(resultsData);
                };
                document.head.appendChild(html2canvasScript);
            };
            document.head.appendChild(jsPdfScript);
        } else {
            generatePDF(resultsData);
        }
    });
}

// Generate PDF with exam results
function generatePDF(resultsData) {
    // Show loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = '<div class="spinner"></div><p>Generating PDF...</p>';
    document.body.appendChild(loadingIndicator);
    
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const { examType, userAnswers, examData, timeTaken } = resultsData;
        
        // Calculate scores
        const scores = calculateScores(userAnswers, examData);
        
        // Set up PDF styling
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(37, 99, 235); // Primary color
        
        // Add header
        doc.text('TOLC Mock Test Results', 105, 20, { align: 'center' });
        
        // Add exam type
        doc.setFontSize(14);
        doc.text(`Exam Type: ${examType}`, 20, 35);
        
        // Add date
        const currentDate = new Date().toLocaleDateString();
        doc.setFontSize(12);
        doc.text(`Date: ${currentDate}`, 20, 45);
        
        // Add time taken
        const hours = Math.floor(timeTaken / 3600);
        const minutes = Math.floor((timeTaken % 3600) / 60);
        const seconds = timeTaken % 60;
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        doc.text(`Time Taken: ${timeString}`, 20, 55);
        
        // Add overall score
        doc.setFontSize(16);
        doc.setTextColor(31, 41, 55); // Dark color
        doc.text('Overall Score', 105, 70, { align: 'center' });
        
        doc.setFontSize(24);
        doc.setTextColor(37, 99, 235); // Primary color
        doc.text(`${scores.totalScore.toFixed(2)} points`, 105, 85, { align: 'center' });
        
        // Add score details
        doc.setFontSize(12);
        doc.setTextColor(31, 41, 55); // Dark color
        doc.text(`Total Questions: ${scores.totalQuestions}`, 20, 100);
        doc.text(`Correct Answers: ${scores.correctAnswers}`, 20, 110);
        doc.text(`Wrong Answers: ${scores.wrongAnswers}`, 20, 120);
        doc.text(`Blank Answers: ${scores.blankAnswers}`, 20, 130);
        
        // Add section scores
        doc.setFontSize(16);
        doc.setTextColor(31, 41, 55); // Dark color
        doc.text('Section Scores', 105, 150, { align: 'center' });
        
        let yPosition = 165;
        scores.sectionScores.forEach(section => {
            doc.setFontSize(14);
            doc.setTextColor(37, 99, 235); // Primary color
            doc.text(section.name, 20, yPosition);
            
            doc.setFontSize(12);
            doc.setTextColor(31, 41, 55); // Dark color
            doc.text(`Score: ${section.score.toFixed(2)} / ${section.totalQuestions}`, 150, yPosition);
            
            yPosition += 10;
            doc.text(`Correct: ${section.correct}  |  Wrong: ${section.wrong}  |  Blank: ${section.blank}`, 20, yPosition);
            
            yPosition += 15;
        });
        
        // Add disclaimer
        yPosition = Math.max(yPosition, 240);
        doc.setFontSize(10);
        doc.setTextColor(107, 114, 128); // Gray color
        doc.text('DISCLAIMER', 20, yPosition);
        yPosition += 5;
        doc.text('This mock test result is for practice purposes only and is not intended for university application submissions.', 20, yPosition, { maxWidth: 170 });
        
        // Save the PDF
        doc.save('tolc-mock-test-results.pdf');
        
        // Remove loading indicator
        document.body.removeChild(loadingIndicator);
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again later.');
        
        // Remove loading indicator
        document.body.removeChild(loadingIndicator);
    }
}

// Helper function to calculate scores for PDF
function calculateScores(userAnswers, examData) {
    let totalQuestions = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let blankAnswers = 0;
    let totalScore = 0;
    
    // Calculate section scores
    const sectionScores = examData.sections.map((section, sectionIndex) => {
        const sectionUserAnswers = userAnswers[sectionIndex];
        let sectionCorrect = 0;
        let sectionWrong = 0;
        let sectionBlank = 0;
        let sectionScore = 0;
        
        section.questions.forEach((question, questionIndex) => {
            const userAnswer = sectionUserAnswers[questionIndex];
            
            // Count total questions
            totalQuestions++;
            
            if (userAnswer === null) {
                // Blank answer
                blankAnswers++;
                sectionBlank++;
            } else if (userAnswer === question.correctAnswer) {
                // Correct answer
                correctAnswers++;
                sectionCorrect++;
                totalScore += 1;
                sectionScore += 1;
            } else {
                // Wrong answer
                wrongAnswers++;
                sectionWrong++;
                totalScore -= 0.25;
                sectionScore -= 0.25;
            }
        });
        
        return {
            name: section.name,
            totalQuestions: section.questions.length,
            correct: sectionCorrect,
            wrong: sectionWrong,
            blank: sectionBlank,
            score: sectionScore
        };
    });
    
    // Round total score to 2 decimal places and ensure it's not negative
    totalScore = Math.max(0, Math.round(totalScore * 100) / 100);
    
    return {
        totalScore,
        totalQuestions,
        correctAnswers,
        wrongAnswers,
        blankAnswers,
        sectionScores
    };
}
