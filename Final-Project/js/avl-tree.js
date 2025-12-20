class AVLNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
        this.x = 0;
        this.y = 0;
    }
}

class AVLTree {
    constructor() {
        this.root = null;
        this.comparisons = 0;
        this.operations = 0;
    }

    getHeight(node) {
        return node ? node.height : 0;
    }

    getBalance(node) {
        return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
    }

    updateHeight(node) {
        if (node) {
            node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
        }
    }

    rotateRight(y) {
        const x = y.left;
        const T2 = x.right;
        x.right = y;
        y.left = T2;
        this.updateHeight(y);
        this.updateHeight(x);
        this.operations++;
        return x;
    }

    rotateLeft(x) {
        const y = x.right;
        const T2 = y.left;
        y.left = x;
        x.right = T2;
        this.updateHeight(x);
        this.updateHeight(y);
        this.operations++;
        return y;
    }

    insert(node, value) {
        if (!node) {
            this.operations++;
            return new AVLNode(value);
        }

        this.comparisons++;
        if (value < node.value) {
            node.left = this.insert(node.left, value);
        } else if (value > node.value) {
            node.right = this.insert(node.right, value);
        } else {
            return node;
        }

        this.updateHeight(node);
        const balance = this.getBalance(node);

        if (balance > 1 && value < node.left.value) {
            return this.rotateRight(node);
        }

        if (balance < -1 && value > node.right.value) {
            return this.rotateLeft(node);
        }

        if (balance > 1 && value > node.left.value) {
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);
        }

        if (balance < -1 && value < node.right.value) {
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);
        }

        return node;
    }

    getMinNode(node) {
        let current = node;
        while (current.left) {
            current = current.left;
        }
        return current;
    }

    delete(node, value) {
        if (!node) return node;

        this.comparisons++;
        if (value < node.value) {
            node.left = this.delete(node.left, value);
        } else if (value > node.value) {
            node.right = this.delete(node.right, value);
        } else {
            this.operations++;
            if (!node.left || !node.right) {
                const temp = node.left ? node.left : node.right;
                if (!temp) {
                    return null;
                }
                return temp;
            }

            const temp = this.getMinNode(node.right);
            node.value = temp.value;
            node.right = this.delete(node.right, temp.value);
        }

        this.updateHeight(node);
        const balance = this.getBalance(node);

        if (balance > 1 && this.getBalance(node.left) >= 0) {
            return this.rotateRight(node);
        }

        if (balance > 1 && this.getBalance(node.left) < 0) {
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);
        }

        if (balance < -1 && this.getBalance(node.right) <= 0) {
            return this.rotateLeft(node);
        }

        if (balance < -1 && this.getBalance(node.right) > 0) {
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);
        }

        return node;
    }

    search(node, value, path = []) {
        if (!node) return { found: false, path };
        
        path.push(node.value);
        this.comparisons++;

        if (value === node.value) {
            return { found: true, path };
        }

        if (value < node.value) {
            return this.search(node.left, value, path);
        }
        return this.search(node.right, value, path);
    }

    insertValue(value) {
        this.root = this.insert(this.root, value);
    }

    deleteValue(value) {
        this.root = this.delete(this.root, value);
    }

    searchValue(value) {
        return this.search(this.root, value);
    }

    resetMetrics() {
        this.comparisons = 0;
        this.operations = 0;
    }
}

let avlTree = new AVLTree();
let avlAnimationSteps = [];

function getAVLTreeHTML() {
    return `
        <div class="module-header">
            <div class="module-title">
                <button class="back-btn" onclick="showDashboard()">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
                <h2>AVL Tree</h2>
            </div>
        </div>
        ${getChallengeBannerHTML()}
        <div class="module-content">
            <div class="control-panel">
                <div class="control-section">
                    <h4>Insert Node</h4>
                    <div class="input-group">
                        <input type="number" id="avl-insert-value" placeholder="Enter value">
                        <button class="btn btn-primary" onclick="avlInsert()">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="control-section">
                    <h4>Delete Node</h4>
                    <div class="input-group">
                        <input type="number" id="avl-delete-value" placeholder="Enter value">
                        <button class="btn btn-error" onclick="avlDelete()">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="control-section">
                    <h4>Search Node</h4>
                    <div class="input-group">
                        <input type="number" id="avl-search-value" placeholder="Enter value">
                        <button class="btn btn-success" onclick="avlSearch()">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>
                <div class="control-section">
                    <h4>Actions</h4>
                    <div class="btn-group">
                        <button class="btn btn-secondary" onclick="avlGenerateRandom()">
                            <i class="fas fa-random"></i> Random
                        </button>
                        <button class="btn btn-secondary" onclick="avlClear()">
                            <i class="fas fa-eraser"></i> Clear
                        </button>
                    </div>
                </div>
                ${getCommonControlsHTML()}
            </div>
            <div class="visualization-area">
                <div class="canvas-container" id="avl-canvas">
                    <svg id="avl-svg" width="100%" height="100%"></svg>
                </div>
                <div class="step-indicator" id="step-indicator">
                    <h5>Current Step</h5>
                    <p>Ready to start. Insert, delete, or search for a value.</p>
                </div>
            </div>
        </div>
    `;
}

