// Mock distance data (in kilometers from Muğla, Turkey)
// Expanded for worldwide coverage
const distances = {
    // Turkey & Nearby
    'Istanbul': 600,
    'Ankara': 450,
    'Izmir': 200,
    'Athens': 800,
    
    // Western Europe
    'Berlin': 3000,
    'London': 3500,
    'Paris': 2800,
    'Amsterdam': 3100,
    'Brussels': 2900,
    'Madrid': 3200,
    'Barcelona': 2900,
    'Lisbon': 3800,
    'Rome': 1800,
    'Milan': 2100,
    'Vienna': 1600,
    
    // Eastern Europe
    'Prague': 2000,
    'Warsaw': 2200,
    'Budapest': 1700,
    'Bucharest': 1200,
    'Sofia': 900,
    'Belgrade': 1400,
    
    // Scandinavia
    'Stockholm': 3400,
    'Copenhagen': 3200,
    'Oslo': 3600,
    'Helsinki': 3800,
    
    // Middle East
    'Dubai': 4500,
    'Abu Dhabi': 4600,
    'Riyadh': 3800,
    'Tel Aviv': 1500,
    'Beirut': 1300,
    'Cairo': 1600,
    
    // North America
    'New York': 9500,
    'Los Angeles': 12500,
    'Chicago': 10000,
    'Toronto': 9200,
    'Vancouver': 11000,
    'Miami': 10500,
    'San Francisco': 12800,
    'Boston': 9300,
    
    // Asia
    'Tokyo': 10500,
    'Seoul': 9800,
    'Beijing': 8500,
    'Shanghai': 9000,
    'Hong Kong': 9200,
    'Singapore': 9500,
    'Bangkok': 8200,
    'Mumbai': 5500,
    'Delhi': 5200,
    
    // Other Major Cities
    'Moscow': 2800,
    'Sydney': 16000,
    'Melbourne': 16200,
    'Dubai': 4500,
    'Johannesburg': 8500
};

// Function to calculate distance for unknown cities (estimation based on latitude)
function estimateDistance(cityName) {
    // Simple estimation: assume average European distance
    const avgDistance = 2500;
    // Add some randomness based on city name length for variety
    const variation = (cityName.length * 100) % 1000;
    return avgDistance + variation;
}

// Function to find closest matching city name
function findClosestCity(input) {
    const normalizedInput = input.trim().toLowerCase();
    const cityNames = Object.keys(distances);
    
    // Exact match (case insensitive)
    for (let city of cityNames) {
        if (city.toLowerCase() === normalizedInput) {
            return city;
        }
    }
    
    // Partial match (starts with)
    for (let city of cityNames) {
        if (city.toLowerCase().startsWith(normalizedInput) || 
            normalizedInput.startsWith(city.toLowerCase())) {
            return city;
        }
    }
    
    // No match found
    return null;
}

// Container rates per kilometer (from PDF)
const rates = {
    'Small': 5,
    'Medium': 8,
    'Large': 12
};

// Container capacities (from PDF)
const capacities = {
    'Small': 2000,
    'Medium': 5000,
    'Large': 10000
};

// Form elements
const form = document.getElementById('shipmentForm');
const weightInput = document.getElementById('weight');
const containerTypeSelect = document.getElementById('containerType');
const destinationInput = document.getElementById('destination');
const pricePreview = document.getElementById('pricePreview');
const estimatedPrice = document.getElementById('estimatedPrice');

// Auto-select container based on weight
function autoSelectContainer(weight) {
    if (!weight || weight <= 0) return;
    
    if (weight > 10000) {
        alert('Maximum capacity is 10,000 kg. Please reduce weight or split into multiple shipments.');
        return;
    }
    
    let selectedType = '';
    if (weight <= 2000) {
        selectedType = 'Small';
    } else if (weight <= 5000) {
        selectedType = 'Medium';
    } else if (weight <= 10000) {
        selectedType = 'Large';
    }
    
    containerTypeSelect.value = selectedType;
}

// Live price calculation
function updatePricePreview() {
    const weight = parseFloat(weightInput.value);
    const containerType = containerTypeSelect.value;
    const destination = destinationInput.value.trim();

    if (weight && containerType && destination) {
        // Try to find the city and get distance
        let distance = 0;
        const matchedCity = findClosestCity(destination);
        
        if (matchedCity) {
            distance = distances[matchedCity];
        } else if (destination.length > 2) {
            // Estimate distance for unknown city
            distance = estimateDistance(destination);
        }
        
        if (distance > 0) {
            const rate = rates[containerType];
            const totalPrice = distance * rate;

            estimatedPrice.textContent = `₺${totalPrice.toLocaleString()} (${distance.toLocaleString()} km)`;
            pricePreview.classList.remove('hidden');
        } else {
            pricePreview.classList.add('hidden');
        }
    } else {
        pricePreview.classList.add('hidden');
    }
}

