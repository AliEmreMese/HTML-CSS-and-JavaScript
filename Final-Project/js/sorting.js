let sortArray = [];
let sortComparisons = 0;
let sortSwaps = 0;
let sortingInProgress = false;
let sortPaused = false;
let currentSortType = '';

function getSortingHTML(sortName) {
    return `
        <div class="module-header">
            <div class="module-title">
                <button class="back-btn" onclick="showDashboard()">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
                <h2>${sortName}</h2>
            </div>
        </div>
        ${getChallengeBannerHTML()}
        <div class="module-content">
            <div class="control-panel">
                <div class="control-section">
                    <h4>Array Size</h4>
                    <div class="input-group">
                        <input type="number" id="sort-array-size" placeholder="Size (5-50)" value="15" min="5" max="50">
                        <button class="btn btn-primary" onclick="generateSortArray()">
                            <i class="fas fa-random"></i>
                        </button>
                    </div>
                </div>
                <div class="control-section">
                    <h4>Custom Array</h4>
                    <div class="input-group">
                        <input type="text" id="sort-custom-array" placeholder="e.g., 5,3,8,1,9">
                    </div>
                    <button class="btn btn-secondary btn-block" onclick="setCustomArray()" style="margin-top: 0.5rem;">
                        <i class="fas fa-check"></i> Set Array
                    </button>
                </div>
                <div class="control-section">
                    <h4>Controls</h4>
                    <div class="btn-group">
                        <button class="btn btn-success" id="sort-start-btn" onclick="startSorting()">
                            <i class="fas fa-play"></i> Start
                        </button>
                        <button class="btn btn-warning" id="sort-pause-btn" onclick="togglePause()" disabled>
                            <i class="fas fa-pause"></i> Pause
                        </button>
                    </div>
                    <button class="btn btn-secondary btn-block" onclick="resetSort()" style="margin-top: 0.5rem;">
                        <i class="fas fa-redo"></i> Reset
                    </button>
                </div>
                ${getCommonControlsHTML()}
                <div class="control-section">
                    <h4>Algorithm Info</h4>
                    <div class="info-box">
                        <h5 id="sort-info-title">${sortName}</h5>
                        <p id="sort-info-desc">${getSortDescription(sortName)}</p>
                    </div>
                </div>
            </div>
            <div class="visualization-area">
                <div class="array-container" id="sort-array-visual"></div>
                <div class="step-indicator" id="step-indicator">
                    <h5>Current Step</h5>
                    <p>Generate an array and click Start to begin sorting.</p>
                </div>
            </div>
        </div>
    `;
}

function getSortDescription(sortName) {
    const descriptions = {
        'Bubble Sort': 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in wrong order.',
        'Quick Sort': 'Picks a pivot element and partitions the array around it, recursively sorting the partitions.',
        'Merge Sort': 'Divides the array into halves, recursively sorts them, then merges the sorted halves.',
        'Selection Sort': 'Finds the minimum element and places it at the beginning, then repeats for the remaining array.',
        'Insertion Sort': 'Builds the sorted array one element at a time by inserting each element into its correct position.'
    };
    return descriptions[sortName] || '';
}

function initSorting(type) {
    currentSortType = type;
    sortArray = [];
    sortComparisons = 0;
    sortSwaps = 0;
    sortingInProgress = false;
    sortPaused = false;
    generateSortArray();
}

function generateSortArray() {
    const sizeInput = document.getElementById('sort-array-size');
    const size = Math.min(50, Math.max(5, parseInt(sizeInput.value) || 15));
    
    sortArray = generateRandomArray(size, 10, 100);
    sortComparisons = 0;
    sortSwaps = 0;
    renderSortArray();
    updateMetrics(0, 0);
    updateStepIndicator('Array generated. Click Start to begin sorting.');
}

function setCustomArray() {
    const input = document.getElementById('sort-custom-array');
    const values = input.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
    
    if (values.length < 2) {
        updateStepIndicator('Please enter at least 2 numbers separated by commas.');
        return;
    }
    
    sortArray = values;
    sortComparisons = 0;
    sortSwaps = 0;
    renderSortArray();
    updateMetrics(0, 0);
    updateStepIndicator('Custom array set. Click Start to begin sorting.');
    input.value = '';
}

