// ===========================
// FLEET DATA (From PDF)
// ===========================
const fleetData = {
    ships: [
        {
            name: 'BlueSea',
            type: 'Ship',
            capacity: 100000,
            fuelCostPerKm: 40,
            crewCost: 20000,
            maintenance: 10000
        },
        {
            name: 'OceanStar',
            type: 'Ship',
            capacity: 120000,
            fuelCostPerKm: 50,
            crewCost: 25000,
            maintenance: 12000
        },
        {
            name: 'AegeanWind',
            type: 'Ship',
            capacity: 90000,
            fuelCostPerKm: 35,
            crewCost: 18000,
            maintenance: 8000
        }
    ],
    trucks: [
        {
            name: 'RoadKing',
            type: 'Truck',
            capacity: 10000,
            fuelCostPerKm: 8,
            crewCost: 3000,
            maintenance: 2000
        },
        {
            name: 'FastMove',
            type: 'Truck',
            capacity: 12000,
            fuelCostPerKm: 9,
            crewCost: 3500,
            maintenance: 2500
        },
        {
            name: 'CargoPro',
            type: 'Truck',
            capacity: 9000,
            fuelCostPerKm: 7,
            crewCost: 2800,
            maintenance: 2000
        },
        {
            name: 'HeavyLoad',
            type: 'Truck',
            capacity: 15000,
            fuelCostPerKm: 10,
            crewCost: 4000,
            maintenance: 3000
        }
    ]
};

// ===========================
// LOGIN FUNCTIONALITY
// ===========================
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const adminDashboard = document.getElementById('adminDashboard');
const logoutBtn = document.getElementById('logoutBtn');

// Check if already logged in
if (sessionStorage.getItem('adminLoggedIn') === 'true') {
    showDashboard();
} else {
    loginModal.style.display = 'flex';
}

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const password = document.getElementById('password').value;
    
    if (password === 'admin123') {
        sessionStorage.setItem('adminLoggedIn', 'true');
        showDashboard();
    } else {
        alert('Incorrect password. Please try again. (Hint: admin123)');
    }
});

logoutBtn.addEventListener('click', function() {
    sessionStorage.removeItem('adminLoggedIn');
    location.reload();
});

function showDashboard() {
    loginModal.style.display = 'none';
    adminDashboard.classList.remove('hidden');
    initializeDashboard();
}

// ===========================
// TAB NAVIGATION
// ===========================
const menuItems = document.querySelectorAll('.menu-item');
const tabContents = document.querySelectorAll('.tab-content');

menuItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all items
        menuItems.forEach(mi => mi.classList.remove('active'));
        tabContents.forEach(tc => tc.classList.remove('active'));
        
        // Add active class to clicked item
        this.classList.add('active');
        const tabId = this.getAttribute('data-tab');
        document.getElementById(`tab-${tabId}`).classList.add('active');
        
        // Refresh tab content
        refreshTab(tabId);
    });
});

// ===========================
// INITIALIZE DASHBOARD
// ===========================
function initializeDashboard() {
    loadShipmentsTab();
    loadContainersTab();
    loadFleetTab();
    loadFinancialsTab();
    loadInventoryTab();
    loadReportsTab();
}

function refreshTab(tabId) {
    switch(tabId) {
        case 'shipments':
            loadShipmentsTab();
            break;
        case 'containers':
            loadContainersTab();
            break;
        case 'fleet':
            loadFleetTab();
            break;
        case 'financials':
            loadFinancialsTab();
            break;
        case 'inventory':
            loadInventoryTab();
            break;
        case 'reports':
            loadReportsTab();
            break;
    }
}

