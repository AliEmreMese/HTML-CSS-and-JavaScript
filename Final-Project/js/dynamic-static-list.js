class StaticList {
    constructor(capacity = 10) {
        this.capacity = capacity;
        this.items = new Array(capacity).fill(null);
        this.size = 0;
        this.operations = 0;
    }

    insert(index, value) {
        if (this.size >= this.capacity) {
            return { success: false, message: 'Static list is full! Cannot insert.' };
        }
        if (index < 0 || index > this.size) {
            return { success: false, message: 'Invalid index!' };
        }

        for (let i = this.size; i > index; i--) {
            this.items[i] = this.items[i - 1];
        }
        this.items[index] = value;
        this.size++;
        this.operations++;
        return { success: true, message: `Inserted ${value} at index ${index}. Size: ${this.size}/${this.capacity}` };
    }

    delete(index) {
        if (index < 0 || index >= this.size) {
            return { success: false, message: 'Invalid index!' };
        }

        const value = this.items[index];
        for (let i = index; i < this.size - 1; i++) {
            this.items[i] = this.items[i + 1];
        }
        this.items[this.size - 1] = null;
        this.size--;
        this.operations++;
        return { success: true, message: `Deleted ${value} from index ${index}. Size: ${this.size}/${this.capacity}` };
    }

    get(index) {
        if (index < 0 || index >= this.size) return null;
        return this.items[index];
    }

    toArray() {
        return this.items.slice(0, this.size);
    }

    clear() {
        this.items = new Array(this.capacity).fill(null);
        this.size = 0;
        this.operations = 0;
    }
}

class DynamicList {
    constructor(initialCapacity = 4) {
        this.capacity = initialCapacity;
        this.items = new Array(initialCapacity).fill(null);
        this.size = 0;
        this.operations = 0;
        this.resizeCount = 0;
    }

    resize(newCapacity) {
        const newItems = new Array(newCapacity).fill(null);
        for (let i = 0; i < this.size; i++) {
            newItems[i] = this.items[i];
        }
        this.items = newItems;
        this.capacity = newCapacity;
        this.resizeCount++;
        return `Array resized from ${this.capacity / 2} to ${newCapacity}`;
    }

    insert(index, value) {
        if (index < 0 || index > this.size) {
            return { success: false, message: 'Invalid index!', resized: false };
        }

        let resizeMsg = '';
        if (this.size >= this.capacity) {
            resizeMsg = this.resize(this.capacity * 2);
        }

        for (let i = this.size; i > index; i--) {
            this.items[i] = this.items[i - 1];
        }
        this.items[index] = value;
        this.size++;
        this.operations++;
        
        const msg = resizeMsg ? 
            `${resizeMsg}. Inserted ${value} at index ${index}. Size: ${this.size}/${this.capacity}` :
            `Inserted ${value} at index ${index}. Size: ${this.size}/${this.capacity}`;
        
        return { success: true, message: msg, resized: !!resizeMsg };
    }

    delete(index) {
        if (index < 0 || index >= this.size) {
            return { success: false, message: 'Invalid index!', resized: false };
        }

        const value = this.items[index];
        for (let i = index; i < this.size - 1; i++) {
            this.items[i] = this.items[i + 1];
        }
        this.items[this.size - 1] = null;
        this.size--;
        this.operations++;

        let resizeMsg = '';
        if (this.size > 0 && this.size <= this.capacity / 4 && this.capacity > 4) {
            resizeMsg = this.resize(Math.max(4, this.capacity / 2));
        }

        const msg = resizeMsg ?
            `Deleted ${value}. ${resizeMsg}. Size: ${this.size}/${this.capacity}` :
            `Deleted ${value} from index ${index}. Size: ${this.size}/${this.capacity}`;

        return { success: true, message: msg, resized: !!resizeMsg };
    }

    get(index) {
        if (index < 0 || index >= this.size) return null;
        return this.items[index];
    }

    toArray() {
        return this.items.slice(0, this.size);
    }

    clear() {
        this.capacity = 4;
        this.items = new Array(4).fill(null);
        this.size = 0;
        this.operations = 0;
        this.resizeCount = 0;
    }
}

let staticList = new StaticList(10);
let dynamicList = new DynamicList(4);
let currentListView = 'both';

