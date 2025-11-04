# 🚢 BlueBerry Logistics - Transport & Management System

A comprehensive web-based simulation of a logistics company's transport and management system built entirely with HTML, CSS, and JavaScript. No backend required - all data is managed client-side using localStorage.

## 🎨 Design Theme

- **Primary Color**: Purple (#7b2cbf)
- **Clean & Modern**: Professional interface with balanced use of purple accents
- **Fully Responsive**: Works seamlessly on desktop and mobile devices

## 📋 Features

### Customer Portal

#### 1. Home Page (`index.html`)
- Company introduction and services overview
- Quick access buttons for creating and tracking shipments
- Pricing information and feature highlights
- Auto-initializes localStorage data on first visit

#### 2. Create Shipment (`create.html`)
- Interactive form for shipment details:
  - Customer name, product name, and category (Fresh/Frozen/Organic Blueberries)
  - Weight input with validation
  - Container type selection (Small/Medium/Large)
  - Destination selection from 10 European cities
  - Optional product image upload
- **Live price calculation** as you type
- **Smart validation**:
  - Checks container capacity availability
  - Validates inventory stock levels
  - Prevents oversized shipments
- Automatic price calculation: `Distance × Rate per km`
- Rates: Small (₺5/km), Medium (₺8/km), Large (₺12/km)

#### 3. Result Page (`result.html`)
- Displays complete order summary
- Shows calculated total price with breakdown
- Estimated delivery time (5-7 business days)
- Unique Order ID for tracking
- Links to tracking page

#### 4. Tracking Page (`track.html`)
- Search shipments by Order ID
- Real-time status display with visual timeline:
  - Pending
  - Ready for Transport
  - In Transit
  - Delivered
- Shows container assignment when optimized
- Complete shipment details and history

### Admin Dashboard (`admin.html`)

**Login Credentials**: Password: `admin123`

#### Dashboard Features:

1. **Shipments Tab**
   - View all shipments in a comprehensive table
   - Statistics: Total, Pending, and Completed shipments
   - Filter by status and view detailed information

2. **Container Optimization Tab**
   - Lists all pending shipments
   - **First-Fit Decreasing Algorithm** implementation
   - One-click optimization that:
     - Sorts shipments by weight (largest first)
     - Assigns to first available container with space
     - Updates container status (Empty → Filling → Ready for Transport)
     - Marks containers as "Ready" when ≥80% full
   - Visual container status display by type

3. **Fleet Management Tab**
   - **3 Ships**: BlueSea, OceanWave, SeaStar
   - **4 Trucks**: TruckAlpha, TruckBeta, TruckGamma, TruckDelta
   - Complete fleet specifications (capacity, costs, maintenance)
   - **Trip Expense Calculator**:
     - Select any vehicle
     - Enter distance
     - Calculates: `(Fuel Cost/km × Distance) + Crew Cost + Maintenance`
     - Shows detailed breakdown

4. **Financials Tab**
   - **Revenue**: Sum of all completed shipment prices
   - **Expenses**: Fleet operations (₺150,000) + Other (₺80,000)
   - **Net Income**: Revenue - Expenses
   - **Tax**: 20% of Net Income
   - **Profit After Tax**: Net Income - Tax
   - Visual summary cards and detailed breakdown table

5. **Inventory Tab**
   - Real-time blueberry inventory tracking:
     - Fresh Blueberries (10,000 kg initial, 2,000 kg minimum)
     - Frozen Blueberries (8,000 kg initial, 1,500 kg minimum)
     - Organic Blueberries (5,000 kg initial, 1,000 kg minimum)
   - **Automatic low stock alerts** when below minimum
   - Visual progress bars showing stock levels
   - Updates automatically when shipments are created

6. **Reports Tab**
   - Comprehensive business intelligence report:
     - Financial summary
     - Total shipments and container utilization
     - Most popular shipping route
     - Products sold by category
     - Remaining inventory status
   - **PDF Export** using jsPDF library
   - Professional formatting for presentations

## 🛠️ Technical Implementation

### Technologies
- **HTML5**: Semantic structure
- **CSS3**: Custom purple theme with gradients, animations, and responsive design
- **JavaScript (ES6+)**: All business logic, algorithms, and data management
- **localStorage**: Client-side data persistence
- **jsPDF**: PDF generation for reports

### Data Structure

**Shipments** (localStorage key: `shipments`):
```javascript
{
  orderId: "ORD-1729456789012",
  customerName: "Ali",
  productName: "Premium Blueberries",
  category: "Fresh Blueberries",
  weight: 500,
  containerType: "Small",
  destination: "Berlin",
  distance: 3000,
  rate: 5,
  price: 15000,
  status: "Pending",
  containerId: null,
  createdAt: "2025-10-20T10:30:00.000Z",
  estimatedDelivery: "5-7 business days"
}
```

**Containers** (localStorage key: `containers`):
```javascript
{
  id: "Large-1",
  type: "Large",
  capacity: 3000,
  currentLoad: 0,
  status: "Empty",
  shipments: []
}
```

**Inventory** (localStorage key: `inventory`):
```javascript
{
  category: "Fresh Blueberries",
  quantity: 10000,
  minStock: 2000,
  unit: "kg"
}
```

### Container Capacities (from PDF)
- **Small**: 2,000 kg (₺5/km)
- **Medium**: 5,000 kg (₺8/km)
- **Large**: 10,000 kg (₺12/km)

### Fleet (from PDF)
**Ships:**
- BlueSea: 100,000 kg
- OceanStar: 120,000 kg
- AegeanWind: 90,000 kg

**Trucks:**
- RoadKing: 10,000 kg
- FastMove: 12,000 kg
- CargoPro: 9,000 kg
- HeavyLoad: 15,000 kg

### Inventory (from PDF)
- Fresh: 4,500 kg (min: 2,000 kg)
- Frozen: 1,200 kg (min: 1,000 kg)
- Organic: 8,000 kg (min: 2,500 kg)

### Mock Distance Data (from Muğla, Turkey)
- Berlin: 3,000 km
- London: 3,500 km
- Paris: 2,800 km
- Rome: 1,800 km
- Madrid: 3,200 km
- Amsterdam: 3,100 km
- Brussels: 2,900 km
- Vienna: 1,600 km
- Prague: 2,000 km
- Athens: 800 km
- Plus 40+ more worldwide cities

## 🚀 Getting Started

1. **Open the Project**
   - Simply open `index.html` in any modern web browser
   - No installation or build process required

2. **Initialize Data**
   - On first visit, localStorage is automatically initialized with:
     - 35 containers (5 Large, 10 Medium, 20 Small)
     - Full inventory of three blueberry types
     - Empty shipments array

3. **Create a Test Shipment**
   - Go to "Create Shipment"
   - Fill in: Customer Name: "Ali", Product: "Premium Blueberries", Category: "Fresh"
   - Weight: 500 kg (Container automatically selects "Small")
   - Destination: Berlin
   - Submit to see price: ₺15,000 (3,000 km × ₺5/km)

4. **Use Admin Dashboard**
   - Navigate to Admin
   - Login with password: `admin123`
   - View the pending shipment
   - Click "Optimize Containers" to assign it to a container
   - Check Financials and Inventory tabs
   - Export a PDF report

## 📊 Use Case: Shipping Blueberries from Muğla to Berlin

This application fully simulates the complete workflow:

1. **Customer Creates Shipment**:
   - Ali orders 500 kg Fresh Blueberries to Berlin
   - System calculates: 3,000 km × ₺5/km = ₺15,000
   - Checks inventory: 10,000 kg available ✓
   - Checks container: Small containers available ✓
   - Creates Order ID: ORD-1729456789012
   - Status: Pending

2. **Admin Optimizes Containers**:
   - Views pending shipment in dashboard
   - Runs First-Fit Decreasing algorithm
   - Ali's 500 kg shipment assigned to "Small-1"
   - Container status: Filling (or Ready if ≥80% full)
   - Shipment status: Ready for Transport

3. **System Updates**:
   - Inventory: Fresh Blueberries reduced to 9,500 kg
   - Financials: Revenue increases by ₺15,000
   - Container: Small-1 shows 500/500 kg load

4. **Customer Tracks Shipment**:
   - Enters Order ID: ORD-1729456789012
   - Sees status: "Ready for Transport"
   - Views assigned container: "Small-1"
   - Sees complete journey timeline

## 📁 File Structure

```
Midterm-Project/
│
├── index.html              # Home page (Customer Portal entry)
├── README.md               # This file
│
├── css/
│   ├── styles.css          # Main stylesheet (purple theme)
│   └── admin.css           # Admin-specific styles
│
├── js/
│   ├── create.js           # Shipment creation logic
│   ├── result.js           # Display order results
│   ├── track.js            # Tracking functionality
│   └── admin.js            # All admin functionality & algorithms
│
├── pages/
│   ├── create.html         # Create shipment page
│   ├── result.html         # Order confirmation page
│   ├── track.html          # Shipment tracking page
│   └── admin.html          # Admin dashboard
│
└── docs/
    ├── Midterm_project_2025.pdf        # Project requirements
    └── blueberry-logistics-report.pdf  # Sample report
```

## 🎯 Key Algorithms

### First-Fit Decreasing (Container Optimization)
```javascript
1. Get all pending shipments
2. Sort by weight (largest first)
3. For each shipment:
   - Find first container of matching type with available space
   - Add shipment to container
   - Update container load
   - Mark as "Ready" if ≥80% capacity
4. Update all records in localStorage
```

### Price Calculation
```javascript
Total Price = Distance (km) × Container Rate (₺/km)

Rates:
- Small (500 kg): ₺5/km
- Medium (1,500 kg): ₺8/km
- Large (3,000 kg): ₺12/km
```

### Trip Expense Formula
```javascript
Total Expense = (Fuel Cost/km × Distance) + Crew Cost + Maintenance

Example (BlueSea to Berlin, 3,000 km):
= (₺40 × 3,000) + ₺20,000 + ₺10,000
= ₺120,000 + ₺20,000 + ₺10,000
= ₺150,000
```

## 🔧 Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

Requires modern browser with:
- ES6+ JavaScript support
- localStorage API
- CSS Grid and Flexbox

## 💡 Features Highlights

- ✅ **No Backend Required**: 100% client-side application
- ✅ **Persistent Data**: localStorage maintains data across sessions
- ✅ **Real-time Updates**: All tabs sync automatically
- ✅ **Smart Validation**: Prevents impossible shipments
- ✅ **Professional UI**: Clean, modern purple-themed design
- ✅ **Responsive Design**: Works on all screen sizes
- ✅ **Algorithm Implementation**: First-Fit Decreasing optimization
- ✅ **PDF Export**: Generate downloadable reports
- ✅ **Complete Workflow**: From order creation to delivery tracking

## 🎓 Educational Value

This project demonstrates:
- Frontend architecture for complex applications
- State management without frameworks
- Algorithm implementation (bin packing/container optimization)
- Form validation and user input handling
- Data persistence with localStorage
- PDF generation in the browser
- Responsive web design principles
- Professional UI/UX design

## 📝 Notes

- **Data Reset**: Clear browser localStorage to reset all data
- **Mock Data**: Fleet expenses and distances are simulated for demonstration
- **Status Flow**: Pending → Ready for Transport → In Transit → Delivered
- **Container Logic**: Automatically manages capacity and status
- **Inventory Tracking**: Real-time updates with low stock warnings

## 👨‍💻 Author

Created as a midterm project for HTML, CSS, and JavaScript course.

---

**© 2025 BlueBerry Logistics - Transport & Management System**
*Shipping Excellence from Muğla to Europe* 🚢🫐