function renderSortArray(comparing = [], swapping = [], sorted = []) {
    const container = document.getElementById('sort-array-visual');
    if (!container) return;
    
    container.innerHTML = '';
    const maxVal = Math.max(...sortArray);
    const barWidth = Math.max(20, Math.min(60, (container.clientWidth - 100) / sortArray.length));
    
    sortArray.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'array-bar';
        bar.style.height = `${(value / maxVal) * 280}px`;
        bar.style.width = `${barWidth}px`;
        
        if (sorted.includes(index)) {
            bar.classList.add('sorted');
        } else if (swapping.includes(index)) {
            bar.classList.add('swapping');
        } else if (comparing.includes(index)) {
            bar.classList.add('comparing');
        }
        
        const valueLabel = document.createElement('span');
        valueLabel.className = 'value';
        valueLabel.textContent = value;
        bar.appendChild(valueLabel);
        
        container.appendChild(bar);
    });
}

async function startSorting() {
    if (sortingInProgress) return;
    if (sortArray.length === 0) {
        generateSortArray();
    }
    
    sortingInProgress = true;
    sortPaused = false;
    sortComparisons = 0;
    sortSwaps = 0;
    
    document.getElementById('sort-start-btn').disabled = true;
    document.getElementById('sort-pause-btn').disabled = false;
    
    startChallengeTimer();
    
    switch(currentSortType) {
        case 'bubble':
            await bubbleSort();
            break;
        case 'quick':
            await quickSort(0, sortArray.length - 1);
            break;
        case 'merge':
            await mergeSort(0, sortArray.length - 1);
            break;
        case 'selection':
            await selectionSort();
            break;
        case 'insertion':
            await insertionSort();
            break;
    }
    
    renderSortArray([], [], [...Array(sortArray.length).keys()]);
    updateStepIndicator(`Sorting complete! ${sortComparisons} comparisons, ${sortSwaps} swaps.`);
    
    sortingInProgress = false;
    document.getElementById('sort-start-btn').disabled = false;
    document.getElementById('sort-pause-btn').disabled = true;
    stopChallengeTimer();
}

function togglePause() {
    sortPaused = !sortPaused;
    const btn = document.getElementById('sort-pause-btn');
    if (sortPaused) {
        btn.innerHTML = '<i class="fas fa-play"></i> Resume';
        updateStepIndicator('Sorting paused. Click Resume to continue.');
    } else {
        btn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    }
}

function resetSort() {
    sortingInProgress = false;
    sortPaused = false;
    sortComparisons = 0;
    sortSwaps = 0;
    generateSortArray();
    document.getElementById('sort-start-btn').disabled = false;
    document.getElementById('sort-pause-btn').disabled = true;
    document.getElementById('sort-pause-btn').innerHTML = '<i class="fas fa-pause"></i> Pause';
    stopChallengeTimer();
}

async function waitWhilePaused() {
    while (sortPaused && sortingInProgress) {
        await sleep(100);
    }
}

async function bubbleSort() {
    const n = sortArray.length;
    
    if (currentMode === 'challenge') {
        await askChallengeQuestion(
            `Bubble Sort compares adjacent elements. How many passes will it need for ${n} elements in the worst case?`,
            [`${n - 1} passes`, `${n} passes`, `${n * n} passes`, `log(${n}) passes`],
            0
        );
    }
    
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            if (!sortingInProgress) return;
            await waitWhilePaused();
            
            sortComparisons++;
            const sortedIndices = [];
            for (let k = n - i; k < n; k++) {
                sortedIndices.push(k);
            }
            renderSortArray([j, j + 1], [], sortedIndices);
            updateStepIndicator(`Comparing elements at index ${j} (${sortArray[j]}) and ${j + 1} (${sortArray[j + 1]})`);
            updateMetrics(sortComparisons, sortSwaps);
            await sleep(animationSpeed);
            
            if (sortArray[j] > sortArray[j + 1]) {
                if (currentMode === 'challenge') {
                    await askChallengeQuestion(
                        `${sortArray[j]} > ${sortArray[j + 1]}. What should happen next?`,
                        ['Swap them', 'Keep them as is', 'Move to next pair', 'Restart from beginning'],
                        0
                    );
                }
                
                sortSwaps++;
                swapped = true;
                renderSortArray([], [j, j + 1], sortedIndices);
                updateStepIndicator(`Swapping ${sortArray[j]} and ${sortArray[j + 1]}`);
                
                [sortArray[j], sortArray[j + 1]] = [sortArray[j + 1], sortArray[j]];
                
                updateMetrics(sortComparisons, sortSwaps);
                await sleep(animationSpeed);
            } else if (currentMode === 'challenge' && Math.random() < 0.3) {
                await askChallengeQuestion(
                    `${sortArray[j]} ≤ ${sortArray[j + 1]}. What should happen?`,
                    ['No swap needed, move to next', 'Swap anyway', 'Go back to start', 'Skip this element'],
                    0
                );
            }
        }
        
        if (currentMode === 'challenge' && i < n - 2) {
            await askChallengeQuestion(
                `Pass ${i + 1} complete. Which element is now in its final position?`,
                [`${sortArray[n - i - 1]} at index ${n - i - 1}`, `${sortArray[0]} at index 0`, `${sortArray[i]} at index ${i}`, 'None yet'],
                0
            );
        }
        
        if (!swapped) {
            if (currentMode === 'challenge') {
                await askChallengeQuestion(
                    'No swaps were made in this pass. What does this mean?',
                    ['Array is now sorted', 'Need one more pass', 'Start over', 'Remove last element'],
                    0
                );
            }
            updateStepIndicator('No swaps needed in this pass. Array is sorted!');
            break;
        }
    }
}