function initAVLTree() {
    avlTree = new AVLTree();
    renderAVLTree();
    updateMetrics(0, 0);
}

function avlInsert() {
    const input = document.getElementById('avl-insert-value');
    const value = parseInt(input.value);
    if (isNaN(value)) return;
    
    avlTree.resetMetrics();
    startChallengeTimer();
    updateStepIndicator(`Inserting value ${value}...`);
    
    if (currentMode === 'challenge') {
        let questionPromise;
        if (!avlTree.root) {
            questionPromise = askChallengeQuestion(
                `Inserting ${value} into empty tree. Where will it go?`,
                ['Becomes the root node', 'Goes to left subtree', 'Goes to right subtree', 'Cannot insert'],
                0
            );
        } else {
            const direction = value < avlTree.root.value ? 'left' : 'right';
            questionPromise = askChallengeQuestion(
                `Inserting ${value}. Root is ${avlTree.root.value}. Where does ${value} go?`,
                [
                    value < avlTree.root.value ? `Left subtree (${value} < ${avlTree.root.value})` : `Right subtree (${value} > ${avlTree.root.value})`,
                    value < avlTree.root.value ? `Right subtree (${value} > ${avlTree.root.value})` : `Left subtree (${value} < ${avlTree.root.value})`,
                    'Replace the root',
                    'Cannot insert - duplicate'
                ],
                0
            );
        }
        
        questionPromise.then(async () => {
            const oldTreeStr = JSON.stringify(avlTree.root);
            avlTree.insertValue(value);
            renderAVLTree();
            updateMetrics(avlTree.comparisons, avlTree.operations);
            
            if (avlTree.operations > 0) {
                await askChallengeQuestion(
                    `Tree was rebalanced! Why might rotations be needed?`,
                    ['Balance factor became > 1 or < -1', 'Tree was too deep', 'Node had no children', 'Random rebalancing'],
                    0
                );
            }
            
            updateStepIndicator(`Value ${value} inserted successfully. Tree has been rebalanced if necessary.`);
            stopChallengeTimer();
        });
    } else {
        setTimeout(() => {
            avlTree.insertValue(value);
            renderAVLTree();
            updateMetrics(avlTree.comparisons, avlTree.operations);
            updateStepIndicator(`Value ${value} inserted successfully. Tree has been rebalanced if necessary.`);
            stopChallengeTimer();
        }, animationSpeed);
    }
    
    input.value = '';
}

function avlDelete() {
    const input = document.getElementById('avl-delete-value');
    const value = parseInt(input.value);
    if (isNaN(value)) return;
    
    avlTree.resetMetrics();
    startChallengeTimer();
    updateStepIndicator(`Deleting value ${value}...`);
    
    if (currentMode === 'challenge') {
        askChallengeQuestion(
            `Deleting ${value} from AVL Tree. What happens first?`,
            ['Find the node like in BST', 'Rotate the tree', 'Remove the root', 'Rebalance immediately'],
            0
        ).then(async () => {
            avlTree.deleteValue(value);
            renderAVLTree();
            updateMetrics(avlTree.comparisons, avlTree.operations);
            
            if (avlTree.operations > 0) {
                await askChallengeQuestion(
                    `Deletion caused ${avlTree.operations} operation(s). Why might rotations occur after deletion?`,
                    ['Subtree heights became unbalanced', 'Node had two children', 'Tree became empty', 'Always rotate after delete'],
                    0
                );
            }
            
            updateStepIndicator(`Value ${value} deleted. Tree has been rebalanced if necessary.`);
            stopChallengeTimer();
        });
    } else {
        setTimeout(() => {
            avlTree.deleteValue(value);
            renderAVLTree();
            updateMetrics(avlTree.comparisons, avlTree.operations);
            updateStepIndicator(`Value ${value} deleted. Tree has been rebalanced if necessary.`);
            stopChallengeTimer();
        }, animationSpeed);
    }
    
    input.value = '';
}

