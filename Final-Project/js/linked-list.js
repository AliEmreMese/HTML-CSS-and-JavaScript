class ListNode {
    constructor(value) {
        this.value = value;
        this.next = null;
        this.prev = null;
    }
}

class SinglyLinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    insertAt(index, value) {
        const newNode = new ListNode(value);
        
        if (index === 0) {
            newNode.next = this.head;
            this.head = newNode;
        } else {
            let current = this.head;
            for (let i = 0; i < index - 1 && current; i++) {
                current = current.next;
            }
            if (current) {
                newNode.next = current.next;
                current.next = newNode;
            }
        }
        this.size++;
    }

    insertAtEnd(value) {
        this.insertAt(this.size, value);
    }

    insertAtBeginning(value) {
        this.insertAt(0, value);
    }

    deleteAt(index) {
        if (!this.head || index < 0 || index >= this.size) return;
        
        if (index === 0) {
            this.head = this.head.next;
        } else {
            let current = this.head;
            for (let i = 0; i < index - 1; i++) {
                current = current.next;
            }
            if (current.next) {
                current.next = current.next.next;
            }
        }
        this.size--;
    }

    search(value) {
        let current = this.head;
        let index = 0;
        while (current) {
            if (current.value === value) return index;
            current = current.next;
            index++;
        }
        return -1;
    }

    toArray() {
        const arr = [];
        let current = this.head;
        while (current) {
            arr.push(current.value);
            current = current.next;
        }
        return arr;
    }
}

class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    insertAt(index, value) {
        const newNode = new ListNode(value);
        
        if (index === 0) {
            if (!this.head) {
                this.head = this.tail = newNode;
            } else {
                newNode.next = this.head;
                this.head.prev = newNode;
                this.head = newNode;
            }
        } else if (index >= this.size) {
            if (!this.tail) {
                this.head = this.tail = newNode;
            } else {
                newNode.prev = this.tail;
                this.tail.next = newNode;
                this.tail = newNode;
            }
        } else {
            let current = this.head;
            for (let i = 0; i < index; i++) {
                current = current.next;
            }
            newNode.prev = current.prev;
            newNode.next = current;
            current.prev.next = newNode;
            current.prev = newNode;
        }
        this.size++;
    }

    insertAtEnd(value) {
        this.insertAt(this.size, value);
    }

    insertAtBeginning(value) {
        this.insertAt(0, value);
    }

    deleteAt(index) {
        if (!this.head || index < 0 || index >= this.size) return;
        
        if (index === 0) {
            this.head = this.head.next;
            if (this.head) {
                this.head.prev = null;
            } else {
                this.tail = null;
            }
        } else if (index === this.size - 1) {
            this.tail = this.tail.prev;
            if (this.tail) {
                this.tail.next = null;
            } else {
                this.head = null;
            }
        } else {
            let current = this.head;
            for (let i = 0; i < index; i++) {
                current = current.next;
            }
            current.prev.next = current.next;
            current.next.prev = current.prev;
        }
        this.size--;
    }

    search(value) {
        let current = this.head;
        let index = 0;
        while (current) {
            if (current.value === value) return index;
            current = current.next;
            index++;
        }
        return -1;
    }

    toArray() {
        const arr = [];
        let current = this.head;
        while (current) {
            arr.push(current.value);
            current = current.next;
        }
        return arr;
    }
}

class CircularLinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    insertAt(index, value) {
        const newNode = new ListNode(value);
        
        if (!this.head) {
            newNode.next = newNode;
            this.head = newNode;
        } else if (index === 0) {
            let tail = this.head;
            while (tail.next !== this.head) {
                tail = tail.next;
            }
            newNode.next = this.head;
            tail.next = newNode;
            this.head = newNode;
        } else {
            let current = this.head;
            for (let i = 0; i < index - 1; i++) {
                current = current.next;
                if (current === this.head) break;
            }
            newNode.next = current.next;
            current.next = newNode;
        }
        this.size++;
    }

    insertAtEnd(value) {
        this.insertAt(this.size, value);
    }

    insertAtBeginning(value) {
        this.insertAt(0, value);
    }

    deleteAt(index) {
        if (!this.head || index < 0 || index >= this.size) return;
        
        if (this.size === 1) {
            this.head = null;
        } else if (index === 0) {
            let tail = this.head;
            while (tail.next !== this.head) {
                tail = tail.next;
            }
            this.head = this.head.next;
            tail.next = this.head;
        } else {
            let current = this.head;
            for (let i = 0; i < index - 1; i++) {
                current = current.next;
            }
            current.next = current.next.next;
        }
        this.size--;
    }

    search(value) {
        if (!this.head) return -1;
        
        let current = this.head;
        let index = 0;
        do {
            if (current.value === value) return index;
            current = current.next;
            index++;
        } while (current !== this.head);
        return -1;
    }

    toArray() {
        const arr = [];
        if (!this.head) return arr;
        
        let current = this.head;
        do {
            arr.push(current.value);
            current = current.next;
        } while (current !== this.head);
        return arr;
    }
}