function getDynamicStaticListHTML() {
    return `
        <div class="module-header">
            <div class="module-title">
                <button class="back-btn" onclick="showDashboard()">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
                <h2>Dynamic & Static Lists</h2>
            </div>
        </div>
        ${getChallengeBannerHTML()}
        <div class="module-content">
            <div class="control-panel">
                <div class="control-section">
                    <h4>Insert Element</h4>
                    <div class="input-group">
                        <input type="number" id="list-value" placeholder="Value">
                        <input type="number" id="list-index" placeholder="Index" style="width: 70px;">
                    </div>
                    <div class="btn-group" style="margin-top: 0.5rem;">
                        <button class="btn btn-primary" onclick="dsInsertStatic()">
                            <i class="fas fa-plus"></i> Static
                        </button>
                        <button class="btn btn-primary" onclick="dsInsertDynamic()">
                            <i class="fas fa-plus"></i> Dynamic
                        </button>
                    </div>
                </div>
                <div class="control-section">
                    <h4>Delete Element</h4>
                    <div class="input-group">
                        <input type="number" id="delete-index" placeholder="Index">
                    </div>
                    <div class="btn-group" style="margin-top: 0.5rem;">
                        <button class="btn btn-error" onclick="dsDeleteStatic()">
                            <i class="fas fa-trash"></i> Static
                        </button>
                        <button class="btn btn-error" onclick="dsDeleteDynamic()">
                            <i class="fas fa-trash"></i> Dynamic
                        </button>
                    </div>
                </div>
                <div class="control-section">
                    <h4>Actions</h4>
                    <div class="btn-group">
                        <button class="btn btn-secondary" onclick="dsGenerateRandom()">
                            <i class="fas fa-random"></i> Random
                        </button>
                        <button class="btn btn-secondary" onclick="dsClear()">
                            <i class="fas fa-eraser"></i> Clear
                        </button>
                    </div>
                </div>
                ${getCommonControlsHTML()}
                <div class="control-section">
                    <h4>Comparison Info</h4>
                    <div class="info-box">
                        <h5>Static vs Dynamic</h5>
                        <p>Static: Fixed size, O(1) access, may waste space.<br>
                        Dynamic: Auto-resize, flexible, occasional O(n) resize cost.</p>
                    </div>
                </div>
            </div>
            <div class="visualization-area">
                <div class="array-list-container" id="ds-list-visual">
                    <div class="array-visual">
                        <div class="array-visual-label">
                            <i class="fas fa-lock"></i> Static List (Capacity: <span id="static-capacity">10</span>)
                        </div>
                        <div class="array-cells" id="static-list-cells"></div>
                        <div class="array-indices" id="static-list-indices"></div>
                        <div style="margin-top: 0.5rem; color: var(--text-muted); font-size: 0.85rem;">
                            Size: <span id="static-size">0</span>/10
                        </div>
                    </div>
                    <div class="array-visual">
                        <div class="array-visual-label">
                            <i class="fas fa-expand-arrows-alt"></i> Dynamic List (Capacity: <span id="dynamic-capacity">4</span>)
                        </div>
                        <div class="array-cells" id="dynamic-list-cells"></div>
                        <div class="array-indices" id="dynamic-list-indices"></div>
                        <div style="margin-top: 0.5rem; color: var(--text-muted); font-size: 0.85rem;">
                            Size: <span id="dynamic-size">0</span>/<span id="dynamic-cap-display">4</span> | Resizes: <span id="resize-count">0</span>
                        </div>
                    </div>
                </div>
                <div class="step-indicator" id="step-indicator">
                    <h5>Current Step</h5>
                    <p>Compare static and dynamic list behaviors. Try filling the static list to see the difference!</p>
                </div>
            </div>
        </div>
    `;
}

function initDynamicStaticList() {
    staticList = new StaticList(10);
    dynamicList = new DynamicList(4);
    renderDynamicStaticLists();
    updateMetrics(0, 0);
}

function dsInsertStatic() {
    const valueInput = document.getElementById('list-value');
    const indexInput = document.getElementById('list-index');
    const value = parseInt(valueInput.value);
    const index = parseInt(indexInput.value);
    
    if (isNaN(value)) return;
    const idx = isNaN(index) ? staticList.size : index;
    
    startChallengeTimer();
    
    setTimeout(() => {
        const result = staticList.insert(idx, value);
        renderDynamicStaticLists(result.success ? idx : -1, 'static');
        updateMetrics(0, staticList.operations + dynamicList.operations);
        updateStepIndicator(`Static List: ${result.message}`);
        stopChallengeTimer();
    }, animationSpeed);
    
    valueInput.value = '';
    indexInput.value = '';
}

function dsInsertDynamic() {
    const valueInput = document.getElementById('list-value');
    const indexInput = document.getElementById('list-index');
    const value = parseInt(valueInput.value);
    const index = parseInt(indexInput.value);
    
    if (isNaN(value)) return;
    const idx = isNaN(index) ? dynamicList.size : index;
    
    startChallengeTimer();
    
    setTimeout(() => {
        const result = dynamicList.insert(idx, value);
        renderDynamicStaticLists(result.success ? idx : -1, 'dynamic');
        updateMetrics(0, staticList.operations + dynamicList.operations);
        
        if (result.resized) {
            updateStepIndicator(`Dynamic List: ${result.message} (Array doubled in size!)`);
        } else {
            updateStepIndicator(`Dynamic List: ${result.message}`);
        }
        stopChallengeTimer();
    }, animationSpeed);
    
    valueInput.value = '';
    indexInput.value = '';
}