// ===========================
// SHIPMENTS TAB
// ===========================
function loadShipmentsTab() {
    const shipments = JSON.parse(localStorage.getItem('shipments') || '[]');
    
    // Update stats
    document.getElementById('totalShipments').textContent = shipments.length;
    document.getElementById('pendingShipments').textContent = 
        shipments.filter(s => s.status === 'Pending').length;
    document.getElementById('completedShipments').textContent = 
        shipments.filter(s => s.status === 'Delivered').length;
    
    // Populate table
    const tbody = document.getElementById('shipmentsTableBody');
    tbody.innerHTML = '';
    
    if (shipments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 2rem; color: var(--text-gray);">No shipments found. Create a shipment from the customer portal.</td></tr>';
        return;
    }
    
    shipments.forEach(shipment => {
        const row = document.createElement('tr');
        const canDeliver = shipment.status === 'In Transit';
        
        row.innerHTML = `
            <td><strong>${shipment.orderId}</strong></td>
            <td>${shipment.customerName}</td>
            <td>${shipment.productName}</td>
            <td>${shipment.weight}</td>
            <td>${shipment.destination}</td>
            <td>${shipment.containerId || '<span style="color: var(--text-gray);">Not assigned</span>'}</td>
            <td>₺${shipment.price.toLocaleString()}</td>
            <td><span class="badge badge-${shipment.status.toLowerCase().replace(/ /g, '-')}">${shipment.status}</span></td>
            <td>
                ${canDeliver ? `
                    <button class="btn btn-success" onclick="markAsDelivered('${shipment.orderId}')" style="padding: 0.4rem 0.8rem; font-size: 0.85rem; background: var(--success);">
                        ✓ Deliver
                    </button>
                ` : '<span style="color: var(--text-gray); font-size: 0.85rem;">—</span>'}
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Mark shipment as delivered
function markAsDelivered(orderId) {
    const shipments = JSON.parse(localStorage.getItem('shipments') || '[]');
    const shipment = shipments.find(s => s.orderId === orderId);
    
    if (!shipment) {
        alert('Shipment not found!');
        return;
    }
    
    const confirmMsg = window.confirm(
        `Mark shipment ${orderId} as Delivered?\n\n` +
        `Customer: ${shipment.customerName}\n` +
        `Product: ${shipment.productName}\n` +
        `Destination: ${shipment.destination}\n\n` +
        `This will complete the delivery process.`
    );
    
    if (!confirmMsg) return;
    
    // Update shipment status
    shipment.status = 'Delivered';
    localStorage.setItem('shipments', JSON.stringify(shipments));
    
    alert(`✅ Shipment ${orderId} has been marked as Delivered!`);
    
    // Refresh displays
    loadShipmentsTab();
    loadFinancialsTab();
}

// ===========================
// CONTAINER OPTIMIZATION TAB
// ===========================
function loadContainersTab() {
    const shipments = JSON.parse(localStorage.getItem('shipments') || '[]');
    const pendingShipments = shipments.filter(s => s.status === 'Pending');
    
    const container = document.getElementById('pendingShipmentsContainer');
    const optimizeBtn = document.getElementById('optimizeBtn');
    
    if (pendingShipments.length === 0) {
        container.innerHTML = '<p style="color: var(--text-gray); padding: 1rem;">No pending shipments to optimize.</p>';
        if (optimizeBtn) optimizeBtn.disabled = true;
    } else {
        if (optimizeBtn) optimizeBtn.disabled = false;
        let html = '<table><thead><tr><th>Order ID</th><th>Product</th><th>Weight (kg)</th><th>Destination</th><th>Container Type</th></tr></thead><tbody>';
        
        pendingShipments.forEach(s => {
            html += `<tr>
                <td>${s.orderId}</td>
                <td>${s.productName}</td>
                <td><strong>${s.weight}</strong></td>
                <td>${s.destination}</td>
                <td>${s.containerType}</td>
            </tr>`;
        });
        
        html += '</tbody></table>';
        container.innerHTML = html;
    }
    
    // Display container status
    displayContainerStatus();
}

function displayContainerStatus() {
    const containers = JSON.parse(localStorage.getItem('containers') || '[]');
    const grid = document.getElementById('containerStatusGrid');
    
    // Group by type
    const types = ['Large', 'Medium', 'Small'];
    grid.innerHTML = '';
    
    types.forEach(type => {
        const typeContainers = containers.filter(c => c.type === type);
        const empty = typeContainers.filter(c => c.status === 'Empty').length;
        const filling = typeContainers.filter(c => c.status === 'Filling').length;
        const ready = typeContainers.filter(c => c.status === 'Ready for Transport').length;
        
        const card = document.createElement('div');
        card.className = 'stat-card';
        card.innerHTML = `
            <h3>${type} Containers</h3>
            <p style="margin-top: 0.5rem;">Empty: ${empty} | Filling: ${filling} | Ready: ${ready}</p>
        `;
        grid.appendChild(card);
    });
    
    // Add detailed container list with manual dispatch option
    displayDetailedContainers();
}

function displayDetailedContainers() {
    const containers = JSON.parse(localStorage.getItem('containers') || '[]');
    const activeContainers = containers.filter(c => c.status === 'Filling' || c.status === 'Ready for Transport');
    
    const detailsDiv = document.getElementById('containerDetails');
    if (!detailsDiv) return;
    
    if (activeContainers.length === 0) {
        detailsDiv.innerHTML = '<p style="color: var(--text-gray); text-align: center; padding: 2rem;">No containers currently active.</p>';
        return;
    }
    
    let html = '<h4 style="margin-top: 2rem; margin-bottom: 1rem; color: var(--primary-purple);">Active Containers</h4>';
    html += '<div style="display: grid; gap: 1rem;">';
    
    activeContainers.forEach(container => {
        const percentage = ((container.currentLoad / container.capacity) * 100).toFixed(1);
        const isFilling = container.status === 'Filling';
        const isReady = container.status === 'Ready for Transport';
        const statusColor = isReady ? 'var(--success)' : 'var(--warning)';
        
        html += `
            <div class="card" style="padding: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <strong style="font-size: 1.1rem;">${container.id}</strong>
                    <span style="color: ${statusColor}; font-weight: 600;">${container.status}</span>
                </div>
                <p style="margin: 0.5rem 0;">
                    <strong>Load:</strong> ${container.currentLoad.toLocaleString()} / ${container.capacity.toLocaleString()} kg (${percentage}%)
                </p>
                <div style="background: var(--bg-light); height: 20px; border-radius: 10px; overflow: hidden; margin: 0.5rem 0;">
                    <div style="background: ${percentage >= 80 ? 'var(--success)' : 'var(--warning)'}; height: 100%; width: ${percentage}%; transition: width 0.3s;"></div>
                </div>
                <p style="margin: 0.5rem 0; font-size: 0.9rem; color: var(--text-gray);">
                    Shipments: ${container.shipments ? container.shipments.length : 0}
                </p>
                ${isFilling && container.currentLoad > 0 ? `
                    <button class="btn btn-primary" onclick="manualDispatch('${container.id}')" style="width: 100%; margin-top: 0.5rem;">
                        🚢 Mark as Ready for Transport
                    </button>
                ` : ''}
                ${isReady ? `
                    <button class="btn btn-success" onclick="startShipment('${container.id}')" style="width: 100%; margin-top: 0.5rem; background: var(--success);">
                        🚀 Start Shipment (In Transit)
                    </button>
                ` : ''}
            </div>
        `;
    });
    
    html += '</div>';
    detailsDiv.innerHTML = html;
}

// Manual dispatch function - marks container as Ready for Transport
function manualDispatch(containerId) {
    const containers = JSON.parse(localStorage.getItem('containers') || '[]');
    const container = containers.find(c => c.id === containerId);
    
    if (!container) {
        alert('Container not found!');
        return;
    }
    
    const percentage = ((container.currentLoad / container.capacity) * 100).toFixed(1);
    
    const confirmMsg = window.confirm(
        `Mark container ${containerId} as Ready for Transport?\n\n` +
        `Current Load: ${container.currentLoad} kg / ${container.capacity} kg (${percentage}%)\n` +
        `Shipments: ${container.shipments ? container.shipments.length : 0}\n\n` +
        `This will prepare the container for loading onto fleet.`
    );
    
    if (!confirmMsg) return;
    
    // Update container status
    container.status = 'Ready for Transport';
    localStorage.setItem('containers', JSON.stringify(containers));
    
    // Update shipments
    const shipments = JSON.parse(localStorage.getItem('shipments') || '[]');
    if (container.shipments) {
        container.shipments.forEach(shipmentId => {
            const shipment = shipments.find(s => s.orderId === shipmentId);
            if (shipment) {
                shipment.status = 'Ready for Transport';
            }
        });
        localStorage.setItem('shipments', JSON.stringify(shipments));
    }
    
    alert(`✅ Container ${containerId} is now Ready for Transport!`);
    
    // Refresh displays
    loadContainersTab();
    loadShipmentsTab();
}

// Start shipment function - marks container and shipments as In Transit
function startShipment(containerId) {
    const containers = JSON.parse(localStorage.getItem('containers') || '[]');
    const container = containers.find(c => c.id === containerId);
    
    if (!container) {
        alert('Container not found!');
        return;
    }
    
    const confirmMsg = window.confirm(
        `Start shipment for container ${containerId}?\n\n` +
        `Load: ${container.currentLoad} kg / ${container.capacity} kg\n` +
        `Shipments: ${container.shipments ? container.shipments.length : 0}\n\n` +
        `This will mark all shipments as "In Transit" and the container will be dispatched.`
    );
    
    if (!confirmMsg) return;
    
    // Update shipments to In Transit
    const shipments = JSON.parse(localStorage.getItem('shipments') || '[]');
    if (container.shipments) {
        container.shipments.forEach(shipmentId => {
            const shipment = shipments.find(s => s.orderId === shipmentId);
            if (shipment) {
                shipment.status = 'In Transit';
            }
        });
        localStorage.setItem('shipments', JSON.stringify(shipments));
    }
    
    // Reset container after dispatch (it's now on the road/sea)
    container.status = 'Empty';
    container.currentLoad = 0;
    container.shipments = [];
    localStorage.setItem('containers', JSON.stringify(containers));
    
    alert(`🚀 Shipment started! Container ${containerId} is now In Transit.\nContainer has been reset and is available for new shipments.`);
    
    // Refresh displays
    loadContainersTab();
    loadShipmentsTab();
}

// Optimize Containers Button
const optimizeBtn = document.getElementById('optimizeBtn');
if (optimizeBtn) {
    optimizeBtn.addEventListener('click', function() {
        optimizeContainers();
    });
}

function optimizeContainers() {
    const shipments = JSON.parse(localStorage.getItem('shipments') || '[]');
    const containers = JSON.parse(localStorage.getItem('containers') || '[]');
    
    // Get pending shipments
    let pendingShipments = shipments.filter(s => s.status === 'Pending');
    
    if (pendingShipments.length === 0) {
        alert('No pending shipments to optimize.');
        return;
    }
    
    // Sort by weight (largest first) - First-Fit Decreasing Algorithm
    pendingShipments.sort((a, b) => b.weight - a.weight);
    
    let results = [];
    let assignedCount = 0;
    
    // Try to fit each shipment into containers
    pendingShipments.forEach(shipment => {
        // Find containers of the same type that have space
        const availableContainers = containers.filter(c => 
            c.type === shipment.containerType &&
            (c.status === 'Empty' || c.status === 'Filling') &&
            (c.currentLoad + shipment.weight) <= c.capacity
        );
        
        if (availableContainers.length > 0) {
            // Use first available container (First-Fit)
            const container = availableContainers[0];
            
            // Assign shipment to container
            container.currentLoad += shipment.weight;
            container.shipments = container.shipments || [];
            container.shipments.push(shipment.orderId);
            
            // Update container status
            if (container.status === 'Empty') {
                container.status = 'Filling';
            }
            
            // Check if container is now full or optimally packed (>80% capacity)
            if (container.currentLoad >= container.capacity * 0.8) {
                container.status = 'Ready for Transport';
                // Update all shipments in this container to Ready for Transport
                shipment.status = 'Ready for Transport';
            } else {
                // Container is still filling, shipment stays pending
                shipment.status = 'Pending';
            }
            
            // Update shipment
            shipment.containerId = container.id;
            
            assignedCount++;
            results.push(`✅ ${shipment.orderId} (${shipment.weight} kg) → ${container.id} (${container.currentLoad}/${container.capacity} kg)`);
        } else {
            results.push(`⚠️ ${shipment.orderId} (${shipment.weight} kg) - No available ${shipment.containerType} container`);
        }
    });
    
    // Save updated data
    localStorage.setItem('shipments', JSON.stringify(shipments));
    localStorage.setItem('containers', JSON.stringify(containers));
    
    // Display results
    const resultDiv = document.getElementById('optimizationResult');
    resultDiv.classList.remove('hidden');
    
    let html = `<div class="alert alert-success">
        <span>✅</span>
        <div>
            <strong>Optimization Complete!</strong>
            <p style="margin-top: 0.5rem;">${assignedCount} shipments were assigned to containers.</p>
        </div>
    </div>`;
    
    html += '<h4 style="margin-top: 1rem; color: var(--primary-purple);">Assignment Details:</h4><ul style="line-height: 2;">';
    results.forEach(r => {
        html += `<li>${r}</li>`;
    });
    html += '</ul>';
    
    resultDiv.innerHTML = html;
    
    // Refresh displays
    loadContainersTab();
    loadShipmentsTab();
};

// ===========================
// FLEET MANAGEMENT TAB
// ===========================
function loadFleetTab() {
    // Populate ships table
    const shipsBody = document.getElementById('shipsTableBody');
    shipsBody.innerHTML = '';
    
    fleetData.ships.forEach(ship => {
        const totalFixed = ship.crewCost + ship.maintenance;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${ship.name}</strong></td>
            <td>${ship.type}</td>
            <td>${ship.capacity.toLocaleString()}</td>
            <td>₺${ship.fuelCostPerKm}</td>
            <td>₺${ship.crewCost.toLocaleString()}</td>
            <td>₺${ship.maintenance.toLocaleString()}</td>
            <td><strong>₺${totalFixed.toLocaleString()}</strong></td>
        `;
        shipsBody.appendChild(row);
    });
    
    // Populate trucks table
    const trucksBody = document.getElementById('trucksTableBody');
    trucksBody.innerHTML = '';
    
    fleetData.trucks.forEach(truck => {
        const totalFixed = truck.crewCost + truck.maintenance;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${truck.name}</strong></td>
            <td>${truck.type}</td>
            <td>${truck.capacity.toLocaleString()}</td>
            <td>₺${truck.fuelCostPerKm}</td>
            <td>₺${truck.crewCost.toLocaleString()}</td>
            <td>₺${truck.maintenance.toLocaleString()}</td>
            <td><strong>₺${totalFixed.toLocaleString()}</strong></td>
        `;
        trucksBody.appendChild(row);
    });
    
    // Populate vehicle selector for calculator
    const vehicleSelect = document.getElementById('vehicleSelect');
    vehicleSelect.innerHTML = '<option value="">-- Select Vehicle --</option>';
    
    fleetData.ships.forEach(ship => {
        const option = document.createElement('option');
        option.value = JSON.stringify(ship);
        option.textContent = `${ship.name} (Ship)`;
        vehicleSelect.appendChild(option);
    });
    
    fleetData.trucks.forEach(truck => {
        const option = document.createElement('option');
        option.value = JSON.stringify(truck);
        option.textContent = `${truck.name} (Truck)`;
        vehicleSelect.appendChild(option);
    });
}

// Trip Expense Calculator
document.getElementById('expenseCalculatorForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const vehicleSelectValue = document.getElementById('vehicleSelect').value;
    if (!vehicleSelectValue) {
        alert('Please select a vehicle first.');
        return;
    }
    
    const vehicleData = JSON.parse(vehicleSelectValue);
    const distance = parseFloat(document.getElementById('distanceInput').value);
    
    // Validate distance
    if (!distance || distance <= 0) {
        alert('Please enter a valid distance greater than 0 km.');
        return;
    }
    
    // Calculate: (Fuel Cost/km * Distance) + Crew Cost + Maintenance
    const fuelCost = vehicleData.fuelCostPerKm * distance;
    const totalExpense = fuelCost + vehicleData.crewCost + vehicleData.maintenance;
    
    const resultDiv = document.getElementById('expenseResult');
    resultDiv.classList.remove('hidden');
    resultDiv.innerHTML = `
        <div class="alert alert-info">
            <span>💰</span>
            <div>
                <h4 style="margin-bottom: 1rem;">Trip Expense Calculation</h4>
                <p><strong>Vehicle:</strong> ${vehicleData.name}</p>
                <p><strong>Distance:</strong> ${distance.toLocaleString()} km</p>
                <hr style="margin: 1rem 0; border: none; border-top: 1px solid var(--border-gray);">
                <p><strong>Fuel Cost:</strong> ₺${vehicleData.fuelCostPerKm} × ${distance.toLocaleString()} km = ₺${fuelCost.toLocaleString()}</p>
                <p><strong>Crew Cost:</strong> ₺${vehicleData.crewCost.toLocaleString()}</p>
                <p><strong>Maintenance:</strong> ₺${vehicleData.maintenance.toLocaleString()}</p>
                <hr style="margin: 1rem 0; border: none; border-top: 2px solid var(--primary-purple);">
                <p style="font-size: 1.25rem;"><strong>Total Expense:</strong> <span style="color: var(--primary-purple);">₺${totalExpense.toLocaleString()}</span></p>
            </div>
        </div>
    `;
});

// ===========================
// FINANCIALS TAB
// ===========================
function loadFinancialsTab() {
    const shipments = JSON.parse(localStorage.getItem('shipments') || '[]');
    
    // Calculate revenue from completed/ready shipments
    const completedShipments = shipments.filter(s => s.status === 'Delivered' || s.status === 'Ready for Transport');
    const revenue = completedShipments.reduce((sum, s) => sum + s.price, 0);
    
    // Calculate fleet expenses based on actual deliveries
    // Only count shipments that are "In Transit" or "Delivered"
    const deliveredShipments = shipments.filter(s => s.status === 'In Transit' || s.status === 'Delivered');
    
    // Fleet expense calculation: For each delivered shipment, calculate trip cost
    // Formula from PDF: (Fuel Cost/km × Distance) + Crew Cost + Maintenance
    let fleetExpenses = 0;
    deliveredShipments.forEach(shipment => {
        // Assume ships for international (>1500km), trucks for domestic
        if (shipment.distance > 1500) {
            // Use BlueSea ship costs (from PDF)
            const fuelCost = 40 * shipment.distance;
            const crewCost = 20000;
            const maintenance = 10000;
            fleetExpenses += fuelCost + crewCost + maintenance;
        } else {
            // Use RoadKing truck costs (from PDF)
            const fuelCost = 8 * shipment.distance;
            const crewCost = 3000;
            const maintenance = 2000;
            fleetExpenses += fuelCost + crewCost + maintenance;
        }
    });
    
    const otherExpenses = 80000; // Fixed overhead from PDF
    const totalExpenses = fleetExpenses + otherExpenses;
    
    // Calculations
    const netIncome = revenue - totalExpenses;
    const tax = netIncome > 0 ? netIncome * 0.20 : 0;
    const profitAfterTax = netIncome - tax;
    
    // Update summary cards
    document.getElementById('totalRevenue').textContent = `₺${revenue.toLocaleString()}`;
    document.getElementById('totalExpenses').textContent = `₺${totalExpenses.toLocaleString()}`;
    document.getElementById('netIncome').textContent = `₺${netIncome.toLocaleString()}`;
    document.getElementById('profitAfterTax').textContent = `₺${profitAfterTax.toLocaleString()}`;
    
    // Update table
    const tbody = document.getElementById('financialsTableBody');
    tbody.innerHTML = `
        <tr>
            <td><strong>Total Revenue</strong></td>
            <td style="color: var(--success);"><strong>₺${revenue.toLocaleString()}</strong></td>
        </tr>
        <tr>
            <td>Fleet Operating Expenses</td>
            <td style="color: var(--danger);">₺${fleetExpenses.toLocaleString()}</td>
        </tr>
        <tr>
            <td>Other Expenses</td>
            <td style="color: var(--danger);">₺${otherExpenses.toLocaleString()}</td>
        </tr>
        <tr style="background-color: var(--bg-light);">
            <td><strong>Total Expenses</strong></td>
            <td style="color: var(--danger);"><strong>₺${totalExpenses.toLocaleString()}</strong></td>
        </tr>
        <tr style="background-color: var(--bg-light);">
            <td><strong>Net Income</strong></td>
            <td><strong>₺${netIncome.toLocaleString()}</strong></td>
        </tr>
        <tr>
            <td>Tax (20%)</td>
            <td style="color: var(--danger);">₺${tax.toLocaleString()}</td>
        </tr>
        <tr style="background: linear-gradient(135deg, rgba(123, 44, 191, 0.1) 0%, rgba(157, 78, 221, 0.1) 100%);">
            <td><strong style="color: var(--primary-purple);">Profit After Tax</strong></td>
            <td><strong style="color: var(--primary-purple); font-size: 1.25rem;">₺${profitAfterTax.toLocaleString()}</strong></td>
        </tr>
    `;
}

// ===========================
// INVENTORY TAB
// ===========================
function loadInventoryTab() {
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    
    // Check for low stock and display alerts
    const alertsDiv = document.getElementById('lowStockAlerts');
    alertsDiv.innerHTML = '';
    
    const lowStockItems = inventory.filter(item => item.quantity < item.minStock);
    
    if (lowStockItems.length > 0) {
        lowStockItems.forEach(item => {
            const alert = document.createElement('div');
            alert.className = 'alert alert-warning';
            alert.innerHTML = `
                <span>⚠️</span>
                <div>
                    <strong>Low Stock Warning!</strong>
                    <p style="margin-top: 0.5rem;">
                        ${item.category} stock is running low! 
                        Current: ${item.quantity.toLocaleString()} kg / Minimum: ${item.minStock.toLocaleString()} kg
                    </p>
                </div>
            `;
            alertsDiv.appendChild(alert);
        });
    }
    
    // Populate inventory table
    const tbody = document.getElementById('inventoryTableBody');
    tbody.innerHTML = '';
    
    inventory.forEach((item, index) => {
        const status = item.quantity >= item.minStock ? 'Sufficient' : 'Low Stock';
        const statusColor = item.quantity >= item.minStock ? 'var(--success)' : 'var(--warning)';
        const percentage = (item.quantity / item.minStock * 100).toFixed(0);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${item.category}</strong></td>
            <td>${item.quantity.toLocaleString()}</td>
            <td>${item.minStock.toLocaleString()}</td>
            <td><span style="color: ${statusColor}; font-weight: 600;">${status}</span></td>
            <td>
                <div style="background: var(--bg-light); height: 20px; border-radius: 10px; overflow: hidden;">
                    <div style="background: ${statusColor}; height: 100%; width: ${Math.min(percentage, 100)}%; transition: width 0.3s;"></div>
                </div>
                <small style="color: var(--text-gray);">${percentage}% of minimum stock</small>
            </td>
            <td>
                <button class="btn btn-primary" onclick="addStock('${item.category}')" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
                    ➕ Add Stock
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Add stock function
function addStock(category) {
    const amount = prompt(`How many kg would you like to add to ${category} inventory?`);
    
    if (amount === null) return; // User cancelled
    
    const quantity = parseFloat(amount);
    
    if (isNaN(quantity) || quantity <= 0) {
        alert('Please enter a valid positive number.');
        return;
    }
    
    // Update inventory
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const item = inventory.find(i => i.category === category);
    
    if (item) {
        item.quantity += quantity;
        localStorage.setItem('inventory', JSON.stringify(inventory));
        alert(`✅ Successfully added ${quantity.toLocaleString()} kg to ${category} inventory!\nNew total: ${item.quantity.toLocaleString()} kg`);
        loadInventoryTab(); // Refresh the table
    }
}

// ===========================
// REPORTS TAB
// ===========================
function loadReportsTab() {
    const shipments = JSON.parse(localStorage.getItem('shipments') || '[]');
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const containers = JSON.parse(localStorage.getItem('containers') || '[]');
    
    // Financial Summary - Same calculation as Financials tab
    const completedShipments = shipments.filter(s => s.status === 'Delivered' || s.status === 'Ready for Transport');
    const revenue = completedShipments.reduce((sum, s) => sum + s.price, 0);
    
    // Calculate fleet expenses dynamically (same as Financials tab)
    const deliveredShipments = shipments.filter(s => s.status === 'In Transit' || s.status === 'Delivered');
    let fleetExpenses = 0;
    deliveredShipments.forEach(shipment => {
        if (shipment.distance > 1500) {
            const fuelCost = 40 * shipment.distance;
            const crewCost = 20000;
            const maintenance = 10000;
            fleetExpenses += fuelCost + crewCost + maintenance;
        } else {
            const fuelCost = 8 * shipment.distance;
            const crewCost = 3000;
            const maintenance = 2000;
            fleetExpenses += fuelCost + crewCost + maintenance;
        }
    });
    
    const otherExpenses = 80000;
    const expenses = fleetExpenses + otherExpenses;
    const netIncome = revenue - expenses;
    const tax = netIncome > 0 ? netIncome * 0.20 : 0;
    const profit = netIncome - tax;
    
    document.getElementById('reportFinancials').innerHTML = `
        <div class="grid grid-2">
            <div class="stat-card">
                <h3>Revenue</h3>
                <div class="stat-value" style="color: var(--success);">₺${revenue.toLocaleString()}</div>
            </div>
            <div class="stat-card">
                <h3>Expenses</h3>
                <div class="stat-value" style="color: var(--danger);">₺${expenses.toLocaleString()}</div>
            </div>
            <div class="stat-card">
                <h3>Net Income</h3>
                <div class="stat-value">₺${netIncome.toLocaleString()}</div>
            </div>
            <div class="stat-card">
                <h3>Profit After Tax</h3>
                <div class="stat-value">₺${profit.toLocaleString()}</div>
            </div>
        </div>
    `;
    
    // Operational Metrics
    const readyContainers = containers.filter(c => c.status === 'Ready for Transport');
    const avgUtilization = readyContainers.length > 0 
        ? (readyContainers.reduce((sum, c) => sum + (c.currentLoad / c.capacity * 100), 0) / readyContainers.length).toFixed(1)
        : 0;
    
    // Most popular route
    const destinationCounts = {};
    shipments.forEach(s => {
        destinationCounts[s.destination] = (destinationCounts[s.destination] || 0) + 1;
    });
    const mostPopular = Object.keys(destinationCounts).length > 0
        ? Object.keys(destinationCounts).reduce((a, b) => destinationCounts[a] > destinationCounts[b] ? a : b)
        : 'N/A';
    
    document.getElementById('reportMetrics').innerHTML = `
        <div class="stat-card">
            <h3>Total Shipments</h3>
            <div class="stat-value">${shipments.length}</div>
        </div>
        <div class="stat-card">
            <h3>Container Utilization</h3>
            <div class="stat-value">${avgUtilization}%</div>
        </div>
        <div class="stat-card">
            <h3>Most Popular Route</h3>
            <div class="stat-value" style="font-size: 1.25rem;">Muğla → ${mostPopular}</div>
        </div>
    `;
    
    // Products sold by category
    const categoryCounts = {};
    const categoryWeights = {};
    shipments.forEach(s => {
        categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
        categoryWeights[s.category] = (categoryWeights[s.category] || 0) + s.weight;
    });
    
    let productsHtml = '';
    if (Object.keys(categoryCounts).length === 0) {
        productsHtml = '<p style="color: var(--text-gray); padding: 1rem;">No products sold yet.</p>';
    } else {
        productsHtml = '<table><thead><tr><th>Category</th><th>Orders</th><th>Total Weight (kg)</th></tr></thead><tbody>';
        Object.keys(categoryCounts).forEach(cat => {
            productsHtml += `
                <tr>
                    <td><strong>${cat}</strong></td>
                    <td>${categoryCounts[cat]}</td>
                    <td>${categoryWeights[cat].toLocaleString()}</td>
                </tr>
            `;
        });
        productsHtml += '</tbody></table>';
    }
    document.getElementById('reportProductsSold').innerHTML = productsHtml;
    
    // Remaining inventory
    let inventoryHtml = '';
    if (inventory.length === 0) {
        inventoryHtml = '<p style="color: var(--text-gray); padding: 1rem;">No inventory data available.</p>';
    } else {
        inventoryHtml = '<table><thead><tr><th>Category</th><th>Remaining (kg)</th><th>Status</th></tr></thead><tbody>';
        inventory.forEach(item => {
            const status = item.quantity >= item.minStock ? '✅ Sufficient' : '⚠️ Low';
            inventoryHtml += `
                <tr>
                    <td><strong>${item.category}</strong></td>
                    <td>${item.quantity.toLocaleString()}</td>
                    <td>${status}</td>
                </tr>
            `;
        });
        inventoryHtml += '</tbody></table>';
    }
    document.getElementById('reportInventory').innerHTML = inventoryHtml;
}

// PDF Export Functionality
const exportPdfBtn = document.getElementById('exportPdfBtn');
if (exportPdfBtn) {
    exportPdfBtn.addEventListener('click', function() {
        // Check if jsPDF is available
        if (typeof window.jspdf === 'undefined') {
            alert('❌ PDF library not loaded. Please check your internet connection and refresh the page.');
            return;
        }
        
        // Access jsPDF from window
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(123, 44, 191);
    doc.text('BlueBerry Logistics Report', 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Get data
    const shipments = JSON.parse(localStorage.getItem('shipments') || '[]');
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    
    // Financial Summary
    const completedShipments = shipments.filter(s => s.status === 'Delivered' || s.status === 'Ready for Transport');
    const revenue = completedShipments.reduce((sum, s) => sum + s.price, 0);
    const expenses = 230000;
    const netIncome = revenue - expenses;
    const tax = netIncome > 0 ? netIncome * 0.20 : 0;
    const profit = netIncome - tax;
    
    doc.setFontSize(14);
    doc.setTextColor(123, 44, 191);
    doc.text('Financial Summary', 20, 45);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    let y = 55;
    doc.text(`Revenue: ₺${revenue.toLocaleString()}`, 20, y);
    y += 7;
    doc.text(`Expenses: ₺${expenses.toLocaleString()}`, 20, y);
    y += 7;
    doc.text(`Net Income: ₺${netIncome.toLocaleString()}`, 20, y);
    y += 7;
    doc.text(`Tax (20%): ₺${tax.toLocaleString()}`, 20, y);
    y += 7;
    doc.text(`Profit After Tax: ₺${profit.toLocaleString()}`, 20, y);
    
    // Operational Metrics
    y += 15;
    doc.setFontSize(14);
    doc.setTextColor(123, 44, 191);
    doc.text('Operational Metrics', 20, y);
    
    y += 10;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Shipments: ${shipments.length}`, 20, y);
    y += 7;
    doc.text(`Pending: ${shipments.filter(s => s.status === 'Pending').length}`, 20, y);
    y += 7;
    doc.text(`Ready for Transport: ${shipments.filter(s => s.status === 'Ready for Transport').length}`, 20, y);
    y += 7;
    doc.text(`In Transit: ${shipments.filter(s => s.status === 'In Transit').length}`, 20, y);
    y += 7;
    doc.text(`Delivered: ${shipments.filter(s => s.status === 'Delivered').length}`, 20, y);
    
    // Inventory
    y += 15;
    doc.setFontSize(14);
    doc.setTextColor(123, 44, 191);
    doc.text('Inventory Status', 20, y);
    
    y += 10;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    inventory.forEach(item => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        const status = item.quantity >= item.minStock ? 'Sufficient' : 'Low Stock';
        doc.text(`${item.category}: ${item.quantity.toLocaleString()} kg (${status})`, 20, y);
        y += 7;
    });
    
        // Save PDF
        doc.save('blueberry-logistics-report.pdf');
        
        alert('✅ Report exported successfully!');
    });
}