async function quickSort(low, high) {
    if (low < high && sortingInProgress) {
        if (currentMode === 'challenge' && low === 0 && high === sortArray.length - 1) {
            await askChallengeQuestion(
                'Quick Sort uses which strategy?',
                ['Divide and Conquer', 'Greedy', 'Dynamic Programming', 'Backtracking'],
                0
            );
        }
        const pivotIndex = await partition(low, high);
        
        if (currentMode === 'challenge') {
            await askChallengeQuestion(
                `Pivot ${sortArray[pivotIndex]} is now at index ${pivotIndex}. What happens next?`,
                [`Sort left (${low}-${pivotIndex-1}) and right (${pivotIndex+1}-${high}) subarrays`, 'Sort only left subarray', 'Sort only right subarray', 'Done sorting'],
                0
            );
        }
        
        await quickSort(low, pivotIndex - 1);
        await quickSort(pivotIndex + 1, high);
    }
}

async function partition(low, high) {
    const pivot = sortArray[high];
    
    if (currentMode === 'challenge') {
        await askChallengeQuestion(
            `Pivot selected: ${pivot}. What will happen to elements smaller than ${pivot}?`,
            ['Move to left of pivot', 'Move to right of pivot', 'Stay in place', 'Get removed'],
            0
        );
    }
    
    updateStepIndicator(`Pivot selected: ${pivot} at index ${high}`);
    
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        if (!sortingInProgress) return i + 1;
        await waitWhilePaused();
        
        sortComparisons++;
        renderSortArray([j, high], [], []);
        updateStepIndicator(`Comparing ${sortArray[j]} with pivot ${pivot}`);
        updateMetrics(sortComparisons, sortSwaps);
        await sleep(animationSpeed);
        
        if (sortArray[j] < pivot) {
            if (currentMode === 'challenge') {
                await askChallengeQuestion(
                    `${sortArray[j]} < ${pivot}. What should we do?`,
                    [`Move ${sortArray[j]} to left partition`, `Keep ${sortArray[j]} in place`, `Swap with pivot`, `Skip this element`],
                    0
                );
            }
            i++;
            if (i !== j) {
                sortSwaps++;
                renderSortArray([], [i, j]);
                updateStepIndicator(`Swapping ${sortArray[i]} and ${sortArray[j]}`);
                
                [sortArray[i], sortArray[j]] = [sortArray[j], sortArray[i]];
                
                updateMetrics(sortComparisons, sortSwaps);
                await sleep(animationSpeed);
            }
        } else if (currentMode === 'challenge' && Math.random() < 0.3) {
            await askChallengeQuestion(
                `${sortArray[j]} >= ${pivot}. What happens to this element?`,
                ['Stays in right partition', 'Moves to left partition', 'Gets swapped with pivot', 'Gets removed'],
                0
            );
        }
    }
    
    if (currentMode === 'challenge') {
        await askChallengeQuestion(
            `Partitioning done. Where will pivot ${pivot} be placed?`,
            [`Index ${i + 1}`, `Index ${low}`, `Index ${high}`, `Index ${Math.floor((low + high) / 2)}`],
            0
        );
    }
    
    sortSwaps++;
    renderSortArray([], [i + 1, high]);
    updateStepIndicator(`Placing pivot ${pivot} at correct position ${i + 1}`);
    
    [sortArray[i + 1], sortArray[high]] = [sortArray[high], sortArray[i + 1]];
    
    updateMetrics(sortComparisons, sortSwaps);
    await sleep(animationSpeed);
    
    return i + 1;
}

