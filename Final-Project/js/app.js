let currentMode = 'learning';
let animationSpeed = 500;
let isAnimating = false;
let currentModule = null;

let challengeScore = 0;
let challengeTotal = 0;
let challengeStreak = 0;
let awaitingAnswer = false;
let correctAnswer = null;
let answerCallback = null;

function showDashboard() {
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('module-container').classList.add('hidden');
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.querySelector('.nav-link').classList.add('active');
    currentModule = null;
    resetChallengeStats();
}

function toggleMode() {
    const btn = document.getElementById('modeBtn');
    if (currentMode === 'learning') {
        currentMode = 'challenge';
        btn.innerHTML = '<i class="fas fa-trophy"></i> Challenge Mode';
        btn.classList.add('challenge');
        resetChallengeStats();
    } else {
        currentMode = 'learning';
        btn.innerHTML = '<i class="fas fa-graduation-cap"></i> Learning Mode';
        btn.classList.remove('challenge');
    }
    
    document.querySelectorAll('.challenge-banner').forEach(banner => {
        banner.classList.toggle('active', currentMode === 'challenge');
    });
    
    updateChallengeDisplay();
}

function resetChallengeStats() {
    challengeScore = 0;
    challengeTotal = 0;
    challengeStreak = 0;
    awaitingAnswer = false;
    correctAnswer = null;
    stopChallengeTimer();
    challengeSeconds = 0;
}

function updateChallengeDisplay() {
    const scoreEl = document.getElementById('challenge-score');
    const streakEl = document.getElementById('challenge-streak');
    const accuracyEl = document.getElementById('challenge-accuracy');
    
    if (scoreEl) scoreEl.textContent = challengeScore;
    if (streakEl) streakEl.textContent = challengeStreak;
    if (accuracyEl) {
        const accuracy = challengeTotal > 0 ? Math.round((challengeScore / challengeTotal) * 100) : 0;
        accuracyEl.textContent = accuracy + '%';
    }
}

async function askChallengeQuestion(question, options, correct) {
    if (currentMode !== 'challenge') return true;
    
    return new Promise((resolve) => {
        awaitingAnswer = true;
        correctAnswer = correct;
        
        const questionArea = document.getElementById('challenge-question-area');
        if (!questionArea) {
            resolve(true);
            return;
        }
        
        let optionsHTML = '';
        options.forEach((opt, idx) => {
            optionsHTML += `<button class="challenge-option" onclick="submitChallengeAnswer(${idx})">${opt}</button>`;
        });
        
        questionArea.innerHTML = `
            <div class="challenge-question">
                <h5><i class="fas fa-question-circle"></i> ${question}</h5>
                <div class="challenge-options">${optionsHTML}</div>
            </div>
        `;
        questionArea.classList.add('active');
        
        answerCallback = resolve;
    });
}

function submitChallengeAnswer(answerIdx) {
    if (!awaitingAnswer) return;
    
    awaitingAnswer = false;
    challengeTotal++;
    
    const questionArea = document.getElementById('challenge-question-area');
    const buttons = questionArea.querySelectorAll('.challenge-option');
    
    buttons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === correctAnswer) {
            btn.classList.add('correct');
        } else if (idx === answerIdx && answerIdx !== correctAnswer) {
            btn.classList.add('wrong');
        }
    });
    
    if (answerIdx === correctAnswer) {
        challengeScore++;
        challengeStreak++;
        showChallengeFeedback(true, 'Correct! +1 point');
    } else {
        challengeStreak = 0;
        showChallengeFeedback(false, 'Wrong! The correct answer is highlighted.');
    }
    
    updateChallengeDisplay();
    
    setTimeout(() => {
        if (questionArea) {
            questionArea.innerHTML = '';
            questionArea.classList.remove('active');
        }
        if (answerCallback) {
            answerCallback(answerIdx === correctAnswer);
        }
    }, 1500);
}

function showChallengeFeedback(isCorrect, message) {
    const feedback = document.createElement('div');
    feedback.className = `challenge-feedback ${isCorrect ? 'correct' : 'wrong'}`;
    feedback.innerHTML = `<i class="fas fa-${isCorrect ? 'check-circle' : 'times-circle'}"></i> ${message}`;
    
    const questionArea = document.getElementById('challenge-question-area');
    if (questionArea) {
        questionArea.appendChild(feedback);
    }
}

function skipChallengeQuestion() {
    if (!awaitingAnswer) return;
    
    awaitingAnswer = false;
    challengeTotal++;
    challengeStreak = 0;
    
    const questionArea = document.getElementById('challenge-question-area');
    if (questionArea) {
        questionArea.innerHTML = '';
        questionArea.classList.remove('active');
    }
    
    updateChallengeDisplay();
    
    if (answerCallback) {
        answerCallback(false);
    }
}

