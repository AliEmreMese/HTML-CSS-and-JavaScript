class Stack {
    constructor() {
        this.items = [];
        this.operations = 0;
    }

    push(value) {
        this.items.push(value);
        this.operations++;
    }

    pop() {
        if (this.isEmpty()) return null;
        this.operations++;
        return this.items.pop();
    }

    peek() {
        if (this.isEmpty()) return null;
        return this.items[this.items.length - 1];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }

    toArray() {
        return [...this.items];
    }

    clear() {
        this.items = [];
        this.operations = 0;
    }
}

class Queue {
    constructor() {
        this.items = [];
        this.operations = 0;
    }

    enqueue(value) {
        this.items.push(value);
        this.operations++;
    }

    dequeue() {
        if (this.isEmpty()) return null;
        this.operations++;
        return this.items.shift();
    }

    peek() {
        if (this.isEmpty()) return null;
        return this.items[0];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }

    toArray() {
        return [...this.items];
    }

    clear() {
        this.items = [];
        this.operations = 0;
    }
}

let stack = new Stack();
let queue = new Queue();

function getStackQueueHTML() {
    return `
        <div class="module-header">
            <div class="module-title">
                <button class="back-btn" onclick="showDashboard()">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
                <h2>Stacks & Queues</h2>
            </div>
        </div>
        ${getChallengeBannerHTML()}
        <div class="module-content">
            <div class="control-panel">
                <div class="control-section">
                    <h4>Stack Operations (LIFO)</h4>
                    <div class="input-group">
                        <input type="number" id="stack-value" placeholder="Value">
                    </div>
                    <div class="btn-group" style="margin-top: 0.5rem;">
                        <button class="btn btn-primary" onclick="stackPush()">
                            <i class="fas fa-arrow-up"></i> Push
                        </button>
                        <button class="btn btn-error" onclick="stackPop()">
                            <i class="fas fa-arrow-down"></i> Pop
                        </button>
                    </div>
                    <div class="btn-group" style="margin-top: 0.5rem;">
                        <button class="btn btn-secondary btn-block" onclick="stackPeek()">
                            <i class="fas fa-eye"></i> Peek
                        </button>
                    </div>
                </div>
                <div class="control-section">
                    <h4>Queue Operations (FIFO)</h4>
                    <div class="input-group">
                        <input type="number" id="queue-value" placeholder="Value">
                    </div>
                    <div class="btn-group" style="margin-top: 0.5rem;">
                        <button class="btn btn-primary" onclick="queueEnqueue()">
                            <i class="fas fa-arrow-right"></i> Enqueue
                        </button>
                        <button class="btn btn-error" onclick="queueDequeue()">
                            <i class="fas fa-arrow-left"></i> Dequeue
                        </button>
                    </div>
                    <div class="btn-group" style="margin-top: 0.5rem;">
                        <button class="btn btn-secondary btn-block" onclick="queuePeek()">
                            <i class="fas fa-eye"></i> Peek
                        </button>
                    </div>
                </div>
                <div class="control-section">
                    <h4>Actions</h4>
                    <div class="btn-group">
                        <button class="btn btn-secondary" onclick="sqGenerateRandom()">
                            <i class="fas fa-random"></i> Random
                        </button>
                        <button class="btn btn-secondary" onclick="sqClear()">
                            <i class="fas fa-eraser"></i> Clear
                        </button>
                    </div>
                </div>
                ${getCommonControlsHTML()}
            </div>
            <div class="visualization-area">
                <div class="stack-queue-container">
                    <div class="stack-visual">
                        <div class="structure-label"><i class="fas fa-layer-group"></i> Stack (LIFO)</div>
                        <div class="stack-labels" style="display: flex; justify-content: space-between; width: 120px; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.75rem; color: var(--text-muted);">← TOP</span>
                        </div>
                        <div class="stack-container" id="stack-visual"></div>
                    </div>
                    <div class="queue-visual">
                        <div class="structure-label"><i class="fas fa-stream"></i> Queue (FIFO)</div>
                        <div class="queue-labels" style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.75rem; color: var(--text-muted);">FRONT →</span>
                            <span style="font-size: 0.75rem; color: var(--text-muted);">→ REAR</span>
                        </div>
                        <div class="queue-container" id="queue-visual"></div>
                    </div>
                </div>
                <div class="step-indicator" id="step-indicator">
                    <h5>Current Step</h5>
                    <p>Stack: Last In, First Out (LIFO). Queue: First In, First Out (FIFO).</p>
                </div>
            </div>
        </div>
    `;
}

function initStackQueue() {
    stack = new Stack();
    queue = new Queue();
    renderStackQueue();
    updateMetrics(0, 0);
}