function dsDeleteStatic() {
    const indexInput = document.getElementById('delete-index');
    const index = parseInt(indexInput.value);
    
    if (isNaN(index)) return;
    
    startChallengeTimer();
    
    setTimeout(() => {
        const result = staticList.delete(index);
        renderDynamicStaticLists(-1, 'static');
        updateMetrics(0, staticList.operations + dynamicList.operations);
        updateStepIndicator(`Static List: ${result.message}`);
        stopChallengeTimer();
    }, animationSpeed);
    
    indexInput.value = '';
}

function dsDeleteDynamic() {
    const indexInput = document.getElementById('delete-index');
    const index = parseInt(indexInput.value);
    
    if (isNaN(index)) return;
    
    startChallengeTimer();
    
    setTimeout(() => {
        const result = dynamicList.delete(index);
        renderDynamicStaticLists(-1, 'dynamic');
        updateMetrics(0, staticList.operations + dynamicList.operations);
        
        if (result.resized) {
            updateStepIndicator(`Dynamic List: ${result.message} (Array shrunk!)`);
        } else {
            updateStepIndicator(`Dynamic List: ${result.message}`);
        }
        stopChallengeTimer();
    }, animationSpeed);
    
    indexInput.value = '';
}

function dsGenerateRandom() {
    staticList.clear();
    dynamicList.clear();
    
    const values = generateRandomArray(6, 1, 99);
    values.forEach((v, i) => {
        staticList.insert(i, v);
        dynamicList.insert(i, v);
    });
    
    renderDynamicStaticLists();
    updateStepIndicator(`Generated lists with values: [${values.join(', ')}]. Note how dynamic list resized automatically!`);
    updateMetrics(0, staticList.operations + dynamicList.operations);
}

function dsClear() {
    staticList.clear();
    dynamicList.clear();
    renderDynamicStaticLists();
    updateStepIndicator('Both lists cleared. Ready for new operations.');
    updateMetrics(0, 0);
}

function renderDynamicStaticLists(highlightIndex = -1, highlightList = '') {
    renderStaticList(highlightList === 'static' ? highlightIndex : -1);
    renderDynamicList(highlightList === 'dynamic' ? highlightIndex : -1);
}

function renderStaticList(highlightIndex = -1) {
    const cellsContainer = document.getElementById('static-list-cells');
    const indicesContainer = document.getElementById('static-list-indices');
    const sizeSpan = document.getElementById('static-size');
    
    if (!cellsContainer) return;
    
    cellsContainer.innerHTML = '';
    indicesContainer.innerHTML = '';
    
    for (let i = 0; i < staticList.capacity; i++) {
        const cell = document.createElement('div');
        cell.className = 'array-cell';
        
        if (i < staticList.size) {
            cell.classList.add('filled');
            cell.textContent = staticList.items[i];
            if (i === highlightIndex) {
                cell.classList.add('highlight');
            }
        } else {
            cell.classList.add('empty');
            cell.textContent = '-';
        }
        
        cellsContainer.appendChild(cell);
        
        const indexEl = document.createElement('div');
        indexEl.className = 'array-index';
        indexEl.textContent = i;
        indicesContainer.appendChild(indexEl);
    }
    
    sizeSpan.textContent = staticList.size;
}

function renderDynamicList(highlightIndex = -1) {
    const cellsContainer = document.getElementById('dynamic-list-cells');
    const indicesContainer = document.getElementById('dynamic-list-indices');
    const sizeSpan = document.getElementById('dynamic-size');
    const capSpan = document.getElementById('dynamic-capacity');
    const capDisplaySpan = document.getElementById('dynamic-cap-display');
    const resizeSpan = document.getElementById('resize-count');
    
    if (!cellsContainer) return;
    
    cellsContainer.innerHTML = '';
    indicesContainer.innerHTML = '';
    
    for (let i = 0; i < dynamicList.capacity; i++) {
        const cell = document.createElement('div');
        cell.className = 'array-cell';
        
        if (i < dynamicList.size) {
            cell.classList.add('filled');
            cell.textContent = dynamicList.items[i];
            if (i === highlightIndex) {
                cell.classList.add('highlight');
            }
        } else {
            cell.classList.add('empty');
            cell.textContent = '-';
        }
        
        cellsContainer.appendChild(cell);
        
        const indexEl = document.createElement('div');
        indexEl.className = 'array-index';
        indexEl.textContent = i;
        indicesContainer.appendChild(indexEl);
    }
    
    sizeSpan.textContent = dynamicList.size;
    capSpan.textContent = dynamicList.capacity;
    capDisplaySpan.textContent = dynamicList.capacity;
    resizeSpan.textContent = dynamicList.resizeCount;
}
