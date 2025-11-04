// Get order ID from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('orderId');

if (!orderId) {
    alert('No Order ID provided. Redirecting to home page.');
    window.location.href = 'index.html';
} else {
    // Load shipment data
    const shipments = JSON.parse(localStorage.getItem('shipments') || '[]');
    const shipment = shipments.find(s => s.orderId === orderId);

    if (!shipment) {
        alert('Order not found. Redirecting to home page.');
        window.location.href = 'index.html';
    } else {
        // Display shipment details
        document.getElementById('orderId').textContent = shipment.orderId;
        document.getElementById('customerName').textContent = shipment.customerName;
        document.getElementById('productName').textContent = shipment.productName;
        document.getElementById('category').textContent = shipment.category;
        document.getElementById('weight').textContent = shipment.weight;
        document.getElementById('destination').textContent = shipment.destination;
        document.getElementById('distance').textContent = shipment.distance.toLocaleString();
        document.getElementById('containerType').textContent = shipment.containerType;
        document.getElementById('totalPrice').textContent = `₺${shipment.price.toLocaleString()}`;
        document.getElementById('priceCalculation').textContent = 
            `Calculation: ${shipment.distance.toLocaleString()} km × ₺${shipment.rate} / km`;
        document.getElementById('estimatedDelivery').textContent = shipment.estimatedDelivery;

        // Update track link to include order ID
        const trackLink = document.querySelector('a[href="track.html"]');
        if (trackLink) {
            trackLink.href = `track.html?orderId=${orderId}`;
        }
    }
}