function stackPush() {
    const input = document.getElementById('stack-value');
    const value = parseInt(input.value);
    if (isNaN(value)) return;
    
    startChallengeTimer();
    updateStepIndicator(`Pushing ${value} onto the stack...`);
    
    if (currentMode === 'challenge') {
        askChallengeQuestion(
            'Stack follows which principle?',
            ['LIFO (Last In, First Out)', 'FIFO (First In, First Out)', 'Random Access', 'Priority Based'],
            0
        ).then(async () => {
            const stackSize = stack.size();
            await askChallengeQuestion(
                `Stack has ${stackSize} element(s). After pushing ${value}, where will it be?`,
                ['At the TOP of the stack', 'At the BOTTOM of the stack', 'In the middle', 'Replaces existing element'],
                0
            );
            
            stack.push(value);
            renderStackQueue();
            updateMetrics(0, stack.operations + queue.operations);
            
            await askChallengeQuestion(
                `${value} is now at TOP. What will be removed if we call pop()?`,
                [`${value} (the one we just added)`, stack.items.length > 1 ? `${stack.items[0]} (bottom)` : 'Nothing', 'Random element', 'All elements'],
                0
            );
            
            updateStepIndicator(`Value ${value} pushed onto stack. It is now at the TOP.`);
            stopChallengeTimer();
        });
    } else {
        setTimeout(() => {
            stack.push(value);
            renderStackQueue();
            updateMetrics(0, stack.operations + queue.operations);
            updateStepIndicator(`Value ${value} pushed onto stack. It is now at the TOP.`);
            stopChallengeTimer();
        }, animationSpeed);
    }
    
    input.value = '';
}

function stackPop() {
    if (stack.isEmpty()) {
        updateStepIndicator('Stack is empty! Cannot pop.');
        return;
    }
    
    startChallengeTimer();
    const topValue = stack.peek();
    const stackContent = [...stack.items];
    updateStepIndicator(`Popping ${topValue} from the stack...`);
    
    if (currentMode === 'challenge') {
        askChallengeQuestion(
            `Stack content (bottom to top): [${stackContent.join(', ')}]. Which element will pop() remove?`,
            [`${topValue} (Top - last element)`, `${stack.items[0]} (Bottom - first element)`, 'Middle element', 'All elements'],
            0
        ).then(async () => {
            const value = stack.pop();
            renderStackQueue();
            
            if (!stack.isEmpty()) {
                await askChallengeQuestion(
                    `After popping ${value}, what is the new TOP?`,
                    [`${stack.peek()}`, `${value}`, 'Stack is empty', `${stack.items[0]}`],
                    0
                );
            }
            
            updateMetrics(0, stack.operations + queue.operations);
            updateStepIndicator(`Value ${value} popped from stack. The TOP element was removed.`);
            stopChallengeTimer();
        });
    } else {
        setTimeout(() => {
            const value = stack.pop();
            renderStackQueue();
            updateMetrics(0, stack.operations + queue.operations);
            updateStepIndicator(`Value ${value} popped from stack. The TOP element was removed.`);
            stopChallengeTimer();
        }, animationSpeed);
    }
}

function stackPeek() {
    if (stack.isEmpty()) {
        updateStepIndicator('Stack is empty! Nothing to peek.');
        return;
    }
    
    if (currentMode === 'challenge') {
        askChallengeQuestion(
            `Stack content: [${stack.items.join(', ')}] (bottom to top). What will peek() return?`,
            [`${stack.peek()} (top element)`, `${stack.items[0]} (bottom element)`, 'All elements', 'Nothing'],
            0
        );
    }
    
    const value = stack.peek();
    updateStepIndicator(`Peek: The TOP element is ${value}. Stack unchanged.`);
    highlightStackTop();
}

function queueEnqueue() {
    const input = document.getElementById('queue-value');
    const value = parseInt(input.value);
    if (isNaN(value)) return;
    
    startChallengeTimer();
    updateStepIndicator(`Enqueueing ${value} to the queue...`);
    
    if (currentMode === 'challenge') {
        askChallengeQuestion(
            'Queue follows which principle?',
            ['FIFO (First In, First Out)', 'LIFO (Last In, First Out)', 'Random Access', 'Priority Based'],
            0
        ).then(async () => {
            await askChallengeQuestion(
                `Adding ${value} to queue. Where will it go?`,
                ['At the REAR (end) of queue', 'At the FRONT of queue', 'In the middle', 'Replace front element'],
                0
            );
            
            queue.enqueue(value);
            renderStackQueue();
            updateMetrics(0, stack.operations + queue.operations);
            
            await askChallengeQuestion(
                `${value} added to rear. What will dequeue() remove next?`,
                [`${queue.peek()} (front element)`, `${value} (rear element)`, 'Both front and rear', 'Nothing'],
                0
            );
            
            updateStepIndicator(`Value ${value} added to the REAR of the queue.`);
            stopChallengeTimer();
        });
    } else {
        setTimeout(() => {
            queue.enqueue(value);
            renderStackQueue();
            updateMetrics(0, stack.operations + queue.operations);
            updateStepIndicator(`Value ${value} added to the REAR of the queue.`);
            stopChallengeTimer();
        }, animationSpeed);
    }
    
    input.value = '';
}