// Add event listeners for live preview
weightInput.addEventListener('input', function() {
    const weight = parseFloat(this.value);
    if (weight > 0) {
        autoSelectContainer(weight);
    }
    updatePricePreview();
});
containerTypeSelect.addEventListener('change', updatePricePreview);
destinationInput.addEventListener('input', updatePricePreview);

// Form submission
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values
    const customerName = document.getElementById('customerName').value.trim();
    const productName = document.getElementById('productName').value.trim();
    const category = document.getElementById('category').value;
    const weight = parseFloat(weightInput.value);
    const containerType = containerTypeSelect.value;
    const destinationInput = document.getElementById('destination').value.trim();

    // Validate and get destination
    if (!destinationInput || destinationInput.length < 2) {
        alert('Error: Please enter a valid destination city.');
        return;
    }

    // Find matching city or estimate distance
    let destination = destinationInput;
    let distance = 0;
    const matchedCity = findClosestCity(destinationInput);
    
    if (matchedCity) {
        destination = matchedCity;
        distance = distances[matchedCity];
    } else {
        // User entered unknown city - estimate distance
        distance = estimateDistance(destinationInput);
        // Capitalize first letter for display
        destination = destinationInput.charAt(0).toUpperCase() + destinationInput.slice(1);
        
        // Confirm with user
        const confirmMsg = `"${destination}" is not in our database. We've estimated the distance as ${distance.toLocaleString()} km from Muğla. Continue?`;
        if (!confirm(confirmMsg)) {
            return;
        }
    }

    // Validate weight is positive
    if (!weight || weight <= 0) {
        alert('Error: Please enter a valid weight greater than 0 kg.');
        return;
    }

    // Validate weight against container capacity
    const capacity = capacities[containerType];
    if (weight > capacity) {
        alert(`Error: Weight (${weight} kg) exceeds ${containerType} container capacity (${capacity} kg). Please choose a larger container or reduce weight.`);
        return;
    }

    // Check inventory
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const inventoryItem = inventory.find(item => item.category === category);
    
    if (!inventoryItem || inventoryItem.quantity < weight) {
        alert(`Error: Insufficient inventory for ${category}. Available: ${inventoryItem ? inventoryItem.quantity : 0} kg`);
        return;
    }

    // Check if there's available container capacity of the selected type
    const containers = JSON.parse(localStorage.getItem('containers') || '[]');
    const availableContainer = containers.find(c => 
        c.type === containerType && 
        (c.status === 'Empty' || c.status === 'Filling') &&
        (c.currentLoad + weight) <= c.capacity
    );

    if (!availableContainer) {
        alert(`There is no enough space at ${containerType.toLowerCase()} container. Please try a different container type or contact support.`);
        return;
    }

    // Calculate price
    const rate = rates[containerType];
    const totalPrice = distance * rate;

    // Generate unique Order ID
    const orderId = 'ORD-' + Date.now();

    // Create shipment object
    const shipment = {
        orderId: orderId,
        customerName: customerName,
        productName: productName,
        category: category,
        weight: weight,
        containerType: containerType,
        destination: destination,
        distance: distance,
        rate: rate,
        price: totalPrice,
        status: 'Pending',
        containerId: null,
        createdAt: new Date().toISOString(),
        estimatedDelivery: '5-7 business days'
    };

    // Save shipment to localStorage
    const shipments = JSON.parse(localStorage.getItem('shipments') || '[]');
    shipments.push(shipment);
    localStorage.setItem('shipments', JSON.stringify(shipments));

    // Update inventory
    inventoryItem.quantity -= weight;
    localStorage.setItem('inventory', JSON.stringify(inventory));

    // Redirect to result page with order ID
    window.location.href = `result.html?orderId=${orderId}`;
});

// Validate weight when container type changes
containerTypeSelect.addEventListener('change', function() {
    const weight = parseFloat(weightInput.value);
    const containerType = this.value;
    
    if (weight && containerType) {
        const capacity = capacities[containerType];
        if (weight > capacity) {
            alert(`Warning: Your shipment weight (${weight} kg) exceeds the ${containerType} container capacity (${capacity} kg). Please adjust weight or choose a larger container.`);
        }
    }
});

// Show helpful message when page loads
window.addEventListener('load', function() {
    // Check if inventory is low for any category
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const lowStockItems = inventory.filter(item => item.quantity < item.minStock);
    
    if (lowStockItems.length > 0) {
        console.log('Low stock warning:', lowStockItems);
    }
});
