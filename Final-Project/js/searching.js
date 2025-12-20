let searchArray = [];
let searchComparisons = 0;
let searchingInProgress = false;
let currentSearchType = '';

function getSearchingHTML(searchName) {
    return `
        <div class="module-header">
            <div class="module-title">
                <button class="back-btn" onclick="showDashboard()">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
                <h2>${searchName}</h2>
            </div>
        </div>
        ${getChallengeBannerHTML()}
        <div class="module-content">
            <div class="control-panel">
                <div class="control-section">
                    <h4>Array Size</h4>
                    <div class="input-group">
                        <input type="number" id="search-array-size" placeholder="Size (5-30)" value="15" min="5" max="30">
                        <button class="btn btn-primary" onclick="generateSearchArray()">
                            <i class="fas fa-random"></i>
                        </button>
                    </div>
                </div>
                <div class="control-section">
                    <h4>Search Value</h4>
                    <div class="input-group">
                        <input type="number" id="search-target" placeholder="Target value">
                        <button class="btn btn-success" onclick="startSearching()">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>
                <div class="control-section">
                    <h4>Custom Array</h4>
                    <div class="input-group">
                        <input type="text" id="search-custom-array" placeholder="e.g., 5,3,8,1,9">
                    </div>
                    <button class="btn btn-secondary btn-block" onclick="setCustomSearchArray()" style="margin-top: 0.5rem;">
                        <i class="fas fa-check"></i> Set Array
                    </button>
                </div>
                ${getCommonControlsHTML()}
                <div class="control-section">
                    <h4>Algorithm Info</h4>
                    <div class="info-box">
                        <h5 id="search-info-title">${searchName}</h5>
                        <p id="search-info-desc">${getSearchDescription(searchName)}</p>
                    </div>
                </div>
            </div>
            <div class="visualization-area">
                <div class="array-container" id="search-array-visual"></div>
                <div class="step-indicator" id="step-indicator">
                    <h5>Current Step</h5>
                    <p>Generate an array, enter a target value, and click Search.</p>
                </div>
            </div>
        </div>
    `;
}

function getSearchDescription(searchName) {
    const descriptions = {
        'Linear Search': 'Sequentially checks each element of the list until a match is found or the list is exhausted. Works on unsorted arrays.',
        'Binary Search': 'Efficient algorithm that repeatedly divides the search interval in half. Requires a sorted array. Time complexity: O(log n).'
    };
    return descriptions[searchName] || '';
}

function initSearching(type) {
    currentSearchType = type;
    searchArray = [];
    searchComparisons = 0;
    searchingInProgress = false;
    generateSearchArray();
}

function generateSearchArray() {
    const sizeInput = document.getElementById('search-array-size');
    const size = Math.min(30, Math.max(5, parseInt(sizeInput.value) || 15));
    
    searchArray = generateRandomArray(size, 1, 99);
    
    if (currentSearchType === 'binary') {
        searchArray.sort((a, b) => a - b);
    }
    
    searchComparisons = 0;
    renderSearchArray();
    updateMetrics(0, 0);
    
    const sortedNote = currentSearchType === 'binary' ? ' (sorted for binary search)' : '';
    updateStepIndicator(`Array generated${sortedNote}. Enter a target value and click Search.`);
}

function setCustomSearchArray() {
    const input = document.getElementById('search-custom-array');
    const values = input.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
    
    if (values.length < 2) {
        updateStepIndicator('Please enter at least 2 numbers separated by commas.');
        return;
    }
    
    searchArray = values;
    
    if (currentSearchType === 'binary') {
        searchArray.sort((a, b) => a - b);
        updateStepIndicator('Custom array set and sorted for binary search.');
    } else {
        updateStepIndicator('Custom array set. Enter a target value and click Search.');
    }
    
    searchComparisons = 0;
    renderSearchArray();
    updateMetrics(0, 0);
    input.value = '';
}