let singlyList = new SinglyLinkedList();
let doublyList = new DoublyLinkedList();
let circularList = new CircularLinkedList();
let currentListType = 'singly';
let listOperations = 0;

function getLinkedListHTML() {
    return `
        <div class="module-header">
            <div class="module-title">
                <button class="back-btn" onclick="showDashboard()">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
                <h2>Linked Lists</h2>
            </div>
        </div>
        ${getChallengeBannerHTML()}
        <div class="module-content">
            <div class="control-panel">
                <div class="control-section">
                    <h4>List Type</h4>
                    <div class="type-selector">
                        <button class="type-btn active" onclick="setListType('singly')">Singly</button>
                        <button class="type-btn" onclick="setListType('doubly')">Doubly</button>
                        <button class="type-btn" onclick="setListType('circular')">Circular</button>
                    </div>
                </div>
                <div class="control-section">
                    <h4>Insert Node</h4>
                    <div class="input-group">
                        <input type="number" id="list-insert-value" placeholder="Value">
                        <input type="number" id="list-insert-index" placeholder="Index" style="width: 70px;">
                    </div>
                    <div class="btn-group" style="margin-top: 0.5rem;">
                        <button class="btn btn-primary btn-block" onclick="listInsertAt()">
                            <i class="fas fa-plus"></i> Insert at Index
                        </button>
                    </div>
                    <div class="btn-group" style="margin-top: 0.5rem;">
                        <button class="btn btn-secondary" onclick="listInsertBeginning()">
                            <i class="fas fa-arrow-left"></i> Start
                        </button>
                        <button class="btn btn-secondary" onclick="listInsertEnd()">
                            End <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
                <div class="control-section">
                    <h4>Delete Node</h4>
                    <div class="input-group">
                        <input type="number" id="list-delete-index" placeholder="Index">
                        <button class="btn btn-error" onclick="listDeleteAt()">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="control-section">
                    <h4>Search Value</h4>
                    <div class="input-group">
                        <input type="number" id="list-search-value" placeholder="Value">
                        <button class="btn btn-success" onclick="listSearch()">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>
                <div class="control-section">
                    <h4>Actions</h4>
                    <div class="btn-group">
                        <button class="btn btn-secondary" onclick="listGenerateRandom()">
                            <i class="fas fa-random"></i> Random
                        </button>
                        <button class="btn btn-secondary" onclick="listClear()">
                            <i class="fas fa-eraser"></i> Clear
                        </button>
                    </div>
                </div>
                ${getCommonControlsHTML()}
            </div>
            <div class="visualization-area">
                <div class="canvas-container">
                    <div class="linked-list-container" id="linked-list-visual"></div>
                </div>
                <div class="step-indicator" id="step-indicator">
                    <h5>Current Step</h5>
                    <p>Select a list type and start adding nodes.</p>
                </div>
            </div>
        </div>
    `;
}

function initLinkedList() {
    singlyList = new SinglyLinkedList();
    doublyList = new DoublyLinkedList();
    circularList = new CircularLinkedList();
    currentListType = 'singly';
    listOperations = 0;
    renderLinkedList();
    updateMetrics(0, 0);
}

