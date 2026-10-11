// Realistic mock data matching reference designs

export const initialAdminProfile = {
  fullName: "Admin User",
  email: "admin@bikeservice.com",
  phone: "9876543210",
  role: "Administrator",
  joinedDate: "12 Sep 2026",
  status: "Active",
  avatar: "A"
};

export const initialCompanySettings = {
  companyName: "Bike Service Center",
  address: "123, Anna Nagar, Salem, Tamil Nadu - 636001",
  phone: "9876543210",
  email: "info@bikeservice.com",
  currency: "₹",
  serviceDueNoticeDays: 30,
  autoSmsAlerts: true,
  autoEmailAlerts: true
};

export const mockStats = {
  totalBikes: 52,
  onlineNow: 38,
  serviceDueSoon: 12,
  offlineBikes: 14
};

export const mockBikes = [
  {
    id: 1,
    regNo: "TN 30 AB 1234",
    brand: "Yamaha",
    model: "Yamaha FZ-S",
    customer: "Bharath",
    phone: "9876543210",
    status: "Moving",
    speed: "45 km/h",
    lastUpdated: "15 Sep 2026, 10:30 AM",
    lastLocation: "Near Anna Park, Salem",
    lat: 11.6643,
    lng: 78.1460,
    heading: 45,
    lastService: "12 Apr 2026",
    lastServiceKm: "10,200 km",
    nextService: "12 Oct 2026",
    nextServiceKm: "15,000 km",
    daysLeft: 27,
    serviceStatus: "Due Soon",
    battery: "94%",
    fuel: "72%",
    totalDistance: "14,820 km",
    sevenDaysDistance: "120 km",
    sevenDaysChange: "↑ 12% vs previous 7 days",
    oneMonthDistance: "450 km",
    oneMonthChange: "↑ 8% vs previous month",
    purchasedDate: "12 Jan 2024"
  },
  {
    id: 2,
    regNo: "TN 28 CD 5678",
    brand: "Honda",
    model: "Honda Activa",
    customer: "Priya",
    phone: "9876543210",
    status: "Parked",
    speed: "0 km/h",
    lastUpdated: "12 Sep 2026, 09:15 AM",
    lastLocation: "Fairlands Main Road, Salem",
    lat: 11.6692,
    lng: 78.1524,
    heading: 0,
    lastService: "15 Apr 2026",
    lastServiceKm: "8,400 km",
    nextService: "18 Oct 2026",
    nextServiceKm: "12,000 km",
    daysLeft: 11,
    serviceStatus: "Due Soon",
    battery: "88%",
    fuel: "65%",
    totalDistance: "11,850 km",
    purchasedDate: "05 Mar 2023"
  },
  {
    id: 3,
    regNo: "TN 45 EF 9012",
    brand: "TVS",
    model: "TVS Apache",
    customer: "Mani",
    phone: "9123456780",
    status: "Moving",
    speed: "32 km/h",
    lastUpdated: "15 Sep 2026, 10:28 AM",
    lastLocation: "5 Roads Junction, Salem",
    lat: 11.6580,
    lng: 78.1402,
    heading: 120,
    lastService: "10 Jan 2026",
    lastServiceKm: "14,100 km",
    nextService: "20 Oct 2026",
    nextServiceKm: "19,000 km",
    daysLeft: 13,
    serviceStatus: "Normal",
    battery: "91%",
    fuel: "40%",
    totalDistance: "18,400 km",
    purchasedDate: "18 Nov 2022"
  },
  {
    id: 4,
    regNo: "TN 30 GH 3456",
    brand: "Royal Enfield",
    model: "Royal Enfield",
    customer: "Karthik",
    phone: "9988776655",
    status: "Stopped",
    speed: "0 km/h",
    lastUpdated: "15 Sep 2026, 09:40 AM",
    lastLocation: "Hasthampatti, Salem",
    lat: 11.6745,
    lng: 78.1610,
    heading: 0,
    lastService: "05 Apr 2026",
    lastServiceKm: "6,200 km",
    nextService: "22 Oct 2026",
    nextServiceKm: "11,000 km",
    daysLeft: 15,
    serviceStatus: "Normal",
    battery: "96%",
    fuel: "85%",
    totalDistance: "10,650 km",
    purchasedDate: "10 Aug 2024"
  },
  {
    id: 5,
    regNo: "TN 11 U 7890",
    brand: "Bajaj",
    model: "Bajaj Pulsar",
    customer: "Suresh",
    phone: "9090909090",
    status: "Moving",
    speed: "56 km/h",
    lastUpdated: "15 Sep 2026, 10:25 AM",
    lastLocation: "Omalur Main Road, Salem",
    lat: 11.6820,
    lng: 78.1325,
    heading: 310,
    lastService: "12 Jan 2026",
    lastServiceKm: "22,500 km",
    nextService: "25 Oct 2026",
    nextServiceKm: "27,500 km",
    daysLeft: 18,
    serviceStatus: "Normal",
    battery: "82%",
    fuel: "50%",
    totalDistance: "26,900 km",
    purchasedDate: "22 Feb 2022"
  },
  {
    id: 6,
    regNo: "TN 38 KL 2345",
    brand: "Hero",
    model: "Hero Splendor",
    customer: "Deepa",
    phone: "9443211234",
    status: "Offline",
    speed: "0 km/h",
    lastUpdated: "12 Sep 2026, 08:40 AM (Offline 2 days)",
    lastLocation: "Suramangalam, Salem",
    lat: 11.6510,
    lng: 78.1250,
    heading: 0,
    lastService: "01 Feb 2026",
    lastServiceKm: "31,000 km",
    nextService: "28 Oct 2026",
    nextServiceKm: "36,000 km",
    daysLeft: 21,
    serviceStatus: "Normal",
    battery: "12%",
    fuel: "20%",
    totalDistance: "35,100 km",
    purchasedDate: "09 Jul 2021"
  },
  {
    id: 7,
    regNo: "KA 03 MH 9921",
    brand: "KTM",
    model: "KTM Duke 250",
    customer: "Arun",
    phone: "9845123456",
    status: "Moving",
    speed: "62 km/h",
    lastUpdated: "15 Sep 2026, 10:31 AM",
    lastLocation: "Attur Bypass, Salem",
    lat: 11.6625,
    lng: 78.1740,
    heading: 90,
    lastService: "20 Mar 2026",
    lastServiceKm: "7,500 km",
    nextService: "02 Nov 2026",
    nextServiceKm: "12,500 km",
    daysLeft: 26,
    serviceStatus: "Normal",
    battery: "90%",
    fuel: "68%",
    totalDistance: "11,900 km",
    purchasedDate: "15 Dec 2023"
  }
];