function queueDequeue() {
    if (queue.isEmpty()) {
        updateStepIndicator('Queue is empty! Cannot dequeue.');
        return;
    }
    
    startChallengeTimer();
    const frontValue = queue.peek();
    const queueContent = [...queue.items];
    updateStepIndicator(`Dequeueing ${frontValue} from the queue...`);
    
    if (currentMode === 'challenge') {
        askChallengeQuestion(
            `Queue content (front to rear): [${queueContent.join(', ')}]. Which will be removed?`,
            [`${frontValue} (Front - first in)`, `${queue.items[queue.items.length - 1]} (Rear - last in)`, 'Middle element', 'All elements'],
            0
        ).then(async () => {
            const value = queue.dequeue();
            renderStackQueue();
            
            if (!queue.isEmpty()) {
                await askChallengeQuestion(
                    `After removing ${value}, what is the new FRONT?`,
                    [`${queue.peek()}`, `${value}`, 'Queue is empty', `${queue.items[queue.items.length - 1]}`],
                    0
                );
            }
            
            updateMetrics(0, stack.operations + queue.operations);
            updateStepIndicator(`Value ${value} removed from the FRONT of the queue.`);
            stopChallengeTimer();
        });
    } else {
        setTimeout(() => {
            const value = queue.dequeue();
            renderStackQueue();
            updateMetrics(0, stack.operations + queue.operations);
            updateStepIndicator(`Value ${value} removed from the FRONT of the queue.`);
            stopChallengeTimer();
        }, animationSpeed);
    }
}

function queuePeek() {
    if (queue.isEmpty()) {
        updateStepIndicator('Queue is empty! Nothing to peek.');
        return;
    }
    
    const value = queue.peek();
    updateStepIndicator(`Peek: The FRONT element is ${value}. Queue unchanged.`);
    highlightQueueFront();
}

function sqGenerateRandom() {
    stack.clear();
    queue.clear();
    
    const stackValues = generateRandomArray(5, 1, 99);
    const queueValues = generateRandomArray(5, 1, 99);
    
    stackValues.forEach(v => stack.push(v));
    queueValues.forEach(v => queue.enqueue(v));
    
    renderStackQueue();
    updateStepIndicator(`Generated random stack: [${stackValues.join(', ')}] and queue: [${queueValues.join(', ')}]`);
    updateMetrics(0, stack.operations + queue.operations);
}

function sqClear() {
    stack.clear();
    queue.clear();
    renderStackQueue();
    updateStepIndicator('Stack and Queue cleared. Ready for new operations.');
    updateMetrics(0, 0);
}

function renderStackQueue() {
    renderStack();
    renderQueue();
}

function renderStack() {
    const container = document.getElementById('stack-visual');
    if (!container) return;
    
    const items = stack.toArray();
    container.innerHTML = '';
    
    if (items.length === 0) {
        container.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 1rem;">Empty</div>';
        return;
    }
    
    items.forEach((value, index) => {
        const item = document.createElement('div');
        item.className = 'stack-item';
        if (index === items.length - 1) {
            item.style.background = 'var(--success)';
        }
        item.textContent = value;
        container.appendChild(item);
    });
}

function renderQueue() {
    const container = document.getElementById('queue-visual');
    if (!container) return;
    
    const items = queue.toArray();
    container.innerHTML = '';
    
    if (items.length === 0) {
        container.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 1rem; width: 100%;">Empty</div>';
        return;
    }
    
    items.forEach((value, index) => {
        const item = document.createElement('div');
        item.className = 'queue-item';
        if (index === 0) {
            item.style.background = 'var(--success)';
        } else if (index === items.length - 1) {
            item.style.background = 'var(--info)';
        }
        item.textContent = value;
        container.appendChild(item);
    });
}

function highlightStackTop() {
    const container = document.getElementById('stack-visual');
    const items = container.querySelectorAll('.stack-item');
    if (items.length > 0) {
        const topItem = items[items.length - 1];
        topItem.style.transform = 'scale(1.1)';
        topItem.style.boxShadow = '0 0 20px var(--success)';
        setTimeout(() => {
            topItem.style.transform = '';
            topItem.style.boxShadow = '';
        }, 1000);
    }
}

function highlightQueueFront() {
    const container = document.getElementById('queue-visual');
    const items = container.querySelectorAll('.queue-item');
    if (items.length > 0) {
        const frontItem = items[0];
        frontItem.style.transform = 'scale(1.1)';
        frontItem.style.boxShadow = '0 0 20px var(--success)';
        setTimeout(() => {
            frontItem.style.transform = '';
            frontItem.style.boxShadow = '';
        }, 1000);
    }
}
