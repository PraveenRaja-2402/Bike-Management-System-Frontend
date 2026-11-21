// Complete data structures for Bike Repair & Service Alert System

export const defaultServiceIntervals = {
  engineOilKm: 3000,
  airFilterKm: 6000,
  chainMaintenanceKm: 500,
  brakeInspectionKm: 3000,
  batteryCheckMonths: 6,
  generalServiceKm: 3000,
  insuranceExpiryNoticeDays: 30
};

export const initialBikesList = [
  {
    id: "bike-1",
    regNo: "TN 30 AB 1234",
    ownerName: "Bharath Kumar",
    ownerPhone: "9876543210",
    ownerEmail: "bharath@gmail.com",
    model: "Yamaha FZ-S V3",
    brand: "Yamaha",
    purchaseDate: "2024-01-15",
    currentKm: 18450,
    lastServiceDate: "2026-09-05",
    lastServiceKm: 15500,
    nextServiceDate: "2026-12-05",
    nextServiceKm: 18500,
    insuranceExpiryDate: "2026-12-15",
    status: "Active",
    notes: "Daily office commute • Uses fully synthetic oil"
  },
  {
    id: "bike-2",
    regNo: "TN 27 BK 9021",
    ownerName: "Sneha Reddy",
    ownerPhone: "9845011223",
    ownerEmail: "sneha@gmail.com",
    model: "Hunter 350 Dapper",
    brand: "Royal Enfield",
    purchaseDate: "2023-11-20",
    currentKm: 12200,
    lastServiceDate: "2026-05-10",
    lastServiceKm: 8800,
    nextServiceDate: "2026-08-10",
    nextServiceKm: 11800,
    insuranceExpiryDate: "2026-11-25",
    status: "Active",
    notes: "Overdue by 400 km • Chain dry"
  },
  {
    id: "bike-3",
    regNo: "TN 30 CD 9876",
    ownerName: "Ramesh Kumar",
    ownerPhone: "9843212345",
    ownerEmail: "ramesh@gmail.com",
    model: "Honda Activa 6G",
    brand: "Honda",
    purchaseDate: "2022-08-10",
    currentKm: 26800,
    lastServiceDate: "2026-08-20",
    lastServiceKm: 24000,
    nextServiceDate: "2026-11-20",
    nextServiceKm: 27000,
    insuranceExpiryDate: "2026-11-30",
    status: "Active",
    notes: "Insurance expiring in 9 days • Front brake shoe inspection needed"
  },
  {
    id: "bike-4",
    regNo: "TN 30 DE 5678",
    ownerName: "Karthik Raja",
    ownerPhone: "9789055667",
    ownerEmail: "karthik.raja@gmail.com",
    model: "KTM Duke 250",
    brand: "KTM",
    purchaseDate: "2024-04-05",
    currentKm: 9800,
    lastServiceDate: "2026-07-15",
    lastServiceKm: 6500,
    nextServiceDate: "2026-10-15",
    nextServiceKm: 9500,
    insuranceExpiryDate: "2027-04-04",
    status: "Active",
    notes: "Sport rider • Air filter check due"
  },
  {
    id: "bike-5",
    regNo: "TN 28 EF 4321",
    ownerName: "Priya Sundaram",
    ownerPhone: "9944112233",
    ownerEmail: "priya.s@gmail.com",
    model: "TVS Jupiter 125",
    brand: "TVS",
    purchaseDate: "2023-05-18",
    currentKm: 14500,
    lastServiceDate: "2026-09-12",
    lastServiceKm: 13000,
    nextServiceDate: "2026-12-12",
    nextServiceKm: 16000,
    insuranceExpiryDate: "2027-05-17",
    status: "Active",
    notes: "Clean condition • Regular customer"
  },
  {
    id: "bike-6",
    regNo: "TN 30 GH 8765",
    ownerName: "Arunachalam V",
    ownerPhone: "9443219876",
    ownerEmail: "arun.v@gmail.com",
    model: "Hero Splendor Plus",
    brand: "Hero",
    purchaseDate: "2021-06-25",
    currentKm: 42100,
    lastServiceDate: "2026-06-18",
    lastServiceKm: 38500,
    nextServiceDate: "2026-09-18",
    nextServiceKm: 41500,
    insuranceExpiryDate: "2026-10-10",
    status: "Active",
    notes: "Overdue service & Expired Insurance • Urgent reminder required"
  }
];