export const mockRecentActivities = [
  {
    id: 1,
    type: "moving",
    regNo: "TN 30 AB 1234",
    title: "TN 30 AB 1234 is now Moving",
    time: "12 Sep 2026, 10:30 AM",
    status: "Moving"
  },
  {
    id: 2,
    type: "completed",
    regNo: "TN 28 CD 5678",
    title: "Service completed for TN 28 CD 5678",
    time: "12 Sep 2026, 09:15 AM",
    status: "Completed"
  },
  {
    id: 3,
    type: "offline",
    regNo: "TN 38 KL 2345",
    title: "TN 38 KL 2345 is Offline",
    time: "12 Sep 2026, 08:40 AM",
    status: "Offline"
  },
  {
    id: 4,
    type: "job_created",
    regNo: "TN 30 AB 1234",
    title: "New Job Card #JC-001 created for Ramesh",
    time: "11 Sep 2026, 04:30 PM",
    status: "Open"
  },
  {
    id: 5,
    type: "service_alert",
    regNo: "TN 45 EF 9012",
    title: "Service reminder sent to Mani",
    time: "10 Sep 2026, 11:20 AM",
    status: "Normal"
  }
];

export const mockJobCards = [
  {
    id: 1,
    jobNo: "JC-001",
    regNo: "TN 30 AB 1234",
    customer: "Ramesh",
    brandModel: "Yamaha FZ-S",
    serviceType: "General Service",
    date: "18 Sep 2026",
    status: "In Service",
    estimatedCost: "₹1,450",
    technician: "Mani",
    notes: "Oil filter change and brake inspection required."
  },
  {
    id: 2,
    jobNo: "JC-002",
    regNo: "TN 28 CD 5678",
    customer: "Priya",
    brandModel: "Honda Activa",
    serviceType: "Oil Change",
    date: "18 Sep 2026",
    status: "Open",
    estimatedCost: "₹850",
    technician: "Unassigned",
    notes: "Customer reported slight throttle lag."
  },
  {
    id: 3,
    jobNo: "JC-003",
    regNo: "TN 45 EF 9012",
    customer: "Mani",
    brandModel: "TVS Apache",
    serviceType: "Brake Service",
    date: "17 Sep 2026",
    status: "Completed",
    estimatedCost: "₹1,200",
    technician: "Anitha",
    notes: "Front and rear brake pads replaced."
  },
  {
    id: 4,
    jobNo: "JC-004",
    regNo: "TN 30 GH 3456",
    customer: "Karthik",
    brandModel: "Royal Enfield",
    serviceType: "General Service",
    date: "17 Sep 2026",
    status: "In Service",
    estimatedCost: "₹2,100",
    technician: "Mani",
    notes: "Clutch cable tuning and valve clearances."
  },
  {
    id: 5,
    jobNo: "JC-005",
    regNo: "TN 11 U 7890",
    customer: "Suresh",
    brandModel: "Bajaj Pulsar",
    serviceType: "Engine Repair",
    date: "16 Sep 2026",
    status: "Open",
    estimatedCost: "₹3,400",
    technician: "Anitha",
    notes: "White smoke observed during acceleration."
  },
  {
    id: 6,
    jobNo: "JC-006",
    regNo: "TN 38 KL 2345",
    customer: "Deepa",
    brandModel: "Hero Splendor",
    serviceType: "Battery Check",
    date: "15 Sep 2026",
    status: "Ready",
    estimatedCost: "₹600",
    technician: "Mani",
    notes: "Recharged and battery health certified at 92%."
  },
  {
    id: 7,
    jobNo: "JC-007",
    regNo: "KA 03 MH 9921",
    customer: "Arun",
    brandModel: "KTM Duke 250",
    serviceType: "Chain & Sprocket",
    date: "15 Sep 2026",
    status: "In Service",
    estimatedCost: "₹2,800",
    technician: "Anitha",
    notes: "Brass roller chain replacement."
  },
  {
    id: 8,
    jobNo: "JC-008",
    regNo: "KL 07 BQ 3411",
    customer: "Lakshmi",
    brandModel: "Suzuki Access",
    serviceType: "Full Inspection",
    date: "14 Sep 2026",
    status: "Ready",
    estimatedCost: "₹1,150",
    technician: "Mani",
    notes: "All 18 points passed."
  }
];