async function avlSearch() {
    const input = document.getElementById('avl-search-value');
    const value = parseInt(input.value);
    if (isNaN(value)) return;
    
    avlTree.resetMetrics();
    startChallengeTimer();
    
    if (currentMode === 'challenge') {
        await askChallengeQuestion(
            `Searching for ${value}. What is AVL search time complexity?`,
            ['O(n)', 'O(log n) - guaranteed', 'O(n²)', 'O(1)'],
            1
        );
        
        if (avlTree.root) {
            await askChallengeQuestion(
                `Root is ${avlTree.root.value}. Looking for ${value}. Where do we go first?`,
                [
                    value < avlTree.root.value ? 'Left subtree' : (value > avlTree.root.value ? 'Right subtree' : 'Found at root!'),
                    value < avlTree.root.value ? 'Right subtree' : 'Left subtree',
                    'Check all nodes',
                    'Random direction'
                ],
                0
            );
        }
    }
    
    const result = avlTree.searchValue(value);
    
    for (let i = 0; i < result.path.length; i++) {
        updateStepIndicator(`Comparing with node ${result.path[i]}...`);
        highlightNode(result.path[i], 'highlight');
        await sleep(animationSpeed);
        
        if (currentMode === 'challenge' && i < result.path.length - 1) {
            const currentNode = result.path[i];
            const nextNode = result.path[i + 1];
            const direction = nextNode < currentNode ? 'left' : 'right';
            await askChallengeQuestion(
                `${value} compared with ${currentNode}. Where to go next?`,
                ['Go Left', 'Go Right', 'Found it', 'Not in tree'],
                direction === 'left' ? 0 : 1
            );
        }
    }
    
    if (result.found) {
        highlightNode(value, 'found');
        updateStepIndicator(`Value ${value} found in the tree!`);
    } else {
        updateStepIndicator(`Value ${value} not found in the tree.`);
    }
    
    updateMetrics(avlTree.comparisons, avlTree.operations);
    stopChallengeTimer();
    
    setTimeout(() => {
        renderAVLTree();
    }, animationSpeed * 2);
    
    input.value = '';
}

function avlGenerateRandom() {
    avlTree = new AVLTree();
    const values = generateRandomArray(7, 1, 99);
    values.forEach(v => avlTree.insertValue(v));
    renderAVLTree();
    updateStepIndicator(`Generated random AVL tree with values: ${values.join(', ')}`);
    updateMetrics(avlTree.comparisons, avlTree.operations);
}

function avlClear() {
    avlTree = new AVLTree();
    renderAVLTree();
    updateStepIndicator('Tree cleared. Ready for new operations.');
    updateMetrics(0, 0);
}

function renderAVLTree() {
    const svg = document.getElementById('avl-svg');
    if (!svg) return;
    
    svg.innerHTML = '';
    
    if (!avlTree.root) return;
    
    const width = svg.parentElement.clientWidth;
    const height = svg.parentElement.clientHeight;
    
    calculateNodePositions(avlTree.root, width / 2, 40, width / 4);
    
    drawEdges(svg, avlTree.root);
    drawNodes(svg, avlTree.root);
}

function calculateNodePositions(node, x, y, offset) {
    if (!node) return;
    
    node.x = x;
    node.y = y;
    
    if (node.left) {
        calculateNodePositions(node.left, x - offset, y + 70, offset / 2);
    }
    if (node.right) {
        calculateNodePositions(node.right, x + offset, y + 70, offset / 2);
    }
}

function drawEdges(svg, node) {
    if (!node) return;
    
    if (node.left) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', node.x);
        line.setAttribute('y1', node.y);
        line.setAttribute('x2', node.left.x);
        line.setAttribute('y2', node.left.y);
        line.setAttribute('class', 'tree-edge');
        svg.appendChild(line);
        drawEdges(svg, node.left);
    }
    
    if (node.right) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', node.x);
        line.setAttribute('y1', node.y);
        line.setAttribute('x2', node.right.x);
        line.setAttribute('y2', node.right.y);
        line.setAttribute('class', 'tree-edge');
        svg.appendChild(line);
        drawEdges(svg, node.right);
    }
}

function drawNodes(svg, node) {
    if (!node) return;
    
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'tree-node');
    g.setAttribute('data-value', node.value);
    
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', node.x);
    circle.setAttribute('cy', node.y);
    circle.setAttribute('r', 25);
    g.appendChild(circle);
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', node.x);
    text.setAttribute('y', node.y);
    text.textContent = node.value;
    g.appendChild(text);
    
    const balance = avlTree.getBalance(node);
    const balanceText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    balanceText.setAttribute('x', node.x + 20);
    balanceText.setAttribute('y', node.y - 20);
    balanceText.setAttribute('class', 'balance-factor');
    balanceText.textContent = `BF: ${balance}`;
    g.appendChild(balanceText);
    
    svg.appendChild(g);
    
    drawNodes(svg, node.left);
    drawNodes(svg, node.right);
}

function highlightNode(value, className) {
    const nodes = document.querySelectorAll('.tree-node');
    nodes.forEach(node => {
        if (parseInt(node.getAttribute('data-value')) === value) {
            node.classList.add(className);
        }
    });
}