export const initialServiceRecords = [
  {
    id: "srv-101",
    bikeId: "bike-1",
    regNo: "TN 30 AB 1234",
    ownerName: "Bharath Kumar",
    ownerPhone: "9876543210",
    serviceDate: "2026-09-05",
    serviceKm: 15500,
    serviceCost: 1450,
    serviceType: "Periodic Scheduled Service",
    technician: "Mani",
    items: {
      engineOil: true,
      brakeOil: true,
      airFilter: true,
      chainMaintenance: true,
      battery: true,
      tyres: false,
      clutch: true,
      generalServicing: true
    },
    notes: "Castrol Power 1 10W40 oil filled. Chain lubed and tightened. Brakes adjusted.",
    nextServiceDate: "2026-12-05",
    nextServiceKm: 18500
  },
  {
    id: "srv-102",
    bikeId: "bike-2",
    regNo: "TN 27 BK 9021",
    ownerName: "Sneha Reddy",
    ownerPhone: "9845011223",
    serviceDate: "2026-05-10",
    serviceKm: 8800,
    serviceCost: 2100,
    serviceType: "Full General Maintenance",
    technician: "Anitha",
    items: {
      engineOil: true,
      brakeOil: false,
      airFilter: true,
      chainMaintenance: true,
      battery: true,
      tyres: true,
      clutch: false,
      generalServicing: true
    },
    notes: "Oil change with filter. Tyre pressure calibrated to 32 psi. Battery terminal greased.",
    nextServiceDate: "2026-08-10",
    nextServiceKm: 11800
  },
  {
    id: "srv-103",
    bikeId: "bike-3",
    regNo: "TN 30 CD 9876",
    ownerName: "Ramesh Kumar",
    ownerPhone: "9843212345",
    serviceDate: "2026-08-20",
    serviceKm: 24000,
    serviceCost: 980,
    serviceType: "Routine Scooter Service",
    technician: "Mani",
    items: {
      engineOil: true,
      brakeOil: true,
      airFilter: true,
      chainMaintenance: false,
      battery: true,
      tyres: false,
      clutch: false,
      generalServicing: true
    },
    notes: "Engine oil flushed and refilled. Air filter cleaned with compressed air. Carb tuning.",
    nextServiceDate: "2026-11-20",
    nextServiceKm: 27000
  },
  {
    id: "srv-104",
    bikeId: "bike-4",
    regNo: "TN 30 DE 5678",
    ownerName: "Karthik Raja",
    ownerPhone: "9789055667",
    serviceDate: "2026-07-15",
    serviceKm: 6500,
    serviceCost: 2400,
    serviceType: "High-Performance Service",
    technician: "Anitha",
    items: {
      engineOil: true,
      brakeOil: true,
      airFilter: false,
      chainMaintenance: true,
      battery: true,
      tyres: true,
      clutch: true,
      generalServicing: true
    },
    notes: "Motul 7100 10W50 synthetic oil. Motul C2 chain spray applied. Coolant topped up.",
    nextServiceDate: "2026-10-15",
    nextServiceKm: 9500
  },
  {
    id: "srv-105",
    bikeId: "bike-5",
    regNo: "TN 28 EF 4321",
    ownerName: "Priya Sundaram",
    ownerPhone: "9944112233",
    serviceDate: "2026-09-12",
    serviceKm: 13000,
    serviceCost: 850,
    serviceType: "General Servicing",
    technician: "Mani",
    items: {
      engineOil: true,
      brakeOil: false,
      airFilter: true,
      chainMaintenance: false,
      battery: true,
      tyres: false,
      clutch: false,
      generalServicing: true
    },
    notes: "TVS Tru4 synthetic oil. Spark plug cleaned and gap adjusted.",
    nextServiceDate: "2026-12-12",
    nextServiceKm: 16000
  }
];

export const initialRepairRecords = [
  {
    id: "rep-201",
    bikeId: "bike-1",
    regNo: "TN 30 AB 1234",
    ownerName: "Bharath Kumar",
    ownerPhone: "9876543210",
    repairDate: "2026-08-14",
    repairKm: 14800,
    repairDetails: "Rear brake pad worn out and screeching noise. Replaced rear disc pads and flushed brake line.",
    partsReplaced: [
      { partName: "Yamaha OEM Rear Brake Pad Set", quantity: 1, unitCost: 650, total: 650 },
      { partName: "Brake Fluid DOT 4 (100ml)", quantity: 1, unitCost: 120, total: 120 }
    ],
    laborCost: 250,
    totalCost: 1020,
    technician: "Mani",
    status: "Completed"
  },
  {
    id: "rep-202",
    bikeId: "bike-2",
    regNo: "TN 27 BK 9021",
    ownerName: "Sneha Reddy",
    ownerPhone: "9845011223",
    repairDate: "2026-06-22",
    repairKm: 9400,
    repairDetails: "Heavy clutch lever pull and slippage at high gears. Replaced clutch friction plates & cable.",
    partsReplaced: [
      { partName: "Royal Enfield Clutch Plate Kit", quantity: 1, unitCost: 1400, total: 1400 },
      { partName: "Clutch Cable Inner & Outer", quantity: 1, unitCost: 280, total: 280 }
    ],
    laborCost: 450,
    totalCost: 2130,
    technician: "Anitha",
    status: "Completed"
  },
  {
    id: "rep-203",
    bikeId: "bike-6",
    regNo: "TN 30 GH 8765",
    ownerName: "Arunachalam V",
    ownerPhone: "9443219876",
    repairDate: "2026-07-02",
    repairKm: 39200,
    repairDetails: "Battery dead and self-start clicking. Replaced with new maintenance-free 4Ah battery with 3-yr warranty.",
    partsReplaced: [
      { partName: "Exide Xplore 12V 4Ah MF Battery", quantity: 1, unitCost: 1350, total: 1350 }
    ],
    laborCost: 100,
    totalCost: 1450,
    technician: "Mani",
    status: "Completed"
  }
];