export const mockUsers = [
  {
    id: 1,
    name: "Ramesh Kumar",
    phone: "9843212345",
    email: "ramesh@gmail.com",
    role: "Customer",
    status: "Active",
    registeredDate: "10 Jan 2026"
  },
  {
    id: 2,
    name: "Priya",
    phone: "9876543210",
    email: "priya@gmail.com",
    role: "Customer",
    status: "Active",
    registeredDate: "14 Feb 2026"
  },
  {
    id: 3,
    name: "Mani",
    phone: "9123456780",
    email: "mani@gmail.com",
    role: "Technician",
    status: "Active",
    registeredDate: "01 Mar 2025"
  },
  {
    id: 4,
    name: "Karthik",
    phone: "9988776655",
    email: "karthik@gmail.com",
    role: "Service Manager",
    status: "Active",
    registeredDate: "15 Aug 2024"
  },
  {
    id: 5,
    name: "Suresh",
    phone: "9090909090",
    email: "suresh@gmail.com",
    role: "Customer",
    status: "Inactive",
    registeredDate: "20 May 2025"
  },
  {
    id: 6,
    name: "Bharath",
    phone: "9876543210",
    email: "bharath@bikeservice.com",
    role: "Customer",
    status: "Active",
    registeredDate: "12 Jan 2024"
  },
  {
    id: 7,
    name: "Anitha",
    phone: "9789012345",
    email: "anitha@bikeservice.com",
    role: "Technician",
    status: "Active",
    registeredDate: "05 Jun 2025"
  }
];

