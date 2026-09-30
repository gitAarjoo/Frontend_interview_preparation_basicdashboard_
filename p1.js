// Mock Database containing Flashcards and Quiz Data
const interviewData = [
    { id: 1, type: 'html', question: 'What are semantic elements?', answer: 'Elements that clearly describe their meaning to both the browser and the developer (e.g., <header>, <main>, <article>, <footer>) instead of generic <div> tags.', qType: 'card' },
    { id: 2, type: 'css', question: 'Explain the CSS Box Model.', answer: 'It is a container that wraps around every HTML element, consisting of: Content, Padding (around content), Border (around padding), and Margin (outside border).', qType: 'card' },
    { id: 3, type: 'javascript', question: 'What is Hoisting in JavaScript?', answer: 'A mechanism where variable and function declarations are moved to the top of their containing scope before code execution. let and const variables are hoisted but not initialized.', qType: 'card' },
    { id: 4, type: 'javascript', question: 'Difference between == and ===?', answer: '== checks for value equality with type coercion (e.g., 5 == "5" is true). === checks for strict equality of both value and data type without coercion (5 === "5" is false).', qType: 'card' },
    { id: 5, type: 'css', question: 'What is the purpose of "box-sizing: border-box"?', answer: 'It forces the browser to include padding and border sizes inside the element\'s total specified width and height, preventing layout breakage.', qType: 'card' }
];

const quizData = [
    {
        question: "Which of the following creates a block-scoped variable that CANNOT be reassigned?",
        options: ["var x = 10;", "let x = 10;", "const x = 10;", "global.x = 10;"],
        correct: 2,
        explanation: "const creates a block-scoped variable that cannot be updated or redeclared after initialization."
    },
    {
        question: "Which HTML attribute delays script execution until the DOM is completely parsed?",
        options: ["async", "defer", "href", "rel"],
        correct: 1,
        explanation: "The defer attribute ensures the script executes only after HTML parsing completes, preserving loading performance."
    }
];

// DOM elements
const container = document.getElementById('flashcards-container');
const tabs = document.querySelectorAll('.tab-btn');
const quizQuestion = document.getElementById('quiz-question');
const quizOptions = document.getElementById('quiz-options');
const quizFeedback = document.getElementById('quiz-feedback');
const nextQuizBtn = document.getElementById('next-quiz-btn');

let currentQuizIndex = 0;

// Render Flashcards
function renderCards(category = 'all') {
    container.innerHTML = '';
    const filtered = category === 'all' ? interviewData : interviewData.filter(item => item.type === category);
    
    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'flashcard';
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <span class="card-tag">${item.type}</span>
                    <h3>${item.question}</h3>
                </div>
                <div class="card-back">
                    <p>${item.answer}</p>
                </div>
            </div>
        `;
        card.addEventListener('click', () => card.classList.toggle('flipped'));
        container.appendChild(card);
    });
}

// Category Filter Controller
tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        tabs.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        renderCards(e.target.dataset.category);
    });
});

// Interactive Quiz System
function loadQuiz() {
    quizFeedback.className = 'feedback hidden';
    nextQuizBtn.classList.add('hidden');
    quizOptions.innerHTML = '';
    
    const currentQuiz = quizData[currentQuizIndex];
    quizQuestion.textContent = `${currentQuizIndex + 1}. ${currentQuiz.question}`;
    
    currentQuiz.options.forEach((option, idx) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.addEventListener('click', () => checkAnswer(idx, button));
        quizOptions.appendChild(button);
    });
}

function checkAnswer(selectedIndex, clickedBtn) {
    const currentQuiz = quizData[currentQuizIndex];
    const buttons = quizOptions.querySelectorAll('.option-btn');
    
    buttons.forEach(btn => btn.disabled = true); // Disable further clicking

    if (selectedIndex === currentQuiz.correct) {
        clickedBtn.classList.add('correct');
        quizFeedback.textContent = `Correct! 🎉 ${currentQuiz.explanation}`;
        quizFeedback.className = 'feedback correct';
    } else {
        clickedBtn.classList.add('wrong');
        buttons[currentQuiz.correct].classList.add('correct'); // Highlight right answer
        quizFeedback.textContent = `Incorrect. ❌ ${currentQuiz.explanation}`;
        quizFeedback.className = 'feedback wrong';
    }
    
    nextQuizBtn.classList.remove('hidden');
}

nextQuizBtn.addEventListener('click', () => {
    currentQuizIndex = (currentQuizIndex + 1) % quizData.length;
    loadQuiz();
});

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    renderCards();
    loadQuiz();
});
