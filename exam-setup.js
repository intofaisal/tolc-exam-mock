document.addEventListener('DOMContentLoaded', function() {
    // Get all start exam buttons
    const startExamButtons = document.querySelectorAll('.start-exam-btn');
    
    // Add click event listener to each button
    startExamButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the exam type from the data attribute
            const examType = this.getAttribute('data-exam-type');
            
            // Store the exam type in localStorage
            localStorage.setItem('examType', examType);
            
            // Redirect to the exam environment page
            window.location.href = 'exam-environment.html';
        });
    });
    
    // Highlight the selected exam card when clicked
    const examCards = document.querySelectorAll('.exam-card');
    
    examCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            examCards.forEach(c => c.classList.remove('active'));
            
            // Add active class to the clicked card
            this.classList.add('active');
            
            // Get the exam type from the data attribute
            const examType = this.getAttribute('data-exam-type');
            
            // Store the exam type in localStorage
            localStorage.setItem('examType', examType);
        });
    });
});