async function mergeSort(left, right) {
    if (left < right && sortingInProgress) {
        if (currentMode === 'challenge' && left === 0 && right === sortArray.length - 1) {
            await askChallengeQuestion(
                'What is the time complexity of Merge Sort?',
                ['O(n²)', 'O(n log n)', 'O(n)', 'O(log n)'],
                1
            );
        }
        
        const mid = Math.floor((left + right) / 2);
        
        if (currentMode === 'challenge') {
            await askChallengeQuestion(
                `Array [${left}..${right}] will be divided. Where is the midpoint?`,
                [`Index ${mid}`, `Index ${left}`, `Index ${right}`, `Index ${left + 1}`],
                0
            );
        }
        
        updateStepIndicator(`Dividing array from index ${left} to ${right}, mid = ${mid}`);
        await sleep(animationSpeed / 2);
        
        await mergeSort(left, mid);
        await mergeSort(mid + 1, right);
        await merge(left, mid, right);
    }
}

async function merge(left, mid, right) {
    if (!sortingInProgress) return;
    
    const leftArr = sortArray.slice(left, mid + 1);
    const rightArr = sortArray.slice(mid + 1, right + 1);
    
    if (currentMode === 'challenge') {
        await askChallengeQuestion(
            `Merging [${leftArr.join(',')}] and [${rightArr.join(',')}]. How does merge work?`,
            ['Compare first elements, take smaller', 'Take all from left first', 'Take all from right first', 'Randomly pick elements'],
            0
        );
    }
    
    let i = 0, j = 0, k = left;
    
    while (i < leftArr.length && j < rightArr.length) {
        await waitWhilePaused();
        if (!sortingInProgress) return;
        
        sortComparisons++;
        renderSortArray([left + i, mid + 1 + j]);
        updateStepIndicator(`Merging: Comparing ${leftArr[i]} and ${rightArr[j]}`);
        updateMetrics(sortComparisons, sortSwaps);
        await sleep(animationSpeed);
        
        if (currentMode === 'challenge') {
            const smaller = leftArr[i] <= rightArr[j] ? leftArr[i] : rightArr[j];
            const fromLeft = leftArr[i] <= rightArr[j];
            await askChallengeQuestion(
                `Comparing ${leftArr[i]} and ${rightArr[j]}. Which one goes next?`,
                [`${smaller} (from ${fromLeft ? 'left' : 'right'} array)`, `${fromLeft ? rightArr[j] : leftArr[i]} (from ${fromLeft ? 'right' : 'left'} array)`, 'Both at same time', 'Skip both'],
                0
            );
        }
        
        if (leftArr[i] <= rightArr[j]) {
            sortArray[k] = leftArr[i];
            i++;
        } else {
            sortArray[k] = rightArr[j];
            j++;
        }
        sortSwaps++;
        k++;
        renderSortArray();
        updateMetrics(sortComparisons, sortSwaps);
    }
    
    while (i < leftArr.length) {
        sortArray[k] = leftArr[i];
        sortSwaps++;
        i++;
        k++;
    }
    
    while (j < rightArr.length) {
        sortArray[k] = rightArr[j];
        sortSwaps++;
        j++;
        k++;
    }
    
    renderSortArray();
    updateStepIndicator(`Merged subarray from index ${left} to ${right}`);
    updateMetrics(sortComparisons, sortSwaps);
    await sleep(animationSpeed);
}

