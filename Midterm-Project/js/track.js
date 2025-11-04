// Check if order ID is provided in URL
const urlParams = new URLSearchParams(window.location.search);
const prefilledOrderId = urlParams.get('orderId');

if (prefilledOrderId) {
    document.getElementById('orderIdInput').value = prefilledOrderId;
    // Auto-submit the form
    setTimeout(() => {
        document.getElementById('trackForm').dispatchEvent(new Event('submit'));
    }, 500);
}

// Status descriptions
const statusDescriptions = {
    'Pending': 'Your shipment has been received and is awaiting container assignment and optimization.',
    'Ready for Transport': 'Your shipment has been assigned to a container and is ready to be loaded onto our fleet.',
    'In Transit': 'Your shipment is currently on the way to the destination.',
    'Delivered': 'Your shipment has been successfully delivered to the destination.'
};

// Handle form submission
document.getElementById('trackForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const orderId = document.getElementById('orderIdInput').value.trim();
    
    if (!orderId) {
        alert('Please enter an Order ID');
        return;
    }

    // Search for shipment in localStorage
    const shipments = JSON.parse(localStorage.getItem('shipments') || '[]');
    const shipment = shipments.find(s => s.orderId === orderId);

    // Hide both result sections first
    document.getElementById('trackingResult').classList.add('hidden');
    document.getElementById('notFoundMessage').classList.add('hidden');

    if (shipment) {
        // Show tracking result
        displayShipmentDetails(shipment);
        document.getElementById('trackingResult').classList.remove('hidden');
        
        // Scroll to result
        document.getElementById('trackingResult').scrollIntoView({ behavior: 'smooth' });
    } else {
        // Show not found message
        document.getElementById('notFoundMessage').classList.remove('hidden');
        
        // Scroll to message
        document.getElementById('notFoundMessage').scrollIntoView({ behavior: 'smooth' });
    }
});

function displayShipmentDetails(shipment) {
    // Display basic information
    document.getElementById('displayOrderId').textContent = shipment.orderId;
    document.getElementById('trackCustomerName').textContent = shipment.customerName;
    document.getElementById('trackProductName').textContent = shipment.productName;
    document.getElementById('trackCategory').textContent = shipment.category;
    document.getElementById('trackWeight').textContent = shipment.weight;
    document.getElementById('trackContainerType').textContent = shipment.containerType;
    document.getElementById('trackDestination').textContent = shipment.destination;
    document.getElementById('trackDistance').textContent = shipment.distance.toLocaleString();
    document.getElementById('trackPrice').textContent = `₺${shipment.price.toLocaleString()}`;
    
    // Format and display creation date
    const createdDate = new Date(shipment.createdAt);
    document.getElementById('trackCreatedAt').textContent = createdDate.toLocaleString();

    // Display status with appropriate badge
    const statusBadge = document.getElementById('statusBadge');
    const status = shipment.status;
    statusBadge.textContent = status;
    
    // Remove all badge classes
    statusBadge.className = 'badge';
    
    // Add appropriate badge class
    if (status === 'Pending') {
        statusBadge.classList.add('badge-pending');
    } else if (status === 'Ready for Transport') {
        statusBadge.classList.add('badge-ready');
    } else if (status === 'In Transit') {
        statusBadge.classList.add('badge-transit');
    } else if (status === 'Delivered') {
        statusBadge.classList.add('badge-delivered');
    }

    // Display status description
    document.getElementById('statusDescription').textContent = 
        statusDescriptions[status] || 'Status information not available.';

    // Show container info if assigned
    const containerInfo = document.getElementById('containerInfo');
    if (shipment.containerId) {
        document.getElementById('assignedContainerId').textContent = shipment.containerId;
        containerInfo.classList.remove('hidden');
    } else {
        containerInfo.classList.add('hidden');
    }

    // Update timeline
    updateTimeline(status);
}

function updateTimeline(currentStatus) {
    // Reset all timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => item.classList.remove('active'));

    // Map status to timeline ID
    const statusMap = {
        'Pending': 'timeline-pending',
        'Ready for Transport': 'timeline-ready',
        'In Transit': 'timeline-transit',
        'Delivered': 'timeline-delivered'
    };

    // Activate items based on current status
    const statusOrder = ['Pending', 'Ready for Transport', 'In Transit', 'Delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);

    for (let i = 0; i <= currentIndex; i++) {
        const timelineId = statusMap[statusOrder[i]];
        const item = document.getElementById(timelineId);
        if (item) {
            item.classList.add('active');
        }
    }
}