export const mockBikeBrands = [
  {
    id: 1,
    name: "Honda",
    logoKey: "honda",
    totalModels: 8,
    defaultInterval: "6000 km / 6 months",
    status: "Active"
  },
  {
    id: 2,
    name: "Yamaha",
    logoKey: "yamaha",
    totalModels: 7,
    defaultInterval: "6000 km / 6 months",
    status: "Active"
  },
  {
    id: 3,
    name: "TVS",
    logoKey: "tvs",
    totalModels: 6,
    defaultInterval: "5000 km / 6 months",
    status: "Active"
  },
  {
    id: 4,
    name: "Bajaj",
    logoKey: "bajaj",
    totalModels: 8,
    defaultInterval: "5000 km / 6 months",
    status: "Active"
  },
  {
    id: 5,
    name: "Hero",
    logoKey: "hero",
    totalModels: 6,
    defaultInterval: "5000 km / 6 months",
    status: "Active"
  },
  {
    id: 6,
    name: "Royal Enfield",
    logoKey: "royalenfield",
    totalModels: 7,
    defaultInterval: "6000 km / 6 months",
    status: "Active"
  }
];

export const mockActivityLogs = [
  {
    id: 1,
    dateTime: "15 Sep 2026, 10:30 AM",
    action: "Login",
    description: "User logged in",
    ipAddress: "192.168.1.10"
  },
  {
    id: 2,
    dateTime: "15 Sep 2026, 10:32 AM",
    action: "Update Profile",
    description: "Profile updated",
    ipAddress: "192.168.1.10"
  },
  {
    id: 3,
    dateTime: "14 Sep 2026, 05:20 PM",
    action: "Logout",
    description: "User logged out",
    ipAddress: "192.168.1.11"
  },
  {
    id: 4,
    dateTime: "14 Sep 2026, 05:18 PM",
    action: "Login",
    description: "User logged in",
    ipAddress: "192.168.1.11"
  },
  {
    id: 5,
    dateTime: "12 Sep 2026, 11:45 AM",
    action: "Change Password",
    description: "Password changed",
    ipAddress: "192.168.1.15"
  },
  {
    id: 6,
    dateTime: "10 Sep 2026, 03:12 PM",
    action: "Settings",
    description: "Service settings updated",
    ipAddress: "192.168.1.12"
  },
  {
    id: 7,
    dateTime: "08 Sep 2026, 02:40 PM",
    action: "Create Job Card",
    description: "Job card JC-001 created",
    ipAddress: "192.168.1.10"
  },
  {
    id: 8,
    dateTime: "05 Sep 2026, 11:15 AM",
    action: "Add User",
    description: "Technician Anitha added",
    ipAddress: "192.168.1.14"
  }
];

export const mockCustomerServiceHistory = [
  {
    id: 1,
    serviceType: "General Service",
    date: "12 Apr 2026",
    odometer: "10,200 km",
    cost: "₹1,250",
    status: "Completed",
    notes: "Engine oil, filter replacement, chain lube, brake adjustment"
  },
  {
    id: 2,
    serviceType: "Oil Change",
    date: "10 Jan 2026",
    odometer: "7,800 km",
    cost: "₹850",
    status: "Completed",
    notes: "Motul 10W40 synthetic engine oil replaced"
  },
  {
    id: 3,
    serviceType: "Brake Check",
    date: "15 Sep 2025",
    odometer: "5,300 km",
    cost: "₹600",
    status: "Completed",
    notes: "Front disc brake pads inspected and cleaned"
  },
  {
    id: 4,
    serviceType: "First Free Service",
    date: "12 Apr 2024",
    odometer: "1,000 km",
    cost: "₹350",
    status: "Completed",
    notes: "Initial checkup, oil change, bolts torque check"
  }
];

export const mockCustomerAlerts = [
  {
    id: 1,
    title: "Safe Parking Confirmation",
    message: "Your bike was parked safely near Anna Park, Salem at 10:30 AM.",
    time: "10 mins ago",
    type: "info",
    isRead: false
  },
  {
    id: 2,
    title: "Next Service Reminder",
    message: "Next scheduled periodic service is due in 27 days (12 Oct 2026).",
    time: "2 hours ago",
    type: "service",
    isRead: false
  },
  {
    id: 3,
    title: "Geofence Alert: Entered Salem City Center",
    message: "Bike entered designated city safe zone at 09:45 AM.",
    time: "Yesterday",
    type: "security",
    isRead: true
  },
  {
    id: 4,
    title: "Battery Health Optimal",
    message: "Bike battery is at 94% with standard voltage.",
    time: "2 days ago",
    type: "battery",
    isRead: true
  }
];