async function selectionSort() {
    const n = sortArray.length;
    
    if (currentMode === 'challenge') {
        await askChallengeQuestion(
            'Selection Sort works by:',
            ['Finding minimum and placing it at start', 'Swapping adjacent elements', 'Dividing array in half', 'Building sorted array from end'],
            0
        );
    }
    
    for (let i = 0; i < n - 1; i++) {
        if (!sortingInProgress) return;
        
        let minIdx = i;
        const sortedIndices = [];
        for (let k = 0; k < i; k++) {
            sortedIndices.push(k);
        }
        
        if (currentMode === 'challenge') {
            await askChallengeQuestion(
                `Starting pass ${i + 1}. We need to find minimum in unsorted portion [${i}..${n-1}]. Current element is ${sortArray[i]}. What do we do?`,
                ['Scan all remaining elements for minimum', 'Compare only with next element', 'Swap with last element', 'Skip this position'],
                0
            );
        }
        
        updateStepIndicator(`Finding minimum element starting from index ${i}`);
        
        for (let j = i + 1; j < n; j++) {
            await waitWhilePaused();
            if (!sortingInProgress) return;
            
            sortComparisons++;
            renderSortArray([minIdx, j], [], sortedIndices);
            updateStepIndicator(`Comparing ${sortArray[j]} with current minimum ${sortArray[minIdx]}`);
            updateMetrics(sortComparisons, sortSwaps);
            await sleep(animationSpeed);
            
            if (sortArray[j] < sortArray[minIdx]) {
                if (currentMode === 'challenge') {
                    await askChallengeQuestion(
                        `Found ${sortArray[j]} < ${sortArray[minIdx]}. What should we update?`,
                        ['Update minimum index to ' + j, 'Swap them immediately', 'Ignore and continue', 'Stop searching'],
                        0
                    );
                }
                minIdx = j;
                updateStepIndicator(`New minimum found: ${sortArray[minIdx]} at index ${minIdx}`);
            }
        }
        
        if (minIdx !== i) {
            if (currentMode === 'challenge') {
                await askChallengeQuestion(
                    `Minimum ${sortArray[minIdx]} found at index ${minIdx}. Where should it go?`,
                    [`Index ${i} (beginning of unsorted)`, `Index ${n-1} (end of array)`, `Stay at index ${minIdx}`, `Index 0`],
                    0
                );
            }
            
            sortSwaps++;
            renderSortArray([], [i, minIdx], sortedIndices);
            updateStepIndicator(`Swapping ${sortArray[i]} with minimum ${sortArray[minIdx]}`);
            
            [sortArray[i], sortArray[minIdx]] = [sortArray[minIdx], sortArray[i]];
            
            updateMetrics(sortComparisons, sortSwaps);
            await sleep(animationSpeed);
        } else if (currentMode === 'challenge') {
            await askChallengeQuestion(
                `${sortArray[i]} is already the minimum. What happens?`,
                ['No swap needed', 'Swap with itself', 'Move to next pass', 'Restart search'],
                0
            );
        }
    }
}

async function insertionSort() {
    const n = sortArray.length;
    
    if (currentMode === 'challenge') {
        await askChallengeQuestion(
            'Insertion Sort is best for:',
            ['Nearly sorted arrays', 'Completely random arrays', 'Arrays with many duplicates', 'Very large arrays'],
            0
        );
    }
    
    for (let i = 1; i < n; i++) {
        if (!sortingInProgress) return;
        
        const key = sortArray[i];
        let j = i - 1;
        
        const sortedIndices = [];
        for (let k = 0; k < i; k++) {
            sortedIndices.push(k);
        }
        
        if (currentMode === 'challenge') {
            const sortedPart = sortArray.slice(0, i);
            await askChallengeQuestion(
                `Key is ${key}. Sorted portion is [${sortedPart.join(', ')}]. Where will ${key} be inserted?`,
                [
                    `Find correct position in sorted portion`,
                    `Always at the beginning`,
                    `Always at the end`,
                    `Replace the largest element`
                ],
                0
            );
        }
        
        updateStepIndicator(`Inserting ${key} into sorted portion`);
        renderSortArray([i], [], sortedIndices);
        await sleep(animationSpeed);
        
        let shifted = false;
        while (j >= 0 && sortArray[j] > key) {
            await waitWhilePaused();
            if (!sortingInProgress) return;
            
            if (currentMode === 'challenge' && !shifted) {
                await askChallengeQuestion(
                    `${sortArray[j]} > ${key}. What should happen to ${sortArray[j]}?`,
                    ['Shift it one position right', 'Swap with key', 'Remove it', 'Keep it in place'],
                    0
                );
                shifted = true;
            }
            
            sortComparisons++;
            renderSortArray([j, j + 1], [], []);
            updateStepIndicator(`${sortArray[j]} > ${key}, shifting ${sortArray[j]} right`);
            updateMetrics(sortComparisons, sortSwaps);
            await sleep(animationSpeed);
            
            sortArray[j + 1] = sortArray[j];
            sortSwaps++;
            j--;
            
            renderSortArray();
            updateMetrics(sortComparisons, sortSwaps);
        }
        
        if (currentMode === 'challenge') {
            await askChallengeQuestion(
                `Found the correct position. ${key} will be placed at index ${j + 1}. Why here?`,
                [`All elements to left are ≤ ${key}`, `It's the first empty spot`, `Random position`, `Always place at j+1`],
                0
            );
        }
        
        sortArray[j + 1] = key;
        const newSortedIndices = [];
        for (let k = 0; k <= i; k++) {
            newSortedIndices.push(k);
        }
        renderSortArray([], [], newSortedIndices);
        updateStepIndicator(`Inserted ${key} at position ${j + 1}`);
        await sleep(animationSpeed);
    }
}