function renderSearchArray(current = -1, left = -1, right = -1, found = -1, checked = []) {
    const container = document.getElementById('search-array-visual');
    if (!container) return;
    
    container.innerHTML = '';
    const maxVal = Math.max(...searchArray);
    const barWidth = Math.max(30, Math.min(60, (container.clientWidth - 100) / searchArray.length));
    
    searchArray.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'array-bar';
        bar.style.height = `${(value / maxVal) * 280}px`;
        bar.style.width = `${barWidth}px`;
        
        if (index === found) {
            bar.classList.add('found');
        } else if (index === current) {
            bar.classList.add('current');
        } else if (checked.includes(index)) {
            bar.style.opacity = '0.4';
        }
        
        if (currentSearchType === 'binary') {
            if (index === left || index === right) {
                bar.style.borderBottom = '3px solid var(--warning)';
            }
        }
        
        const valueLabel = document.createElement('span');
        valueLabel.className = 'value';
        valueLabel.textContent = value;
        bar.appendChild(valueLabel);
        
        const indexLabel = document.createElement('span');
        indexLabel.style.position = 'absolute';
        indexLabel.style.top = '-20px';
        indexLabel.style.fontSize = '0.7rem';
        indexLabel.style.color = 'var(--text-muted)';
        indexLabel.textContent = index;
        bar.appendChild(indexLabel);
        
        container.appendChild(bar);
    });
}

async function startSearching() {
    const targetInput = document.getElementById('search-target');
    const target = parseInt(targetInput.value);
    
    if (isNaN(target)) {
        updateStepIndicator('Please enter a valid target value.');
        return;
    }
    
    if (searchArray.length === 0) {
        generateSearchArray();
    }
    
    searchingInProgress = true;
    searchComparisons = 0;
    
    startChallengeTimer();
    
    let result;
    if (currentSearchType === 'linear') {
        result = await linearSearch(target);
    } else {
        result = await binarySearch(target);
    }
    
    searchingInProgress = false;
    stopChallengeTimer();
    
    if (result >= 0) {
        renderSearchArray(-1, -1, -1, result);
        updateStepIndicator(`Target ${target} found at index ${result}! Total comparisons: ${searchComparisons}`);
    } else {
        updateStepIndicator(`Target ${target} not found in the array. Total comparisons: ${searchComparisons}`);
    }
    
    targetInput.value = '';
}

async function linearSearch(target) {
    const checked = [];
    
    if (currentMode === 'challenge') {
        await askChallengeQuestion(
            `Linear Search has what time complexity?`,
            ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
            2
        );
        
        await askChallengeQuestion(
            `Searching for ${target} in array of ${searchArray.length} elements. Where do we start?`,
            ['Index 0 (first element)', 'Index ' + (searchArray.length - 1) + ' (last element)', 'Middle element', 'Random position'],
            0
        );
    }
    
    for (let i = 0; i < searchArray.length; i++) {
        if (!searchingInProgress) return -1;
        
        searchComparisons++;
        updateMetrics(searchComparisons, 0);
        
        renderSearchArray(i, -1, -1, -1, checked);
        
        if (currentMode === 'challenge') {
            const isMatch = searchArray[i] === target;
            await askChallengeQuestion(
                `Checking index ${i}: ${searchArray[i]} == ${target}?`,
                [isMatch ? 'Yes, found it!' : 'No, continue searching', isMatch ? 'No, continue' : 'Yes, found it!', 'Skip this element', 'Go backwards'],
                0
            );
        }
        
        updateStepIndicator(`Checking index ${i}: Is ${searchArray[i]} equal to ${target}?`);
        await sleep(animationSpeed);
        
        if (searchArray[i] === target) {
            if (currentMode === 'challenge') {
                await askChallengeQuestion(
                    `Found ${target} at index ${i}! How many comparisons did we need?`,
                    [`${searchComparisons} comparisons`, `${searchArray.length} comparisons`, '1 comparison', `${i} comparisons`],
                    0
                );
            }
            return i;
        }
        
        checked.push(i);
        updateStepIndicator(`${searchArray[i]} ≠ ${target}. Moving to next element.`);
        await sleep(animationSpeed / 2);
    }
    
    if (currentMode === 'challenge') {
        await askChallengeQuestion(
            `${target} was not found. How many elements did we check?`,
            [`All ${searchArray.length} elements`, 'Half of the elements', 'Only first element', 'None'],
            0
        );
    }
    
    return -1;
}