function loadModule(moduleName) {
    currentModule = moduleName;
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('module-container').classList.remove('hidden');
    
    const container = document.getElementById('module-container');
    
    switch(moduleName) {
        case 'avl-tree':
            container.innerHTML = getAVLTreeHTML();
            initAVLTree();
            break;
        case 'bst':
            container.innerHTML = getBSTHTML();
            initBST();
            break;
        case 'linked-list':
            container.innerHTML = getLinkedListHTML();
            initLinkedList();
            break;
        case 'stack-queue':
            container.innerHTML = getStackQueueHTML();
            initStackQueue();
            break;
        case 'dynamic-static-list':
            container.innerHTML = getDynamicStaticListHTML();
            initDynamicStaticList();
            break;
        case 'bubble-sort':
            container.innerHTML = getSortingHTML('Bubble Sort');
            initSorting('bubble');
            break;
        case 'quick-sort':
            container.innerHTML = getSortingHTML('Quick Sort');
            initSorting('quick');
            break;
        case 'merge-sort':
            container.innerHTML = getSortingHTML('Merge Sort');
            initSorting('merge');
            break;
        case 'selection-sort':
            container.innerHTML = getSortingHTML('Selection Sort');
            initSorting('selection');
            break;
        case 'insertion-sort':
            container.innerHTML = getSortingHTML('Insertion Sort');
            initSorting('insertion');
            break;
        case 'linear-search':
            container.innerHTML = getSearchingHTML('Linear Search');
            initSearching('linear');
            break;
        case 'binary-search':
            container.innerHTML = getSearchingHTML('Binary Search');
            initSearching('binary');
            break;
    }
}

function updateStepIndicator(message) {
    const indicator = document.getElementById('step-indicator');
    if (indicator) {
        indicator.innerHTML = `<h5>Current Step</h5><p>${message}</p>`;
    }
}

function updateMetrics(comparisons, swaps) {
    const compEl = document.getElementById('comparisons');
    const swapEl = document.getElementById('swaps');
    if (compEl) compEl.textContent = comparisons;
    if (swapEl) swapEl.textContent = swaps;
}

function generateRandomArray(size = 10, min = 5, max = 100) {
    const arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return arr;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function setAnimationSpeed(value) {
    animationSpeed = 1100 - value;
    document.getElementById('speed-value').textContent = `${value}%`;
}

function getCommonControlsHTML() {
    return `
        <div class="control-section">
            <h4>Speed Control</h4>
            <div class="speed-control">
                <input type="range" min="100" max="1000" value="600" onchange="setAnimationSpeed(this.value)">
                <span id="speed-value">60%</span>
            </div>
        </div>
        <div class="control-section">
            <h4>Performance Metrics</h4>
            <div class="metrics">
                <div class="metric">
                    <div class="metric-value" id="comparisons">0</div>
                    <div class="metric-label">Comparisons</div>
                </div>
                <div class="metric">
                    <div class="metric-value" id="swaps">0</div>
                    <div class="metric-label">Operations</div>
                </div>
            </div>
        </div>
    `;
}

function getChallengeBannerHTML() {
    return `
        <div class="challenge-banner ${currentMode === 'challenge' ? 'active' : ''}">
            <div class="challenge-header">
                <h5><i class="fas fa-trophy"></i> Challenge Mode Active</h5>
                <p>Answer questions to test your understanding!</p>
            </div>
            <div class="challenge-stats">
                <div class="challenge-stat">
                    <span class="stat-value" id="challenge-score">${challengeScore}</span>
                    <span class="stat-label">Score</span>
                </div>
                <div class="challenge-stat">
                    <span class="stat-value" id="challenge-streak">${challengeStreak}</span>
                    <span class="stat-label">Streak</span>
                </div>
                <div class="challenge-stat">
                    <span class="stat-value" id="challenge-accuracy">0%</span>
                    <span class="stat-label">Accuracy</span>
                </div>
                <div class="challenge-stat">
                    <span class="stat-value" id="challenge-timer">00:00</span>
                    <span class="stat-label">Time</span>
                </div>
            </div>
            <div class="challenge-question-area" id="challenge-question-area"></div>
        </div>
    `;
}

let challengeTimer = null;
let challengeSeconds = 0;

function startChallengeTimer() {
    if (currentMode !== 'challenge') return;
    challengeSeconds = 0;
    updateChallengeTimer();
    challengeTimer = setInterval(() => {
        challengeSeconds++;
        updateChallengeTimer();
    }, 1000);
}

function stopChallengeTimer() {
    if (challengeTimer) {
        clearInterval(challengeTimer);
        challengeTimer = null;
    }
}

function updateChallengeTimer() {
    const timerEl = document.getElementById('challenge-timer');
    if (timerEl) {
        const mins = Math.floor(challengeSeconds / 60).toString().padStart(2, '0');
        const secs = (challengeSeconds % 60).toString().padStart(2, '0');
        timerEl.textContent = `${mins}:${secs}`;
    }
}