function setListType(type) {
    currentListType = type;
    document.querySelectorAll('.type-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderLinkedList();
    updateStepIndicator(`Switched to ${type} linked list.`);
}

function getCurrentList() {
    switch(currentListType) {
        case 'singly': return singlyList;
        case 'doubly': return doublyList;
        case 'circular': return circularList;
    }
}

function listInsertAt() {
    const valueInput = document.getElementById('list-insert-value');
    const indexInput = document.getElementById('list-insert-index');
    const value = parseInt(valueInput.value);
    const index = parseInt(indexInput.value);
    
    if (isNaN(value)) return;
    const idx = isNaN(index) ? 0 : index;
    
    startChallengeTimer();
    updateStepIndicator(`Inserting ${value} at index ${idx}...`);
    
    setTimeout(() => {
        getCurrentList().insertAt(idx, value);
        listOperations++;
        renderLinkedList();
        updateMetrics(0, listOperations);
        updateStepIndicator(`Value ${value} inserted at index ${idx}. Pointers have been updated.`);
        stopChallengeTimer();
    }, animationSpeed);
    
    valueInput.value = '';
    indexInput.value = '';
}

function listInsertBeginning() {
    const valueInput = document.getElementById('list-insert-value');
    const value = parseInt(valueInput.value);
    
    if (isNaN(value)) return;
    
    startChallengeTimer();
    updateStepIndicator(`Inserting ${value} at the beginning...`);
    
    if (currentMode === 'challenge') {
        const list = getCurrentList();
        const currentHead = list.head ? list.head.value : null;
        
        askChallengeQuestion(
            'Inserting at beginning of a linked list takes:',
            ['O(1) time - just update head', 'O(n) time - traverse to end', 'O(log n) time', 'O(n²) time'],
            0
        ).then(async () => {
            if (currentHead !== null) {
                await askChallengeQuestion(
                    `Current head is ${currentHead}. After inserting ${value} at beginning, what happens?`,
                    [`${value} becomes new head, points to ${currentHead}`, `${currentHead} stays as head`, `${value} is added at end`, 'List is rebuilt'],
                    0
                );
            }
            
            getCurrentList().insertAtBeginning(value);
            listOperations++;
            renderLinkedList();
            updateMetrics(0, listOperations);
            updateStepIndicator(`Value ${value} inserted at the beginning. New head pointer set.`);
            stopChallengeTimer();
        });
    } else {
        setTimeout(() => {
            getCurrentList().insertAtBeginning(value);
            listOperations++;
            renderLinkedList();
            updateMetrics(0, listOperations);
            updateStepIndicator(`Value ${value} inserted at the beginning. New head pointer set.`);
            stopChallengeTimer();
        }, animationSpeed);
    }
    
    valueInput.value = '';
}

function listInsertEnd() {
    const valueInput = document.getElementById('list-insert-value');
    const value = parseInt(valueInput.value);
    
    if (isNaN(value)) return;
    
    startChallengeTimer();
    updateStepIndicator(`Inserting ${value} at the end...`);
    
    if (currentMode === 'challenge') {
        const list = getCurrentList();
        const listSize = list.size;
        
        askChallengeQuestion(
            `List has ${listSize} node(s). Inserting at end requires:`,
            [`Traverse ${listSize} node(s) to find tail`, 'Direct access to end', 'Traverse half the list', 'No traversal needed'],
            0
        ).then(async () => {
            await askChallengeQuestion(
                `After finding the tail, what do we do to add ${value}?`,
                [`Set tail.next = new node(${value})`, `Replace tail with ${value}`, `Insert before tail`, 'Rebuild entire list'],
                0
            );
            
            getCurrentList().insertAtEnd(value);
            listOperations++;
            renderLinkedList();
            updateMetrics(0, listOperations);
            updateStepIndicator(`Value ${value} inserted at the end. Tail pointer updated.`);
            stopChallengeTimer();
        });
    } else {
        setTimeout(() => {
            getCurrentList().insertAtEnd(value);
            listOperations++;
            renderLinkedList();
            updateMetrics(0, listOperations);
            updateStepIndicator(`Value ${value} inserted at the end. Tail pointer updated.`);
            stopChallengeTimer();
        }, animationSpeed);
    }
    
    valueInput.value = '';
}

function listDeleteAt() {
    const indexInput = document.getElementById('list-delete-index');
    const index = parseInt(indexInput.value);
    
    if (isNaN(index)) return;
    
    startChallengeTimer();
    updateStepIndicator(`Deleting node at index ${index}...`);
    
    if (currentMode === 'challenge') {
        const list = getCurrentList();
        
        askChallengeQuestion(
            `Deleting node at index ${index}. First we need to:`,
            [`Find node at index ${index - 1}`, 'Find node at index 0', 'Find the tail', 'No traversal needed'],
            index === 0 ? 3 : 0
        ).then(async () => {
            await askChallengeQuestion(
                'When deleting a node, we update:',
                ['Previous node\'s next pointer', 'Every node\'s pointer', 'Only deleted node\'s pointer', 'Nothing - just remove'],
                0
            );
            
            getCurrentList().deleteAt(index);
            listOperations++;
            renderLinkedList();
            updateMetrics(0, listOperations);
            updateStepIndicator(`Node at index ${index} deleted. Pointers reconnected.`);
            stopChallengeTimer();
        });
    } else {
        setTimeout(() => {
            getCurrentList().deleteAt(index);
            listOperations++;
            renderLinkedList();
            updateMetrics(0, listOperations);
            updateStepIndicator(`Node at index ${index} deleted. Pointers reconnected.`);
            stopChallengeTimer();
        }, animationSpeed);
    }
    
    indexInput.value = '';
}

async function listSearch() {
    const valueInput = document.getElementById('list-search-value');
    const value = parseInt(valueInput.value);
    
    if (isNaN(value)) return;
    
    startChallengeTimer();
    
    if (currentMode === 'challenge') {
        await askChallengeQuestion(
            `Searching for ${value}. Why can't we use binary search on linked list?`,
            ['No random access - must traverse sequentially', 'Linked list is always sorted', 'Binary search works fine', 'We need extra space'],
            0
        );
        
        await askChallengeQuestion(
            'Searching in a linked list has what time complexity?',
            ['O(n) - linear search', 'O(log n) - binary search', 'O(1) - direct access', 'O(n²) - quadratic'],
            0
        );
    }
    
    const list = getCurrentList();
    const arr = list.toArray();
    
    for (let i = 0; i < arr.length; i++) {
        updateStepIndicator(`Checking node at index ${i} (value: ${arr[i]})...`);
        highlightListNode(i, 'highlight');
        await sleep(animationSpeed);
        
        if (arr[i] === value) {
            highlightListNode(i, 'found');
            updateStepIndicator(`Value ${value} found at index ${i}!`);
            stopChallengeTimer();
            setTimeout(() => renderLinkedList(), animationSpeed * 2);
            valueInput.value = '';
            return;
        }
        renderLinkedList();
    }
    
    updateStepIndicator(`Value ${value} not found in the list.`);
    stopChallengeTimer();
    valueInput.value = '';
}

function listGenerateRandom() {
    const list = getCurrentList();
    while (list.size > 0) {
        list.deleteAt(0);
    }
    
    const values = generateRandomArray(5, 1, 99);
    values.forEach(v => list.insertAtEnd(v));
    listOperations = values.length;
    renderLinkedList();
    updateStepIndicator(`Generated random list with values: ${values.join(' → ')}`);
    updateMetrics(0, listOperations);
}

function listClear() {
    const list = getCurrentList();
    while (list.size > 0) {
        list.deleteAt(0);
    }
    listOperations = 0;
    renderLinkedList();
    updateStepIndicator('List cleared. Ready for new operations.');
    updateMetrics(0, 0);
}

function renderLinkedList() {
    const container = document.getElementById('linked-list-visual');
    if (!container) return;
    
    const list = getCurrentList();
    const arr = list.toArray();
    
    container.innerHTML = '';
    
    if (arr.length === 0) {
        container.innerHTML = '<div class="list-null">Empty List</div>';
        return;
    }
    
    const headLabel = document.createElement('div');
    headLabel.className = 'list-null';
    headLabel.innerHTML = 'HEAD →';
    container.appendChild(headLabel);
    
    arr.forEach((value, index) => {
        const nodeDiv = document.createElement('div');
        nodeDiv.className = 'list-node';
        nodeDiv.setAttribute('data-index', index);
        
        let pointerContent = '•';
        if (currentListType === 'doubly') {
            pointerContent = '⟷';
        } else if (currentListType === 'circular' && index === arr.length - 1) {
            pointerContent = '↺';
        }
        
        nodeDiv.innerHTML = `
            <div class="list-node-box">
                <div class="list-node-data">${value}</div>
                <div class="list-node-pointer">${pointerContent}</div>
            </div>
        `;
        
        container.appendChild(nodeDiv);
        
        if (index < arr.length - 1 || currentListType === 'circular') {
            const arrow = document.createElement('div');
            arrow.className = 'list-arrow';
            arrow.innerHTML = currentListType === 'doubly' ? '⟷' : '→';
            container.appendChild(arrow);
        }
    });
    
    if (currentListType !== 'circular') {
        const nullLabel = document.createElement('div');
        nullLabel.className = 'list-null';
        nullLabel.innerHTML = '→ NULL';
        container.appendChild(nullLabel);
    } else {
        const circleLabel = document.createElement('div');
        circleLabel.className = 'list-null';
        circleLabel.innerHTML = '→ HEAD';
        container.appendChild(circleLabel);
    }
}

function highlightListNode(index, className) {
    const nodes = document.querySelectorAll('.list-node');
    nodes.forEach((node, i) => {
        if (i === index) {
            node.classList.add(className);
        }
    });
}