async function binarySearch(target) {
    let left = 0;
    let right = searchArray.length - 1;
    const checked = [];
    
    if (currentMode === 'challenge') {
        await askChallengeQuestion(
            `Binary Search requires the array to be:`,
            ['Sorted', 'Unsorted', 'Contains unique elements', 'Contains duplicates'],
            0
        );
        
        const mid = Math.floor((left + right) / 2);
        await askChallengeQuestion(
            `Array has ${searchArray.length} elements [${left}..${right}]. Where do we start searching?`,
            [`Middle index ${mid}`, 'Index 0', `Index ${right}`, 'Random index'],
            0
        );
    }
    
    while (left <= right) {
        if (!searchingInProgress) return -1;
        
        const mid = Math.floor((left + right) / 2);
        searchComparisons++;
        updateMetrics(searchComparisons, 0);
        
        if (currentMode === 'challenge' && searchComparisons > 1) {
            await askChallengeQuestion(
                `Current search range is [${left}..${right}]. What is the middle index?`,
                [`${mid}`, `${left}`, `${right}`, `${Math.floor(searchArray.length / 2)}`],
                0
            );
        }
        
        renderSearchArray(mid, left, right, -1, checked);
        updateStepIndicator(`Checking middle index ${mid}: Is ${searchArray[mid]} equal to ${target}? (Search range: ${left} to ${right})`);
        await sleep(animationSpeed);
        
        if (searchArray[mid] === target) {
            if (currentMode === 'challenge') {
                await askChallengeQuestion(
                    `Found ${target}! We only needed ${searchComparisons} comparisons for ${searchArray.length} elements. Why so efficient?`,
                    ['We eliminated half each time', 'We got lucky', 'We checked every element', 'Target was at index 0'],
                    0
                );
            }
            return mid;
        }
        
        checked.push(mid);
        
        if (searchArray[mid] < target) {
            if (currentMode === 'challenge') {
                const newLeft = mid + 1;
                await askChallengeQuestion(
                    `${searchArray[mid]} < ${target}. Target must be in which range?`,
                    [`[${newLeft}..${right}] (right half)`, `[${left}..${mid - 1}] (left half)`, 'Could be anywhere', 'Not in array'],
                    0
                );
            }
            updateStepIndicator(`${searchArray[mid]} < ${target}. Target is in the right half. Eliminating left portion.`);
            left = mid + 1;
        } else {
            if (currentMode === 'challenge') {
                const newRight = mid - 1;
                await askChallengeQuestion(
                    `${searchArray[mid]} > ${target}. Target must be in which range?`,
                    [`[${left}..${newRight}] (left half)`, `[${mid + 1}..${right}] (right half)`, 'Could be anywhere', 'Not in array'],
                    0
                );
            }
            updateStepIndicator(`${searchArray[mid]} > ${target}. Target is in the left half. Eliminating right portion.`);
            right = mid - 1;
        }
        
        await sleep(animationSpeed);
    }
    
    if (currentMode === 'challenge') {
        await askChallengeQuestion(
            `${target} not found after ${searchComparisons} comparisons. What does left > right mean?`,
            ['Search range is empty - element not in array', 'Need to search again', 'Element is at index 0', 'Array needs re-sorting'],
            0
        );
    }
    
    return -1;
}
