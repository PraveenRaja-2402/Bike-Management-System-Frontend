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
    name: "Bharath Kumar",
    phone: "9876543210",
    email: "bharath@gmail.com",
    role: "Customer",
    status: "Active",
    assignedBike: "TN 30 AB 1234",
    pin: "1234",
    membershipPoints: 1250,
    registeredDate: "12 Jan 2026"
  },
  {
    id: 2,
    name: "Sneha Reddy",
    phone: "9845011223",
    email: "sneha@gmail.com",
    role: "Customer",
    status: "Active",
    assignedBike: "TN 27 BK 9021",
    pin: "1234",
    membershipPoints: 840,
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
    name: "Ramesh Kumar",
    phone: "9843212345",
    email: "ramesh@gmail.com",
    role: "Customer",
    status: "Active",
    assignedBike: "TN 30 CD 9876",
    pin: "1234",
    membershipPoints: 620,
    registeredDate: "10 Jan 2026"
  },
  {
    id: 6,
    name: "Karthik Raja",
    phone: "9789055667",
    email: "karthik.raja@gmail.com",
    role: "Customer",
    status: "Active",
    assignedBike: "TN 30 DE 5678",
    pin: "1234",
    membershipPoints: 450,
    registeredDate: "02 Feb 2026"
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


export const mockAuthCredentials = [
  {
    id: 1,
    email: "superadmin@bikeservice.com",
    aliases: ["superadmin@bikeservicepro.com", "superadmin"],
    password: "SuperAdmin@2026!",
    name: "Alexander Vance",
    role: "super_admin",
    roleLabel: "Super Admin",
    badge: "Super Admin (Root)",
    avatar: "AV",
    phone: "9876543200",
    assignedBranch: "All Branches",
    permissions: ["Full Access", "Logo & Branding", "Store Management", "Admin Creation", "Financials", "Audit Logs"]
  },
  {
    id: 2,
    email: "admin@bikeservice.com",
    aliases: ["vikram.admin@bikeservice.com", "admin"],
    password: "Admin@Ops2026!",
    name: "Vikram Raman",
    role: "admin",
    roleLabel: "Operations Admin",
    badge: "Operations Admin",
    avatar: "VR",
    phone: "9845112233",
    assignedBranch: "Salem Central Mega Hub",
    permissions: ["User Creation", "Job Cards", "Live Tracking", "Service Dispatch", "Customer Accounts"]
  },
  {
    id: 3,
    email: "meena.admin@bikeservice.com",
    aliases: ["meena"],
    password: "Meena@Admin2026!",
    name: "Meenakshi Sundaram",
    role: "admin",
    roleLabel: "Branch Admin",
    badge: "Branch Admin",
    avatar: "MS",
    phone: "9789334455",
    assignedBranch: "Fairlands Express Workshop",
    permissions: ["User Creation", "Job Cards", "Live Tracking"]
  }
];

export const mockAdmins = [
  {
    id: 1,
    name: "Alexander Vance",
    email: "superadmin@bikeservice.com",
    phone: "9876543200",
    role: "Super Admin",
    status: "Active",
    assignedBranch: "All Branches",
    permissions: ["Full Access", "Logo & Branding", "Store Management", "Admin Creation", "Financials"],
    lastLogin: "Today, 10:45 AM"
  },
  {
    id: 2,
    name: "Vikram Raman",
    email: "vikram.admin@bikeservice.com",
    phone: "9845112233",
    role: "Admin",
    status: "Active",
    assignedBranch: "Salem Central Mega Hub",
    permissions: ["User Creation", "Job Cards", "Service Dispatch", "Customer Accounts"],
    lastLogin: "Today, 09:12 AM"
  },
  {
    id: 3,
    name: "Meenakshi Sundaram",
    email: "meena.admin@bikeservice.com",
    phone: "9789334455",
    role: "Admin",
    status: "Active",
    assignedBranch: "Fairlands Express Workshop",
    permissions: ["User Creation", "Job Cards", "Live Tracking"],
    lastLogin: "Yesterday, 05:30 PM"
  },
  {
    id: 4,
    name: "Rajesh Kannan",
    email: "rajesh.admin@bikeservice.com",
    phone: "9944556677",
    role: "Admin",
    status: "Inactive",
    assignedBranch: "Attur Bypass Quick Care",
    permissions: ["User Creation", "Job Cards"],
    lastLogin: "01 Nov 2026"
  }
];

export const mockStoreLocations = [
  {
    id: 1,
    name: "Salem Central Mega Hub",
    code: "STR-001",
    address: "123, Anna Nagar Main Road, Salem - 636001",
    phone: "0427-2445566",
    manager: "Vikram Raman",
    lat: 11.6643,
    lng: 78.1460,
    serviceBays: 8,
    operatingHours: "08:30 AM - 08:00 PM (Mon-Sat)",
    status: "Active",
    geofenceRadiusMeters: 400,
    activeJobsCount: 14,
    availableTechnicians: 6
  },
  {
    id: 2,
    name: "Fairlands Express Workshop",
    code: "STR-002",
    address: "45, Fairlands Main Road, Near Reliance Mart, Salem - 636016",
    phone: "0427-2334411",
    manager: "Meenakshi Sundaram",
    lat: 11.6692,
    lng: 78.1524,
    serviceBays: 4,
    operatingHours: "09:00 AM - 07:30 PM (Mon-Sat)",
    status: "Active",
    geofenceRadiusMeters: 300,
    activeJobsCount: 8,
    availableTechnicians: 3
  },
  {
    id: 3,
    name: "Attur Bypass Quick Care Hub",
    code: "STR-003",
    address: "NH-79, Attur Bypass Junction, Salem - 636102",
    phone: "0427-2556677",
    manager: "Karthik Service Manager",
    lat: 11.6625,
    lng: 78.1740,
    serviceBays: 6,
    operatingHours: "08:00 AM - 09:00 PM (Daily)",
    status: "Active",
    geofenceRadiusMeters: 500,
    activeJobsCount: 9,
    availableTechnicians: 4
  },
  {
    id: 4,
    name: "Omalur Expressway Service Hub",
    code: "STR-004",
    address: "18, Omalur Main Road, Opp Toll Gate, Salem - 636304",
    phone: "0427-2889900",
    manager: "Anitha Workshop Lead",
    lat: 11.6820,
    lng: 78.1325,
    serviceBays: 5,
    operatingHours: "08:30 AM - 08:00 PM (Mon-Sat)",
    status: "Active",
    geofenceRadiusMeters: 350,
    activeJobsCount: 5,
    availableTechnicians: 3
  }
];

export const initialBranding = {
  companyName: "Bike Service Pro",
  tagline: "Smart IoT Fleet & Bike Care Center",
  logoType: "preset", // 'preset' or 'custom'
  selectedPreset: "modern", // 'modern', 'sport', 'apex', 'shield'
  customLogoUrl: "",
  primaryColor: "#2563eb",
  accentColor: "#3b82f6",
  supportPhone: "1800-425-BIKE",
  supportEmail: "support@bikeservicepro.com"
};

export const mockCustomerFines = [
  {
    id: 1,
    challanNo: "TN-SLM-2026-99214",
    offense: "Speed Limit Exceeded (62 km/h in 40 km/h zone)",
    location: "Salem Fort Junction, Salem",
    dateTime: "02 Nov 2026, 04:15 PM",
    amount: 1000,
    status: "Unpaid",
    issuingAuthority: "Salem City Traffic Police",
    vehicleNo: "TN 30 AB 1234",
    cameraCode: "CAM-04A-FORT",
    dueDate: "22 Nov 2026"
  },
  {
    id: 2,
    challanNo: "TN-SLM-2026-88102",
    offense: "Riding Without Standard Certified Helmet",
    location: "5 Roads Junction, Salem",
    dateTime: "24 Oct 2026, 11:20 AM",
    amount: 500,
    status: "Unpaid",
    issuingAuthority: "Salem Traffic Police Zone 2",
    vehicleNo: "TN 30 AB 1234",
    cameraCode: "CAM-12B-5ROADS",
    dueDate: "14 Nov 2026"
  },
  {
    id: 3,
    challanNo: "TN-SLM-2026-64119",
    offense: "Red Light Signal Jumping Violation",
    location: "New Bus Stand Junction, Salem",
    dateTime: "15 Sep 2026, 06:40 PM",
    amount: 1000,
    status: "Paid",
    paidOn: "16 Sep 2026, 10:15 AM",
    paymentRef: "UPI-4288192001",
    issuingAuthority: "Salem City Traffic Police",
    vehicleNo: "TN 30 AB 1234",
    cameraCode: "CAM-09C-NBS"
  },
  {
    id: 4,
    challanNo: "TN-SLM-2026-55410",
    offense: "Triple Riding on Two-Wheeler",
    location: "Fairlands Junction, Salem",
    dateTime: "05 Nov 2026, 05:30 PM",
    amount: 1000,
    status: "Unpaid",
    issuingAuthority: "Salem Traffic Police North",
    vehicleNo: "TN 30 BC 5678",
    cameraCode: "CAM-07F-FAIR",
    dueDate: "25 Nov 2026"
  },
  {
    id: 5,
    challanNo: "TN-SLM-2026-33921",
    offense: "Defective Silencer / Excessive Noise Exhaust",
    location: "Meyyanur Bypass, Salem",
    dateTime: "18 Oct 2026, 08:15 PM",
    amount: 1000,
    status: "Paid",
    paidOn: "19 Oct 2026, 11:30 AM",
    paymentRef: "POS-CARD-9912",
    issuingAuthority: "Salem Highway Patrol",
    vehicleNo: "TN 30 CD 9012",
    cameraCode: "CAM-18M-MEYY"
  },
  {
    id: 6,
    challanNo: "TN-SLM-2026-11884",
    offense: "Holding / Using Mobile Phone while Riding",
    location: "Hasthampatti Roundabout, Salem",
    dateTime: "28 Oct 2026, 02:45 PM",
    amount: 1000,
    status: "Unpaid",
    issuingAuthority: "Salem Traffic Police East",
    vehicleNo: "TN 30 EF 3456",
    cameraCode: "CAM-03H-HAST",
    dueDate: "18 Nov 2026"
  }
];

export const initialMembership = {
  customerName: "Bharath",
  regNo: "TN 30 AB 1234",
  bikeModel: "Yamaha FZ-S (Connected IoT Edition)",
  purchasedBranch: "Salem Central Mega Hub",
  purchaseDate: "12 Jan 2026",
  gpsEquipped: true,
  gpsImei: "864192053189201",
  tier: "Gold VIP",
  pointsBalance: 1250,
  monetaryValue: 1250, // ₹1 = 1 point
  sameBranchPrivilege: true,
  privilegeSummary: "Earned on GPS bike purchase. Redeemable for instant service invoice discounts exclusively when visiting Salem Central Mega Hub.",
  benefits: [
    "Exclusive discounts on periodic services at Salem Central Mega Hub",
    "1,000 Points GPS onboarding welcome bonus credited on delivery",
    "Free doorstep pick & drop within 10 km from Salem Central Hub",
    "Zero labor charge on 18-point safety audit during service visits"
  ],
  transactions: [
    {
      id: 1,
      title: "GPS-Equipped Bike Purchase Bonus (Salem Central Mega Hub)",
      points: 1000,
      type: "earned",
      date: "12 Jan 2026",
      balanceAfter: 1000,
      badge: "GPS Purchase Bonus"
    },
    {
      id: 2,
      title: "1st Periodic Service Completed at Salem Central Mega Hub",
      points: 150,
      type: "earned",
      date: "12 Apr 2026",
      balanceAfter: 1150,
      badge: "Same-Branch Visit"
    },
    {
      id: 3,
      title: "On-Time Service Maintenance Bonus",
      points: 100,
      type: "earned",
      date: "12 Apr 2026",
      balanceAfter: 1250,
      badge: "Loyalty Bonus"
    }
  ],
  availableDiscounts: [
    {
      id: 1,
      title: "General Periodic Service (Save ₹500)",
      serviceTitle: "General Periodic Service",
      category: "Full Service",
      originalPrice: 1250,
      pointsRequired: 500,
      pointsCost: 500,
      discountAmount: 500,
      finalPrice: 750,
      applicableBranch: "Salem Central Mega Hub",
      desc: "Comprehensive 18-point safety audit, synthetic oil top-up, spark plug check & chain lubrication.",
      voucherPrefix: "HUB-GPS-GEN500",
      code: "GEN500"
    },
    {
      id: 2,
      title: "Synthetic Engine Oil & Filter Service (Save ₹350)",
      serviceTitle: "Synthetic Engine Oil & Filter Change",
      category: "Oil Care",
      originalPrice: 850,
      pointsRequired: 350,
      pointsCost: 350,
      discountAmount: 350,
      finalPrice: 500,
      applicableBranch: "Salem Central Mega Hub",
      desc: "Motul 7100 100% Synthetic 10W40 oil replacement + OEM Yamaha oil filter.",
      voucherPrefix: "HUB-GPS-OIL350",
      code: "OIL350"
    },
    {
      id: 3,
      title: "Brake Pad & Caliper Overhaul (Save ₹250)",
      serviceTitle: "Brake Pad & Hydraulic Caliper Overhaul",
      category: "Braking",
      originalPrice: 600,
      pointsRequired: 250,
      pointsCost: 250,
      discountAmount: 250,
      finalPrice: 350,
      applicableBranch: "Salem Central Mega Hub",
      desc: "Front & rear disc pad cleaning, DOT 4 hydraulic fluid bleed, and piston lube.",
      voucherPrefix: "HUB-GPS-BRK250",
      code: "BRK250"
    },
    {
      id: 4,
      title: "Major Engine Tuning & Valve Clearance (Save ₹1,000)",
      serviceTitle: "Major Engine Tuning & ECU Scan",
      category: "Major Overhaul",
      originalPrice: 2400,
      pointsRequired: 1000,
      pointsCost: 1000,
      discountAmount: 1000,
      finalPrice: 1400,
      applicableBranch: "Salem Central Mega Hub",
      desc: "Throttle body de-carb, tappet adjustment, ECU sensor diagnostics & dyno testing.",
      voucherPrefix: "HUB-GPS-TUNE1000",
      code: "TUNE1000"
    }
  ],
  availableRewards: [
    {
      id: 1,
      title: "General Periodic Service (Save ₹500)",
      serviceTitle: "General Periodic Service",
      pointsCost: 500,
      pointsRequired: 500,
      discountAmount: 500,
      originalPrice: 1250,
      finalPrice: 750,
      applicableBranch: "Salem Central Mega Hub",
      category: "Service Discount",
      code: "GEN500",
      desc: "Pay ₹750 instead of ₹1,250 on your next service at Salem Central Mega Hub."
    },
    {
      id: 2,
      title: "Synthetic Engine Oil Service (Save ₹350)",
      serviceTitle: "Synthetic Engine Oil & Filter Change",
      pointsCost: 350,
      pointsRequired: 350,
      discountAmount: 350,
      originalPrice: 850,
      finalPrice: 500,
      applicableBranch: "Salem Central Mega Hub",
      category: "Service Discount",
      code: "OIL350",
      desc: "Pay ₹500 instead of ₹850 with Motul 7100 Synthetic oil at Salem Central Mega Hub."
    },
    {
      id: 3,
      title: "Brake Pad Overhaul (Save ₹250)",
      serviceTitle: "Brake Pad & Caliper Overhaul",
      pointsCost: 250,
      pointsRequired: 250,
      discountAmount: 250,
      originalPrice: 600,
      finalPrice: 350,
      applicableBranch: "Salem Central Mega Hub",
      category: "Service Discount",
      code: "BRK250",
      desc: "Pay ₹350 instead of ₹600 for front & rear disc brake service."
    },
    {
      id: 4,
      title: "Major Engine Tuning (Save ₹1,000)",
      serviceTitle: "Major Engine Tuning & ECU Scan",
      pointsCost: 1000,
      pointsRequired: 1000,
      discountAmount: 1000,
      originalPrice: 2400,
      finalPrice: 1400,
      applicableBranch: "Salem Central Mega Hub",
      category: "Service Discount",
      code: "TUNE1000",
      desc: "Pay ₹1,400 instead of ₹2,400 for comprehensive valve adjustment & ECU diagnostic."
    }
  ]
};

export const mockRoutePlaybackTrip = {
  tripTitle: "Morning Commute • Fairlands to Anna Park",
  date: "Today, 08:30 AM",
  totalDistance: "8.4 km",
  duration: "18 mins",
  avgSpeed: "32 km/h",
  topSpeed: "54 km/h",
  idleTime: "2.5 mins",
  points: [
    { lat: 11.6692, lng: 78.1524, speed: "0 km/h", time: "08:30 AM", label: "Trip Start (Fairlands Main Rd)" },
    { lat: 11.6705, lng: 78.1538, speed: "28 km/h", time: "08:32 AM", label: "Fairlands Circle" },
    { lat: 11.6720, lng: 78.1560, speed: "38 km/h", time: "08:34 AM", label: "Sarada College Road" },
    { lat: 11.6745, lng: 78.1610, speed: "45 km/h", time: "08:37 AM", label: "Hasthampatti Roundabout" },
    { lat: 11.6728, lng: 78.1635, speed: "52 km/h", time: "08:40 AM", label: "Cherry Road Straight" },
    { lat: 11.6690, lng: 78.1610, speed: "54 km/h", time: "08:42 AM", label: "Collectorate Junction (Top Speed)" },
    { lat: 11.6660, lng: 78.1550, speed: "36 km/h", time: "08:44 AM", label: "Four Roads Connector" },
    { lat: 11.6643, lng: 78.1460, speed: "18 km/h", time: "08:46 AM", label: "Approaching Anna Park" },
    { lat: 11.6635, lng: 78.1450, speed: "0 km/h", time: "08:48 AM", label: "Trip End (Anna Park Salem)" }
  ]
};

export const mockCustomerGeofences = [
  {
    id: "geo-1",
    name: "Home Safe Zone",
    location: "Fairlands Residence, Salem",
    lat: 11.6692,
    lng: 78.1524,
    radiusMeters: 250,
    status: "Inside",
    alertOnExit: true,
    alertOnEnter: true,
    color: "#10b981"
  },
  {
    id: "geo-2",
    name: "Office Safe Zone",
    location: "Salem IT Park / Omalur Rd",
    lat: 11.6820,
    lng: 78.1325,
    radiusMeters: 350,
    status: "Outside",
    alertOnExit: true,
    alertOnEnter: true,
    color: "#3b82f6"
  },
  {
    id: "geo-3",
    name: "Service Mega Hub Safe Zone",
    location: "Salem Central Workshop",
    lat: 11.6643,
    lng: 78.1460,
    radiusMeters: 400,
    status: "Outside",
    alertOnExit: false,
    alertOnEnter: true,
    color: "#f59e0b"
  }
];

export const mockPendingServices = [
  {
    id: 1,
    regNo: "TN 30 AB 1234",
    brand: "Yamaha",
    model: "Yamaha FZ-S",
    customer: "Bharath",
    phone: "9876543210",
    serviceDueDays: -4, // Overdue 4 days
    status: "Critical Overdue",
    urgencyColor: "red",
    lastServiceDate: "12 Apr 2026",
    odometerCurrent: "14,820 km",
    odometerDueAt: "15,000 km",
    estimatedCost: "₹1,450",
    serviceCategory: "Major Periodic Service",
    recommendedPackage: "Engine Tune + Full Fluids + Brake Pad Check",
    stage: "Pending Customer Booking",
    lastNotified: "Yesterday, 10:30 AM",
    storeBranch: "Salem Central Mega Hub",
    notes: "Odometer exceeded interval by 450 km. Engine oil past service life."
  },
  {
    id: 2,
    regNo: "TN 11 U 7890",
    brand: "Bajaj",
    model: "Bajaj Pulsar",
    customer: "Suresh",
    phone: "9090909090",
    serviceDueDays: -12, // Overdue 12 days
    status: "Critical Overdue",
    urgencyColor: "red",
    lastServiceDate: "12 Jan 2026",
    odometerCurrent: "26,900 km",
    odometerDueAt: "27,500 km",
    estimatedCost: "₹3,400",
    serviceCategory: "Engine & Valve Check",
    recommendedPackage: "White smoke inspection + Carb clean + Oil flush",
    stage: "Pending Customer Booking",
    lastNotified: "2 days ago",
    storeBranch: "Omalur Expressway Service Hub",
    notes: "Customer reported engine smoke. High priority call required."
  },
  {
    id: 3,
    regNo: "TN 28 CD 5678",
    brand: "Honda",
    model: "Honda Activa",
    customer: "Priya",
    phone: "9876543210",
    serviceDueDays: 3,
    status: "Due in 3 Days",
    urgencyColor: "amber",
    lastServiceDate: "15 Apr 2026",
    odometerCurrent: "11,850 km",
    odometerDueAt: "12,000 km",
    estimatedCost: "₹850",
    serviceCategory: "General Periodic Service",
    recommendedPackage: "Drive belt inspection + Air filter + Synthetic Oil",
    stage: "Pending Slot Confirmation",
    lastNotified: "Today, 08:15 AM",
    storeBranch: "Fairlands Express Workshop",
    notes: "Customer accepted tentative slot on 18 Oct."
  },
  {
    id: 4,
    regNo: "KA 03 MH 9921",
    brand: "KTM",
    model: "KTM Duke 250",
    customer: "Arun",
    phone: "9845123456",
    serviceDueDays: 5,
    status: "Due in 5 Days",
    urgencyColor: "amber",
    lastServiceDate: "20 Mar 2026",
    odometerCurrent: "11,900 km",
    odometerDueAt: "12,500 km",
    estimatedCost: "₹2,800",
    serviceCategory: "Chain & Brake Overhaul",
    recommendedPackage: "Brass sprocket kit + Motul 300V Oil + Coolant flush",
    stage: "Pending Parts Arrival",
    lastNotified: "3 days ago",
    storeBranch: "Attur Bypass Quick Care Hub",
    notes: "Sprocket assembly ordered from KTM regional hub."
  },
  {
    id: 5,
    regNo: "TN 45 EF 9012",
    brand: "TVS",
    model: "TVS Apache",
    customer: "Mani",
    phone: "9123456780",
    serviceDueDays: 11,
    status: "Upcoming in 11 Days",
    urgencyColor: "blue",
    lastServiceDate: "10 Jan 2026",
    odometerCurrent: "18,400 km",
    odometerDueAt: "19,000 km",
    estimatedCost: "₹1,200",
    serviceCategory: "Periodic Maintenance",
    recommendedPackage: "Spark plug + Disc pads + Throttle body clean",
    stage: "Reminder Scheduled",
    lastNotified: "Not sent yet",
    storeBranch: "Salem Central Mega Hub",
    notes: "Auto-reminder scheduled for dispatch 7 days prior."
  },
  {
    id: 6,
    regNo: "TN 30 GH 3456",
    brand: "Royal Enfield",
    model: "Royal Enfield Classic",
    customer: "Karthik",
    phone: "9988776655",
    serviceDueDays: 14,
    status: "Upcoming in 14 Days",
    urgencyColor: "blue",
    lastServiceDate: "05 Apr 2026",
    odometerCurrent: "10,650 km",
    odometerDueAt: "11,000 km",
    estimatedCost: "₹2,100",
    serviceCategory: "General Service + Valve clearance",
    recommendedPackage: "Tappet adjustment + Fork oil check + Clutch adjustment",
    stage: "Reminder Scheduled",
    lastNotified: "Not sent yet",
    storeBranch: "Fairlands Express Workshop",
    notes: "Customer prefers weekend morning drop-off."
  }
];

// ============================================================================
// SAMPLE DATA FOR SALES & REVENUE ANALYTICS (UI Preview until Backend API)
// ============================================================================
export const mockSalesAnalytics = {
  summary: {
    dailySales: 14850,
    weeklySales: 96400,
    monthlySales: 412500,
    yearlySales: 4860000,
    serviceRevenue: 198000,
    sparePartsRevenue: 142500,
    labourRevenue: 72000
  },
  monthlyComparison: [
    { month: "Apr", service: 142000, parts: 98000, labour: 54000, total: 294000 },
    { month: "May", service: 158000, parts: 112000, labour: 59000, total: 329000 },
    { month: "Jun", service: 164000, parts: 118000, labour: 61000, total: 343000 },
    { month: "Jul", service: 175000, parts: 126000, labour: 64000, total: 365000 },
    { month: "Aug", service: 186000, parts: 134000, labour: 68000, total: 388000 },
    { month: "Sep", service: 198000, parts: 142500, labour: 72000, total: 412500 }
  ],
  topSellingServices: [
    { name: "General Periodic Service", count: 148, revenue: 125800, share: 36 },
    { name: "Engine Oil & Filter Replacement", count: 124, revenue: 93000, share: 27 },
    { name: "Chain & Sprocket Overhaul", count: 68, revenue: 64600, share: 18 },
    { name: "Brake Pad & Disc Maintenance", count: 82, revenue: 45100, share: 13 },
    { name: "Battery & Electrical Diagnostics", count: 34, revenue: 22100, share: 6 }
  ],
  topSellingParts: [
    { name: "Motul 7100 10W40 Synthetic Oil", sku: "OIL-MOT-7100", unitsSold: 132, revenue: 79200 },
    { name: "Rolon Brass Chain & Sprocket Kit", sku: "CHN-ROL-428", unitsSold: 42, revenue: 54600 },
    { name: "Amaron Pro Bike Rider Battery (5Ah)", sku: "BAT-AMR-05", unitsSold: 24, revenue: 33600 },
    { name: "Brembo / Nissin Front Brake Pads", sku: "BRK-NIS-01", unitsSold: 64, revenue: 28800 },
    { name: "OEM Air Filter & Spark Plug Combo", sku: "FLT-OEM-12", unitsSold: 89, revenue: 22250 }
  ]
};

// ============================================================================
// SAMPLE DATA FOR CUSTOMER RATINGS & FEEDBACK (UI Preview until Backend API)
// ============================================================================
export const mockCustomerRatings = {
  overallRating: 4.7,
  totalReviews: 184,
  distribution: [
    { stars: 5, count: 136, percentage: 74 },
    { stars: 4, count: 31, percentage: 17 },
    { stars: 3, count: 11, percentage: 6 },
    { stars: 2, count: 4, percentage: 2 },
    { stars: 1, count: 2, percentage: 1 }
  ],
  serviceWiseRatings: [
    { service: "General Periodic Service", rating: 4.8, reviews: 76 },
    { service: "Engine Oil & Filter", rating: 4.9, reviews: 44 },
    { service: "Chain & Brake Service", rating: 4.6, reviews: 32 },
    { service: "Battery & Electrical", rating: 4.5, reviews: 18 },
    { service: "Tyre & Suspension", rating: 4.7, reviews: 14 }
  ],
  monthlyTrend: [
    { month: "Apr", rating: 4.4, reviews: 24 },
    { month: "May", rating: 4.5, reviews: 28 },
    { month: "Jun", rating: 4.6, reviews: 31 },
    { month: "Jul", rating: 4.6, reviews: 33 },
    { month: "Aug", rating: 4.7, reviews: 32 },
    { month: "Sep", rating: 4.8, reviews: 36 }
  ],
  feedbackList: [
    {
      id: 1,
      customerName: "Bharath",
      bikeModel: "Yamaha FZ-S",
      regNo: "TN 30 AB 1234",
      serviceType: "General Service + Chain Lube",
      rating: 5,
      date: "18 Sep 2026",
      comment: "Sample Review: Very smooth pickup after engine oil and chain adjustment. Transparent billing and timely SMS updates."
    },
    {
      id: 2,
      customerName: "Priya",
      bikeModel: "Honda Activa",
      regNo: "TN 28 CD 5678",
      serviceType: "Periodic Maintenance",
      rating: 5,
      date: "15 Sep 2026",
      comment: "Sample Review: Quick turnaround at Salem Central Hub. Scooter feels brand new."
    },
    {
      id: 3,
      customerName: "Karthik",
      bikeModel: "Royal Enfield Classic",
      regNo: "TN 30 XY 4321",
      serviceType: "Tappet & Brake Overhaul",
      rating: 4,
      date: "12 Sep 2026",
      comment: "Sample Review: Good mechanical work on tappet noise. Delivery was 20 mins later than promised, otherwise great."
    },
    {
      id: 4,
      customerName: "Suresh",
      bikeModel: "Bajaj Pulsar 150",
      regNo: "TN 30 EF 9012",
      serviceType: "Battery & Electrical Check",
      rating: 5,
      date: "08 Sep 2026",
      comment: "Sample Review: Diagnosed the stator coil issue accurately instead of just replacing the battery."
    },
    {
      id: 5,
      customerName: "Arun",
      bikeModel: "TVS Apache RTR",
      regNo: "TN 34 GH 3456",
      serviceType: "Brake & Chain Service",
      rating: 3,
      date: "02 Sep 2026",
      comment: "Sample Review: Service quality is good, waiting lounge could use more seating during weekend rush."
    }
  ]
};

// ============================================================================
// SAMPLE DATA FOR CUSTOMER IDENTITY VERIFICATION (No Real IDs or LocalStorage)
// ============================================================================
export const mockCustomerVerifications = {
  1: {
    aadhaar: { status: "Verified", maskedRef: "XXXX-XXXX-4821", verifiedDate: "14 Sep 2026", fileName: "sample_aadhaar_placeholder.pdf" },
    pan: { status: "Verified", maskedRef: "ABCDE****F", verifiedDate: "14 Sep 2026", fileName: "sample_pan_placeholder.jpg" },
    voterId: { status: "Not Submitted", maskedRef: "—", verifiedDate: "—", fileName: "" }
  },
  2: {
    aadhaar: { status: "Verified", maskedRef: "XXXX-XXXX-7390", verifiedDate: "10 Sep 2026", fileName: "sample_aadhaar_placeholder.png" },
    pan: { status: "Pending", maskedRef: "FGHIJ****K", verifiedDate: "Pending Review", fileName: "sample_pan_upload.jpg" },
    voterId: { status: "Not Submitted", maskedRef: "—", verifiedDate: "—", fileName: "" }
  },
  3: {
    aadhaar: { status: "Pending", maskedRef: "XXXX-XXXX-1104", verifiedDate: "Pending Review", fileName: "sample_aadhaar_upload.jpg" },
    pan: { status: "Not Submitted", maskedRef: "—", verifiedDate: "—", fileName: "" },
    voterId: { status: "Rejected", maskedRef: "TN/12/****/884", verifiedDate: "05 Sep 2026 (Blurry Scan)", fileName: "sample_voter_blurry.jpg" }
  }
};
