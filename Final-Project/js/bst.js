class BSTNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.x = 0;
        this.y = 0;
    }
}

class BST {
    constructor() {
        this.root = null;
        this.comparisons = 0;
        this.operations = 0;
    }

    insert(node, value) {
        if (!node) {
            this.operations++;
            return new BSTNode(value);
        }

        this.comparisons++;
        if (value < node.value) {
            node.left = this.insert(node.left, value);
        } else if (value > node.value) {
            node.right = this.insert(node.right, value);
        }

        return node;
    }

    getMinNode(node) {
        let current = node;
        while (current && current.left) {
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
            if (!node.left) {
                return node.right;
            } else if (!node.right) {
                return node.left;
            }

            const temp = this.getMinNode(node.right);
            node.value = temp.value;
            node.right = this.delete(node.right, temp.value);
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

    findNode(node, value) {
        if (!node) return null;
        if (value === node.value) return node;
        if (value < node.value) return this.findNode(node.left, value);
        return this.findNode(node.right, value);
    }

    inorder(node, result = []) {
        if (node) {
            this.inorder(node.left, result);
            result.push(node.value);
            this.inorder(node.right, result);
        }
        return result;
    }

    preorder(node, result = []) {
        if (node) {
            result.push(node.value);
            this.preorder(node.left, result);
            this.preorder(node.right, result);
        }
        return result;
    }

    postorder(node, result = []) {
        if (node) {
            this.postorder(node.left, result);
            this.postorder(node.right, result);
            result.push(node.value);
        }
        return result;
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

let bst = new BST();
let currentTraversal = [];
let traversalIndex = 0;

function getBSTHTML() {
    return `
        <div class="module-header">
            <div class="module-title">
                <button class="back-btn" onclick="showDashboard()">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
                <h2>Binary Search Tree</h2>
            </div>
        </div>
        ${getChallengeBannerHTML()}
        <div class="module-content">
            <div class="control-panel">
                <div class="control-section">
                    <h4>Insert Node</h4>
                    <div class="input-group">
                        <input type="number" id="bst-insert-value" placeholder="Enter value">
                        <button class="btn btn-primary" onclick="bstInsert()">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="control-section">
                    <h4>Delete Node</h4>
                    <div class="input-group">
                        <input type="number" id="bst-delete-value" placeholder="Enter value">
                        <button class="btn btn-error" onclick="bstDelete()">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="control-section">
                    <h4>Search Node</h4>
                    <div class="input-group">
                        <input type="number" id="bst-search-value" placeholder="Enter value">
                        <button class="btn btn-success" onclick="bstSearch()">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>
                <div class="control-section">
                    <h4>Traversal</h4>
                    <div class="btn-group">
                        <button class="btn btn-secondary" onclick="bstTraversal('inorder')">Inorder</button>
                        <button class="btn btn-secondary" onclick="bstTraversal('preorder')">Preorder</button>
                        <button class="btn btn-secondary" onclick="bstTraversal('postorder')">Postorder</button>
                    </div>
                </div>
                <div class="control-section">
                    <h4>Actions</h4>
                    <div class="btn-group">
                        <button class="btn btn-secondary" onclick="bstGenerateRandom()">
                            <i class="fas fa-random"></i> Random
                        </button>
                        <button class="btn btn-secondary" onclick="bstClear()">
                            <i class="fas fa-eraser"></i> Clear
                        </button>
                    </div>
                </div>
                ${getCommonControlsHTML()}
            </div>
            <div class="visualization-area">
                <div class="canvas-container" id="bst-canvas">
                    <svg id="bst-svg" width="100%" height="100%"></svg>
                </div>
                <div class="step-indicator" id="step-indicator">
                    <h5>Current Step</h5>
                    <p>Ready to start. Insert, delete, search, or traverse the tree.</p>
                </div>
            </div>
        </div>
    `;
}

function initBST() {
    bst = new BST();
    renderBST();
    updateMetrics(0, 0);
}

function bstInsert() {
    const input = document.getElementById('bst-insert-value');
    const value = parseInt(input.value);
    if (isNaN(value)) return;
    
    bst.resetMetrics();
    startChallengeTimer();
    updateStepIndicator(`Inserting value ${value}...`);
    
    if (currentMode === 'challenge') {
        let questionPromise;
        if (!bst.root) {
            questionPromise = askChallengeQuestion(
                `Tree is empty. Where will ${value} be placed?`,
                ['As the root node', 'Left of root', 'Right of root', 'Cannot insert into empty tree'],
                0
            );
        } else {
            questionPromise = askChallengeQuestion(
                `Inserting ${value}. Root is ${bst.root.value}. Which subtree?`,
                [
                    value < bst.root.value ? `Left (${value} < ${bst.root.value})` : `Right (${value} > ${bst.root.value})`,
                    value < bst.root.value ? `Right (${value} > ${bst.root.value})` : `Left (${value} < ${bst.root.value})`,
                    'Replace the root',
                    'Insert at random position'
                ],
                0
            );
        }
        
        questionPromise.then(async () => {
            bst.insertValue(value);
            renderBST();
            updateMetrics(bst.comparisons, bst.operations);
            
            await askChallengeQuestion(
                `${value} inserted. BST property is: for each node, left children are ___ and right children are ___`,
                ['smaller, larger', 'larger, smaller', 'equal, equal', 'random, random'],
                0
            );
            
            updateStepIndicator(`Value ${value} inserted successfully.`);
            stopChallengeTimer();
        });
    } else {
        setTimeout(() => {
            bst.insertValue(value);
            renderBST();
            updateMetrics(bst.comparisons, bst.operations);
            updateStepIndicator(`Value ${value} inserted successfully.`);
            stopChallengeTimer();
        }, animationSpeed);
    }
    
    input.value = '';
}

function bstDelete() {
    const input = document.getElementById('bst-delete-value');
    const value = parseInt(input.value);
    if (isNaN(value)) return;
    
    bst.resetMetrics();
    startChallengeTimer();
    updateStepIndicator(`Deleting value ${value}...`);
    
    if (currentMode === 'challenge') {
        askChallengeQuestion(
            `Deleting ${value}. First we need to:`,
            ['Find the node in the tree', 'Delete the root', 'Rebuild the tree', 'Remove all nodes'],
            0
        ).then(async () => {
            const nodeToDelete = bst.findNode(bst.root, value);
            let childCount = 0;
            if (nodeToDelete) {
                if (nodeToDelete.left) childCount++;
                if (nodeToDelete.right) childCount++;
            }
            
            if (nodeToDelete && childCount === 2) {
                await askChallengeQuestion(
                    `Node ${value} has 2 children. How do we delete it?`,
                    ['Replace with inorder successor/predecessor', 'Just remove the node', 'Delete both children first', 'Cannot delete nodes with 2 children'],
                    0
                );
            } else if (nodeToDelete && childCount === 1) {
                await askChallengeQuestion(
                    `Node ${value} has 1 child. How do we delete it?`,
                    ['Replace node with its child', 'Delete the child too', 'Move child to root', 'Cannot delete'],
                    0
                );
            } else if (nodeToDelete) {
                await askChallengeQuestion(
                    `Node ${value} is a leaf (no children). How do we delete it?`,
                    ['Simply remove it', 'Replace with parent', 'Move to root', 'Cannot delete leaves'],
                    0
                );
            }
            
            bst.deleteValue(value);
            renderBST();
            updateMetrics(bst.comparisons, bst.operations);
            updateStepIndicator(`Value ${value} deleted from the tree.`);
            stopChallengeTimer();
        });
    } else {
        setTimeout(() => {
            bst.deleteValue(value);
            renderBST();
            updateMetrics(bst.comparisons, bst.operations);
            updateStepIndicator(`Value ${value} deleted from the tree.`);
            stopChallengeTimer();
        }, animationSpeed);
    }
    
    input.value = '';
}

async function bstSearch() {
    const input = document.getElementById('bst-search-value');
    const value = parseInt(input.value);
    if (isNaN(value)) return;
    
    bst.resetMetrics();
    startChallengeTimer();
    
    if (currentMode === 'challenge') {
        await askChallengeQuestion(
            `Searching for ${value} in BST. What makes BST search efficient?`,
            ['We eliminate half the tree at each step', 'We check every node', 'We start from leaves', 'We search randomly'],
            0
        );
        
        if (bst.root) {
            const direction = value < bst.root.value ? 'left' : (value > bst.root.value ? 'right' : 'found');
            await askChallengeQuestion(
                `Root is ${bst.root.value}, looking for ${value}. Where do we go?`,
                [
                    direction === 'found' ? 'Found at root!' : (direction === 'left' ? 'Left subtree' : 'Right subtree'),
                    direction === 'found' ? 'Left subtree' : (direction === 'left' ? 'Right subtree' : 'Left subtree'),
                    'Check both subtrees',
                    'Start over'
                ],
                0
            );
        }
    }
    
    const result = bst.searchValue(value);
    
    for (let i = 0; i < result.path.length; i++) {
        updateStepIndicator(`Comparing with node ${result.path[i]}...`);
        highlightBSTNode(result.path[i], 'highlight');
        
        if (currentMode === 'challenge' && i < result.path.length - 1) {
            const currentNode = result.path[i];
            const nextNode = result.path[i + 1];
            await askChallengeQuestion(
                `At node ${currentNode}, looking for ${value}. Next step?`,
                [
                    value < currentNode ? `Go left (${value} < ${currentNode})` : `Go right (${value} > ${currentNode})`,
                    value < currentNode ? `Go right` : `Go left`,
                    'Found it',
                    'Not in tree'
                ],
                0
            );
        }
        
        await sleep(animationSpeed);
    }
    
    if (result.found) {
        highlightBSTNode(value, 'found');
        updateStepIndicator(`Value ${value} found in the tree!`);
    } else {
        updateStepIndicator(`Value ${value} not found in the tree.`);
    }
    
    updateMetrics(bst.comparisons, bst.operations);
    stopChallengeTimer();
    
    setTimeout(() => {
        renderBST();
    }, animationSpeed * 2);
    
    input.value = '';
}

async function bstTraversal(type) {
    if (!bst.root) {
        updateStepIndicator('Tree is empty. Insert some values first.');
        return;
    }
    
    startChallengeTimer();
    
    if (currentMode === 'challenge') {
        const questions = {
            'inorder': ['Inorder traversal visits nodes in which order?', ['Left, Root, Right', 'Root, Left, Right', 'Left, Right, Root', 'Right, Root, Left'], 0],
            'preorder': ['Preorder traversal visits nodes in which order?', ['Root, Left, Right', 'Left, Root, Right', 'Left, Right, Root', 'Right, Root, Left'], 0],
            'postorder': ['Postorder traversal visits nodes in which order?', ['Left, Right, Root', 'Left, Root, Right', 'Root, Left, Right', 'Right, Root, Left'], 0]
        };
        const q = questions[type];
        await askChallengeQuestion(q[0], q[1], q[2]);
    }
    
    let result;
    let typeName;
    
    switch(type) {
        case 'inorder':
            result = bst.inorder(bst.root);
            typeName = 'Inorder (Left, Root, Right)';
            break;
        case 'preorder':
            result = bst.preorder(bst.root);
            typeName = 'Preorder (Root, Left, Right)';
            break;
        case 'postorder':
            result = bst.postorder(bst.root);
            typeName = 'Postorder (Left, Right, Root)';
            break;
    }
    
    updateStepIndicator(`${typeName} traversal: Starting...`);
    
    for (let i = 0; i < result.length; i++) {
        renderBST();
        highlightBSTNode(result[i], 'highlight');
        updateStepIndicator(`${typeName}: Visiting node ${result[i]} (${i + 1}/${result.length})`);
        await sleep(animationSpeed);
    }
    
    updateStepIndicator(`${typeName} traversal complete: [${result.join(', ')}]`);
    stopChallengeTimer();
    renderBST();
}

function bstGenerateRandom() {
    bst = new BST();
    const values = generateRandomArray(7, 1, 99);
    values.forEach(v => bst.insertValue(v));
    renderBST();
    updateStepIndicator(`Generated random BST with values: ${values.join(', ')}`);
    updateMetrics(bst.comparisons, bst.operations);
}

function bstClear() {
    bst = new BST();
    renderBST();
    updateStepIndicator('Tree cleared. Ready for new operations.');
    updateMetrics(0, 0);
}

function renderBST() {
    const svg = document.getElementById('bst-svg');
    if (!svg) return;
    
    svg.innerHTML = '';
    
    if (!bst.root) return;
    
    const width = svg.parentElement.clientWidth;
    const height = svg.parentElement.clientHeight;
    
    calculateBSTNodePositions(bst.root, width / 2, 40, width / 4);
    
    drawBSTEdges(svg, bst.root);
    drawBSTNodes(svg, bst.root);
}

function calculateBSTNodePositions(node, x, y, offset) {
    if (!node) return;
    
    node.x = x;
    node.y = y;
    
    if (node.left) {
        calculateBSTNodePositions(node.left, x - offset, y + 70, offset / 2);
    }
    if (node.right) {
        calculateBSTNodePositions(node.right, x + offset, y + 70, offset / 2);
    }
}

function drawBSTEdges(svg, node) {
    if (!node) return;
    
    if (node.left) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', node.x);
        line.setAttribute('y1', node.y);
        line.setAttribute('x2', node.left.x);
        line.setAttribute('y2', node.left.y);
        line.setAttribute('class', 'tree-edge');
        svg.appendChild(line);
        drawBSTEdges(svg, node.left);
    }
    
    if (node.right) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', node.x);
        line.setAttribute('y1', node.y);
        line.setAttribute('x2', node.right.x);
        line.setAttribute('y2', node.right.y);
        line.setAttribute('class', 'tree-edge');
        svg.appendChild(line);
        drawBSTEdges(svg, node.right);
    }
}

function drawBSTNodes(svg, node) {
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
    
    svg.appendChild(g);
    
    drawBSTNodes(svg, node.left);
    drawBSTNodes(svg, node.right);
}

function highlightBSTNode(value, className) {
    const nodes = document.querySelectorAll('#bst-svg .tree-node');
    nodes.forEach(node => {
        if (parseInt(node.getAttribute('data-value')) === value) {
            node.classList.add(className);
        }
    });
}
