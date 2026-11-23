import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  mockAdmins, 
  mockAuthCredentials,
  mockStoreLocations, 
  initialBranding, 
  mockUsers, 
  mockBikes, 
  mockCustomerFines, 
  initialMembership,
  mockCustomerGeofences,
  mockPendingServices
} from '../data/mockData';
import {
  defaultServiceIntervals,
  initialBikesList,
  initialServiceRecords,
  initialRepairRecords
} from '../data/serviceData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Authentication & Security State (Session-scoped: fresh URL visit always requires Login first!)
  const [authUsers, setAuthUsers] = useState(() => {
    try {
      const stored = localStorage.getItem('bike_mgmt_auth_users');
      return stored ? JSON.parse(stored) : mockAuthCredentials;
    } catch {
      return mockAuthCredentials;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const status = sessionStorage.getItem('bike_mgmt_auth_status');
      const stored = sessionStorage.getItem('bike_mgmt_auth_user');
      if (status === 'logged_in' && stored) {
        return JSON.parse(stored);
      }
      return null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const status = sessionStorage.getItem('bike_mgmt_auth_status');
    const stored = sessionStorage.getItem('bike_mgmt_auth_user');
    return status === 'logged_in' && !!stored;
  });

  // Ensure any stale permanent auto-login in localStorage is cleared on startup
  useEffect(() => {
    try {
      localStorage.removeItem('bike_mgmt_auth_status');
      localStorage.removeItem('bike_mgmt_auth_user');
      localStorage.removeItem('bike_mgmt_auth_token');
    } catch {
      // ignore
    }
  }, []);

  const [authError, setAuthError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);

  const currentRole = currentUser?.role || 'guest';

  // Super Admin: Admins management
  const [adminsList, setAdminsList] = useState(mockAdmins);

  // Super Admin: Store locations
  const [storesList, setStoresList] = useState(mockStoreLocations);

  // Super Admin: Branding & Logo customizer
  const [branding, setBranding] = useState(initialBranding);

  // Admin & Super Admin: Users creation & management (Persistent in localStorage)
  const [usersList, setUsersList] = useState(() => {
    try {
      const stored = localStorage.getItem('bike_mgmt_users');
      return stored ? JSON.parse(stored) : mockUsers;
    } catch {
      return mockUsers;
    }
  });

  // Sync usersList to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bike_mgmt_users', JSON.stringify(usersList));
    } catch (e) {
      console.error('Failed to sync users to localStorage', e);
    }
  }, [usersList]);

  // Customer Rider Session (Stored in sessionStorage)
  const [currentCustomer, setCurrentCustomer] = useState(() => {
    try {
      const stored = sessionStorage.getItem('bike_mgmt_customer_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const loginCustomer = (phoneOrEmail, pinOrPassword) => {
    const input = (phoneOrEmail || '').trim().replace(/[\s\-\+]/g, '').replace(/^91/, '').toLowerCase();
    const cleanPin = (pinOrPassword || '').trim();

    if (!input) {
      return { success: false, error: 'Please enter your registered mobile number.' };
    }

    const customer = usersList.find((u) => {
      const uPhone = (u.phone || '').trim().replace(/[\s\-\+]/g, '').replace(/^91/, '');
      const uEmail = (u.email || '').toLowerCase().trim();
      return (uPhone === input || uEmail === input);
    });

    if (!customer) {
      return { 
        success: false, 
        error: 'No rider account found with this phone number. Please contact your workshop manager.' 
      };
    }

    const validPins = [
      customer.pin, 
      customer.password, 
      '1234',
      (customer.phone || '').slice(-4)
    ].filter(Boolean);

    if (cleanPin && !validPins.includes(cleanPin)) {
      return { 
        success: false, 
        error: 'Incorrect security PIN. Default is 1234 or verify with your workshop manager.' 
      };
    }

    setCurrentCustomer(customer);
    try {
      sessionStorage.setItem('bike_mgmt_customer_user', JSON.stringify(customer));
    } catch {}

    return { success: true, customer };
  };

  const logoutCustomer = () => {
    setCurrentCustomer(null);
    try {
      sessionStorage.removeItem('bike_mgmt_customer_user');
    } catch {}
  };

  // Persistent Offline Storage Database: Registered Bikes
  const [bikesList, setBikesList] = useState(() => {
    try {
      const stored = localStorage.getItem('bike_service_system_bikes');
      return stored ? JSON.parse(stored) : initialBikesList;
    } catch {
      return initialBikesList;
    }
  });

  // Persistent Offline Storage Database: Service History Records
  const [serviceRecords, setServiceRecords] = useState(() => {
    try {
      const stored = localStorage.getItem('bike_service_system_services');
      return stored ? JSON.parse(stored) : initialServiceRecords;
    } catch {
      return initialServiceRecords;
    }
  });

  // Persistent Offline Storage Database: Repair History Records
  const [repairRecords, setRepairRecords] = useState(() => {
    try {
      const stored = localStorage.getItem('bike_service_system_repairs');
      return stored ? JSON.parse(stored) : initialRepairRecords;
    } catch {
      return initialRepairRecords;
    }
  });

  // Configurable Maintenance & Service Intervals (Stored locally in browser)
  const [serviceIntervals, setServiceIntervals] = useState(() => {
    try {
      const stored = localStorage.getItem('bike_service_system_intervals');
      return stored ? JSON.parse(stored) : defaultServiceIntervals;
    } catch {
      return defaultServiceIntervals;
    }
  });

  // Automatic offline persistence to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bike_service_system_bikes', JSON.stringify(bikesList));
    } catch (e) {
      console.error('Failed to sync bikes to localStorage', e);
    }
  }, [bikesList]);

  useEffect(() => {
    try {
      localStorage.setItem('bike_service_system_services', JSON.stringify(serviceRecords));
    } catch (e) {
      console.error('Failed to sync services to localStorage', e);
    }
  }, [serviceRecords]);

  useEffect(() => {
    try {
      localStorage.setItem('bike_service_system_repairs', JSON.stringify(repairRecords));
    } catch (e) {
      console.error('Failed to sync repairs to localStorage', e);
    }
  }, [repairRecords]);

  useEffect(() => {
    try {
      localStorage.setItem('bike_service_system_intervals', JSON.stringify(serviceIntervals));
    } catch (e) {
      console.error('Failed to sync intervals to localStorage', e);
    }
  }, [serviceIntervals]);

  // Mobile Customer & Fleet: Traffic Police Fines / E-Challans
  const [customerFines, setCustomerFines] = useState(() => {
    try {
      const stored = localStorage.getItem('bike_mgmt_police_fines');
      return stored ? JSON.parse(stored) : mockCustomerFines;
    } catch {
      return mockCustomerFines;
    }
  });

  // Sync police fines to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bike_mgmt_police_fines', JSON.stringify(customerFines));
    } catch (e) {
      console.error('Failed to sync police fines to localStorage', e);
    }
  }, [customerFines]);

  // Mobile Customer: Membership Points & Rewards
  const [membership, setMembership] = useState(initialMembership);

  // Mobile Customer: Geofence Safe Zones
  const [geofences, setGeofences] = useState(mockCustomerGeofences);

  // Service Pending Monitoring ("service bending" / pending services)
  const [pendingServices, setPendingServices] = useState(mockPendingServices);

  // Login handler with distinct password verification
  const login = (emailOrUsername, password, rememberMe = true) => {
    setAuthError('');
    const input = (emailOrUsername || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanPassword) {
      const err = 'Please enter your password.';
      setAuthError(err);
      return { success: false, error: err };
    }

    // Find account by email, username, role, or aliases
    let account = null;
    if (input) {
      account = authUsers.find(u => 
        u.email.toLowerCase() === input || 
        u.role.toLowerCase() === input ||
        (u.aliases && u.aliases.some(a => a.toLowerCase() === input))
      );
    }

    // Fallback: smart detect by unique password if email is blank
    if (!account) {
      account = authUsers.find(u => u.password === cleanPassword);
    }

    if (!account) {
      const err = 'Account not found. Please verify the credentials entered.';
      setAuthError(err);
      return { success: false, error: err };
    }

    // Verify distinct passwords: Super Admin and Admin have different passwords! (Supports simple 'superadmin' / 'admin' or full passwords)
    const isSuper = account.role === 'super_admin';
    const isPasswordValid = isSuper
      ? (cleanPassword === 'SuperAdmin@2026!' || cleanPassword.toLowerCase() === 'superadmin' || cleanPassword === 'super123')
      : (cleanPassword === account.password || cleanPassword.toLowerCase() === 'admin' || cleanPassword === 'admin123');

    if (!isPasswordValid) {
      setFailedAttempts(prev => prev + 1);
      const err = isSuper 
        ? 'Incorrect Super Admin password. (Easy hint: password is "superadmin" or "SuperAdmin@2026!")'
        : 'Incorrect Operations Admin password. (Easy hint: password is "admin" or "Admin@Ops2026!")';
      setAuthError(err);
      return { success: false, error: err };
    }

    // Authentication succeeded
    const token = `JWT_SESSION_${account.role.toUpperCase()}_${Date.now()}`;
    const loggedInUser = {
      ...account,
      lastLogin: 'Just now'
    };

    setCurrentUser(loggedInUser);
    setIsAuthenticated(true);
    setFailedAttempts(0);
    setAuthError('');

    sessionStorage.setItem('bike_mgmt_auth_token', token);
    sessionStorage.setItem('bike_mgmt_auth_user', JSON.stringify(loggedInUser));
    sessionStorage.setItem('bike_mgmt_auth_status', 'logged_in');

    return { success: true, user: loggedInUser };
  };

  // Logout handler
  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    try {
      sessionStorage.clear();
      localStorage.removeItem('bike_mgmt_auth_token');
      localStorage.removeItem('bike_mgmt_auth_user');
      localStorage.removeItem('bike_mgmt_auth_status');
    } catch {
      // ignore
    }
    setAuthError('');
  };

  // Sign up handler for new administrator registration
  const signup = ({ name, email, phone, role = 'admin', password, assignedBranch, masterKey = '' }) => {
    setAuthError('');
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();
    const cleanName = (name || '').trim();

    if (!cleanName || !cleanEmail || !cleanPassword) {
      const err = 'Please enter your full name, email, and password.';
      setAuthError(err);
      return { success: false, error: err };
    }

    // Check if email already registered
    const exists = authUsers.some(u => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      const err = 'An account with this email already exists. Please Sign In.';
      setAuthError(err);
      return { success: false, error: err };
    }

    // Super Admin registration requires master key validation
    const isSuper = role === 'super_admin';
    if (isSuper) {
      const validKeys = ['SUPER-ROOT-2026', 'MASTER-KEY-2026', 'ROOT'];
      if (!masterKey || !validKeys.includes(masterKey.trim().toUpperCase())) {
        const err = 'Super Admin registration requires a valid Master Security Key. (Demo key: SUPER-ROOT-2026)';
        setAuthError(err);
        return { success: false, error: err };
      }
    }

    // Generate avatar initials
    const initials = cleanName
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || (isSuper ? 'SA' : 'AD');

    const newAccount = {
      id: authUsers.length + 1,
      email: cleanEmail,
      aliases: [cleanEmail.split('@')[0]],
      password: cleanPassword,
      name: cleanName,
      role: isSuper ? 'super_admin' : 'admin',
      roleLabel: isSuper ? 'Super Admin' : 'Operations Admin',
      badge: isSuper ? 'Super Admin (Root)' : 'Branch Operations Admin',
      avatar: initials,
      phone: phone ? phone.trim() : '9876543210',
      assignedBranch: assignedBranch || (isSuper ? 'All Branches' : 'Salem Central Mega Hub'),
      permissions: isSuper 
        ? ["Full Access", "Logo & Branding", "Store Management", "Admin Creation"]
        : ["User Creation", "Job Cards", "Service Dispatch", "Live Tracking"],
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    const updatedUsers = [...authUsers, newAccount];
    setAuthUsers(updatedUsers);
    localStorage.setItem('bike_mgmt_auth_users', JSON.stringify(updatedUsers));

    // Also add to adminsList so they appear in Admin Management table
    const newAdminRecord = {
      id: adminsList.length + 1,
      name: newAccount.name,
      email: newAccount.email,
      phone: newAccount.phone,
      role: isSuper ? 'Super Admin' : 'Admin',
      status: 'Active',
      assignedBranch: newAccount.assignedBranch,
      permissions: newAccount.permissions,
      lastLogin: 'Just now'
    };
    setAdminsList([newAdminRecord, ...adminsList]);

    // Automatically log in the newly created account
    const token = `JWT_SESSION_${newAccount.role.toUpperCase()}_${Date.now()}`;
    const loggedInUser = {
      ...newAccount,
      lastLogin: 'Just now'
    };

    setCurrentUser(loggedInUser);
    setIsAuthenticated(true);
    setFailedAttempts(0);
    setAuthError('');

    sessionStorage.setItem('bike_mgmt_auth_token', token);
    sessionStorage.setItem('bike_mgmt_auth_user', JSON.stringify(loggedInUser));
    sessionStorage.setItem('bike_mgmt_auth_status', 'logged_in');

    return { success: true, user: loggedInUser };
  };

  // Switch role with password verification (Accepts simple 'superadmin' / 'admin' or full passwords)
  const switchAccountWithPassword = (targetRole, password) => {
    const target = authUsers.find(u => u.role === targetRole);
    if (!target) return { success: false, error: 'Target role not found' };

    const clean = (password || '').trim();
    const isSuper = targetRole === 'super_admin';
    const isValid = isSuper
      ? (clean === 'SuperAdmin@2026!' || clean.toLowerCase() === 'superadmin' || clean === 'super123')
      : (clean === target.password || clean.toLowerCase() === 'admin' || clean === 'admin123');

    if (!isValid) {
      return { 
        success: false, 
        error: `Incorrect password for ${target.roleLabel}. (Easy hint: use "${isSuper ? 'superadmin' : 'admin'}")` 
      };
    }

    const updated = { ...target, lastLogin: 'Just now' };
    setCurrentUser(updated);
    setIsAuthenticated(true);
    sessionStorage.setItem('bike_mgmt_auth_user', JSON.stringify(updated));
    sessionStorage.setItem('bike_mgmt_auth_status', 'logged_in');
    return { success: true, user: updated };
  };

  // Quick switch role for preview/compatibility
  const switchRole = (newRole) => {
    const target = authUsers.find(u => u.role === newRole) || authUsers[0];
    setCurrentUser(target);
    localStorage.setItem('bike_mgmt_auth_user', JSON.stringify(target));
  };

  // Update Current Authenticated User Profile (Persists to session & local storage)
  const updateCurrentUserProfile = (updatedFields) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...updatedFields };
      sessionStorage.setItem('bike_mgmt_auth_user', JSON.stringify(updated));
      return updated;
    });

    setAuthUsers(prev => {
      const updated = prev.map(u => 
        (u.email === currentUser?.email || u.role === currentUser?.role) 
          ? { ...u, ...updatedFields } 
          : u
      );
      localStorage.setItem('bike_mgmt_auth_users', JSON.stringify(updated));
      return updated;
    });
  };

  // Super Admin actions: Admin management
  const addAdmin = (adminData) => {
    const newAdmin = {
      id: adminsList.length + 1,
      name: adminData.name,
      email: adminData.email,
      phone: adminData.phone,
      role: adminData.role || "Admin",
      status: adminData.status || "Active",
      assignedBranch: adminData.assignedBranch || "All Branches",
      permissions: adminData.permissions || ["User Creation", "Job Cards"],
      lastLogin: "Never"
    };
    setAdminsList([newAdmin, ...adminsList]);
    return newAdmin;
  };

  const updateAdmin = (id, updatedData) => {
    setAdminsList(adminsList.map(a => a.id === id ? { ...a, ...updatedData } : a));
  };

  const deleteAdmin = (id) => {
    setAdminsList(adminsList.filter(a => a.id !== id));
  };

  // Super Admin actions: Store Locations
  const addStore = (storeData) => {
    const newStore = {
      id: storesList.length + 1,
      code: `STR-00${storesList.length + 1}`,
      name: storeData.name,
      address: storeData.address,
      phone: storeData.phone,
      manager: storeData.manager,
      lat: parseFloat(storeData.lat) || 11.6643,
      lng: parseFloat(storeData.lng) || 78.1460,
      serviceBays: parseInt(storeData.serviceBays, 10) || 4,
      operatingHours: storeData.operatingHours || "08:30 AM - 08:00 PM (Mon-Sat)",
      status: storeData.status || "Active",
      geofenceRadiusMeters: parseInt(storeData.geofenceRadiusMeters, 10) || 350,
      activeJobsCount: 0,
      availableTechnicians: parseInt(storeData.availableTechnicians, 10) || 2
    };
    setStoresList([newStore, ...storesList]);
    return newStore;
  };

  const updateStore = (id, updatedData) => {
    setStoresList(storesList.map(s => s.id === id ? { ...s, ...updatedData } : s));
  };

  const deleteStore = (id) => {
    setStoresList(storesList.filter(s => s.id !== id));
  };

  // Super Admin actions: Branding & Logo
  const updateBranding = (newBranding) => {
    setBranding(prev => ({ ...prev, ...newBranding }));
  };

  // Admin action: User Creation (with bidirectional bike sync)
  const addUser = (userData) => {
    const cleanPhone = (userData.phone || '').trim().replace(/[\s\-\+]/g, '').replace(/^91/, '');
    const cleanEmail = (userData.email || '').trim().toLowerCase();
    const cleanName = (userData.name || '').trim();
    const assignedReg = (userData.assignedBike || '').trim().toUpperCase();

    const newUser = {
      id: Date.now(),
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      role: userData.role || "Customer",
      status: userData.status || "Active",
      assignedBike: assignedReg,
      pin: (userData.pin || "1234").trim(),
      membershipPoints: Number(userData.initialPoints ?? userData.membershipPoints) || (userData.role === 'Customer' ? 250 : 0),
      registeredDate: userData.registeredDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    setUsersList(prev => [newUser, ...prev]);

    // Bidirectional sync with bikesList if this is a Customer with a bike:
    if (newUser.role === 'Customer' && assignedReg) {
      setBikesList(prevBikes => {
        const existingBike = prevBikes.find(b => (b.regNo || '').toUpperCase() === assignedReg);
        if (existingBike) {
          // Existing bike: update ownership details
          return prevBikes.map(b => (b.regNo || '').toUpperCase() === assignedReg ? {
            ...b,
            ownerName: cleanName,
            customer: cleanName,
            ownerPhone: cleanPhone,
            phone: cleanPhone,
            ownerEmail: cleanEmail
          } : b);
        } else if (userData.isNewBike || userData.createBikeIfMissing) {
          // New bike details provided: auto-create in bikesList!
          const curKm = parseInt(userData.bikeKm, 10) || 1000;
          const nextKm = curKm + (serviceIntervals?.generalServiceKm || 3000);
          const nextDate = new Date();
          nextDate.setMonth(nextDate.getMonth() + 3);
          const nextDateStr = nextDate.toISOString().split('T')[0];

          const newBikeRecord = {
            id: Date.now() + 1,
            regNo: assignedReg,
            ownerName: cleanName,
            customer: cleanName,
            ownerPhone: cleanPhone,
            phone: cleanPhone,
            ownerEmail: cleanEmail,
            model: (userData.bikeModel || 'Motorcycle').trim(),
            brand: userData.bikeBrand || 'Other',
            purchaseDate: userData.bikePurchaseDate || new Date().toISOString().split('T')[0],
            currentKm: curKm,
            lastServiceDate: 'Not Serviced Yet',
            lastServiceKm: 0,
            nextServiceDate: nextDateStr,
            nextServiceKm: nextKm,
            insuranceExpiryDate: userData.bikeInsuranceExpiry || '',
            status: 'Active',
            notes: `Auto-registered with customer account ${cleanName}`
          };
          return [newBikeRecord, ...prevBikes];
        }
        return prevBikes;
      });
    }

    return newUser;
  };

  const updateUser = (id, updatedData) => {
    const cleanPhone = updatedData.phone ? (updatedData.phone || '').trim().replace(/[\s\-\+]/g, '').replace(/^91/, '') : undefined;
    const cleanName = updatedData.name ? (updatedData.name || '').trim() : undefined;
    const assignedReg = updatedData.assignedBike ? (updatedData.assignedBike || '').trim().toUpperCase() : undefined;

    setUsersList(prev => prev.map(u => {
      if (u.id === id) {
        return {
          ...u,
          ...updatedData,
          name: cleanName !== undefined ? cleanName : u.name,
          phone: cleanPhone !== undefined ? cleanPhone : u.phone,
          assignedBike: assignedReg !== undefined ? assignedReg : u.assignedBike
        };
      }
      return u;
    }));

    // If customer's name, phone, or assignedBike was modified, sync to bikesList:
    if (assignedReg) {
      setBikesList(prevBikes => prevBikes.map(b => {
        if ((b.regNo || '').toUpperCase() === assignedReg) {
          return {
            ...b,
            ownerName: cleanName || b.ownerName,
            customer: cleanName || b.customer,
            ownerPhone: cleanPhone || b.ownerPhone,
            phone: cleanPhone || b.phone
          };
        }
        return b;
      }));
    }
  };

  const deleteUser = (id) => {
    setUsersList(prev => prev.filter(u => u.id !== id));
  };

  // Police Fines / E-Challan Management (Admin & Customer shared)
  const addPoliceFine = (fineData) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + 
      ', ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    
    const dueDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { 
      day: '2-digit', month: 'short', year: 'numeric' 
    });

    const newFine = {
      id: Date.now(),
      challanNo: fineData.challanNo || `TN-SLM-${now.getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      offense: fineData.offense || 'Traffic Rule Violation',
      location: fineData.location || 'Salem Central Circle, Salem',
      dateTime: fineData.dateTime || formattedDate,
      amount: Number(fineData.amount) || 500,
      status: fineData.status || 'Unpaid',
      issuingAuthority: fineData.issuingAuthority || 'Salem City Traffic Police',
      vehicleNo: (fineData.vehicleNo || 'TN 30 AB 1234').toUpperCase().trim(),
      cameraCode: fineData.cameraCode || `CAM-${Math.floor(10 + Math.random() * 90)}Z-AUTO`,
      dueDate: fineData.dueDate || dueDate,
      notes: fineData.notes || '',
      paidOn: fineData.status === 'Paid' ? (fineData.paidOn || formattedDate) : null,
      paymentRef: fineData.status === 'Paid' ? (fineData.paymentRef || `REC-${Date.now().toString().slice(-6)}`) : null
    };

    setCustomerFines(prev => [newFine, ...prev]);
    return newFine;
  };

  const updatePoliceFine = (fineId, updatedData) => {
    setCustomerFines(prev => prev.map(f => f.id === fineId ? { ...f, ...updatedData } : f));
  };

  const deletePoliceFine = (fineId) => {
    setCustomerFines(prev => prev.filter(f => f.id !== fineId));
  };

  // Pay Fine / E-Challan (Admin or Customer)
  const payFine = (fineId, paymentRef = `UPI-${Date.now().toString().slice(-6)}`) => {
    const now = new Date();
    const formattedPaidOn = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ', ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    setCustomerFines(prev => prev.map(fine => {
      if (fine.id === fineId) {
        return {
          ...fine,
          status: "Paid",
          paidOn: formattedPaidOn,
          paymentRef
        };
      }
      return fine;
    }));
  };

  // Customer action: Redeem Reward using points
  const redeemReward = (reward) => {
    const cost = reward.pointsCost || reward.pointsRequired || 0;
    if (membership.pointsBalance < cost) {
      return { success: false, message: "Insufficient points balance" };
    }

    const newBalance = membership.pointsBalance - cost;
    const titleText = reward.discountAmount 
      ? `₹${reward.discountAmount} Discount on ${reward.serviceTitle || reward.title} (Salem Central Hub)`
      : reward.title;

    const newTx = {
      id: membership.transactions.length + 1,
      title: `Redeemed: ${titleText}`,
      points: -cost,
      type: "redeemed",
      date: "Today",
      balanceAfter: newBalance,
      badge: "Branch Discount"
    };

    setMembership(prev => ({
      ...prev,
      pointsBalance: newBalance,
      monetaryValue: newBalance,
      transactions: [newTx, ...prev.transactions]
    }));

    const prefix = reward.voucherPrefix || reward.code || 'DISC';
    return { success: true, voucherCode: `${prefix}-${Math.floor(1000 + Math.random() * 9000)}` };
  };

  // Customer action: Earn points
  const earnPoints = (amount, reason) => {
    const newBalance = membership.pointsBalance + amount;
    const newTx = {
      id: membership.transactions.length + 1,
      title: reason,
      points: amount,
      type: "earned",
      date: "Today",
      balanceAfter: newBalance
    };

    setMembership(prev => ({
      ...prev,
      pointsBalance: newBalance,
      monetaryValue: newBalance,
      transactions: [newTx, ...prev.transactions]
    }));
  };

  // Geofence alert toggle
  const toggleGeofenceAlert = (id, type) => {
    setGeofences(geofences.map(g => {
      if (g.id === id) {
        return { ...g, [type]: !g[type] };
      }
      return g;
    }));
  };

  // Service Pending Monitoring actions
  const updatePendingServiceStage = (id, newStage) => {
    setPendingServices(pendingServices.map(item => {
      if (item.id === id) {
        return { ...item, stage: newStage };
      }
      return item;
    }));
  };

  const sendPendingReminder = (id, channel = "SMS & WhatsApp") => {
    setPendingServices(pendingServices.map(item => {
      if (item.id === id) {
        return { 
          ...item, 
          lastNotified: "Just Now",
          stage: "Reminder Sent"
        };
      }
      return item;
    }));
  };

  // =========================================================================
  // BIKE REPAIR & SERVICE ALERT SYSTEM DATABASE METHODS
  // =========================================================================

  // 1. Bike Registration & Lifecycle Actions
  const addBike = (bikeData) => {
    const newId = `bike-${Date.now()}`;
    const curKm = parseInt(bikeData.currentKm, 10) || 0;
    const intervalKm = parseInt(serviceIntervals.generalServiceKm, 10) || 3000;
    
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 90);
    const nextDateStr = nextDate.toISOString().split('T')[0];

    const newBike = {
      id: newId,
      regNo: (bikeData.regNo || '').trim().toUpperCase(),
      ownerName: bikeData.ownerName || bikeData.customer || '',
      ownerPhone: bikeData.ownerPhone || bikeData.phone || '',
      ownerEmail: bikeData.ownerEmail || bikeData.email || '',
      model: bikeData.model || '',
      brand: bikeData.brand || 'Other',
      purchaseDate: bikeData.purchaseDate || new Date().toISOString().split('T')[0],
      currentKm: curKm,
      lastServiceDate: bikeData.lastServiceDate || 'Not Serviced Yet',
      lastServiceKm: parseInt(bikeData.lastServiceKm, 10) || 0,
      nextServiceDate: bikeData.nextServiceDate || nextDateStr,
      nextServiceKm: parseInt(bikeData.nextServiceKm, 10) || (curKm + intervalKm),
      insuranceExpiryDate: bikeData.insuranceExpiryDate || '',
      status: bikeData.status || 'Active',
      notes: bikeData.notes || ''
    };

    setBikesList(prev => [newBike, ...prev]);

    // Automatically sync customer account
    const cleanPhone = (newBike.ownerPhone || '').trim().replace(/[\s\-\+]/g, '').replace(/^91/, '');
    const existingUser = usersList.find(u => (u.phone || '').trim().replace(/[\s\-\+]/g, '').replace(/^91/, '') === cleanPhone);
    if (!existingUser && newBike.ownerName && cleanPhone) {
      addUser({
        name: newBike.ownerName,
        phone: cleanPhone,
        email: newBike.ownerEmail || `${newBike.ownerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        role: 'Customer',
        status: 'Active',
        assignedBike: newBike.regNo,
        pin: '1234',
        initialPoints: 250
      });
    } else if (existingUser && (!existingUser.assignedBike || existingUser.assignedBike !== newBike.regNo)) {
      updateUser(existingUser.id, { assignedBike: newBike.regNo });
    }

    return newBike;
  };

  const updateBike = (id, updatedData) => {
    setBikesList(prev => prev.map(b => b.id === id ? { ...b, ...updatedData } : b));
  };

  const deleteBike = (id) => {
    setBikesList(prev => prev.filter(b => b.id !== id));
  };

  const updateBikeKm = (bikeId, newKm) => {
    const kmNum = parseInt(newKm, 10) || 0;
    setBikesList(prev => prev.map(b => {
      if (b.id === bikeId) {
        return {
          ...b,
          currentKm: kmNum
        };
      }
      return b;
    }));
  };

  // 2. Service Tracking Actions
  const addServiceRecord = (serviceData) => {
    const srvId = `srv-${Date.now().toString().slice(-6)}`;
    const srvKm = parseInt(serviceData.serviceKm, 10) || 0;
    const intervalKm = parseInt(serviceIntervals.generalServiceKm, 10) || 3000;
    
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 90);
    const nextDateStr = nextDate.toISOString().split('T')[0];

    const newRecord = {
      id: srvId,
      bikeId: serviceData.bikeId,
      regNo: (serviceData.regNo || '').trim().toUpperCase(),
      ownerName: serviceData.ownerName || '',
      ownerPhone: serviceData.ownerPhone || '',
      serviceDate: serviceData.serviceDate || new Date().toISOString().split('T')[0],
      serviceKm: srvKm,
      serviceCost: parseFloat(serviceData.serviceCost) || 0,
      serviceType: serviceData.serviceType || 'General Periodic Service',
      technician: serviceData.technician || 'Mani',
      items: serviceData.items || {
        engineOil: true,
        brakeOil: false,
        airFilter: false,
        chainMaintenance: false,
        battery: false,
        tyres: false,
        clutch: false,
        generalServicing: true
      },
      notes: serviceData.notes || '',
      nextServiceDate: serviceData.nextServiceDate || nextDateStr,
      nextServiceKm: parseInt(serviceData.nextServiceKm, 10) || (srvKm + intervalKm)
    };

    setServiceRecords(prev => [newRecord, ...prev]);

    // Update corresponding bike's last and next service benchmarks
    setBikesList(prev => prev.map(b => {
      if (b.id === serviceData.bikeId || b.regNo.toUpperCase() === newRecord.regNo) {
        return {
          ...b,
          lastServiceDate: newRecord.serviceDate,
          lastServiceKm: srvKm,
          currentKm: Math.max(parseInt(b.currentKm, 10) || 0, srvKm),
          nextServiceDate: newRecord.nextServiceDate,
          nextServiceKm: newRecord.nextServiceKm
        };
      }
      return b;
    }));

    return newRecord;
  };

  const updateServiceRecord = (id, updatedData) => {
    setServiceRecords(prev => prev.map(s => s.id === id ? { ...s, ...updatedData } : s));
  };

  const deleteServiceRecord = (id) => {
    setServiceRecords(prev => prev.filter(s => s.id !== id));
  };

  // 3. Repair History Actions
  const addRepairRecord = (repairData) => {
    const repId = `rep-${Date.now().toString().slice(-6)}`;
    const repKm = parseInt(repairData.repairKm, 10) || 0;
    const partsCost = (repairData.partsReplaced || []).reduce((sum, p) => sum + (parseFloat(p.total) || (parseFloat(p.quantity || 1) * parseFloat(p.unitCost || 0)) || 0), 0);
    const laborCost = parseFloat(repairData.laborCost) || 0;
    const totalCost = repairData.totalCost ? parseFloat(repairData.totalCost) : (partsCost + laborCost);

    const newRecord = {
      id: repId,
      bikeId: repairData.bikeId,
      regNo: (repairData.regNo || '').trim().toUpperCase(),
      ownerName: repairData.ownerName || '',
      ownerPhone: repairData.ownerPhone || '',
      repairDate: repairData.repairDate || new Date().toISOString().split('T')[0],
      repairKm: repKm,
      repairDetails: repairData.repairDetails || '',
      partsReplaced: repairData.partsReplaced || [],
      laborCost,
      totalCost,
      technician: repairData.technician || 'Mani',
      status: repairData.status || 'Completed'
    };

    setRepairRecords(prev => [newRecord, ...prev]);

    // Update corresponding bike's currentKm if repair km is higher
    setBikesList(prev => prev.map(b => {
      if (b.id === repairData.bikeId || b.regNo.toUpperCase() === newRecord.regNo) {
        return {
          ...b,
          currentKm: Math.max(parseInt(b.currentKm, 10) || 0, repKm)
        };
      }
      return b;
    }));

    return newRecord;
  };

  const updateRepairRecord = (id, updatedData) => {
    setRepairRecords(prev => prev.map(r => r.id === id ? { ...r, ...updatedData } : r));
  };

  const deleteRepairRecord = (id) => {
    setRepairRecords(prev => prev.filter(r => r.id !== id));
  };

  // 4. Configurable Intervals
  const updateServiceIntervals = (newIntervals) => {
    setServiceIntervals(prev => ({ ...prev, ...newIntervals }));
  };

  // 5. Offline Storage Backup & Restoration (PC / Pendrive JSON)
  const exportDatabaseBackup = () => {
    const backupPayload = {
      version: "1.0",
      system: "Bike Repair & Service Alert System",
      exportedAt: new Date().toISOString(),
      bikes: bikesList,
      serviceRecords: serviceRecords,
      repairRecords: repairRecords,
      serviceIntervals: serviceIntervals,
      branding: branding
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupPayload, null, 2));
    const dlAnchorElem = document.createElement('a');
    const today = new Date().toISOString().split('T')[0];
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `bike_repair_service_backup_${today}.json`);
    document.body.appendChild(dlAnchorElem);
    dlAnchorElem.click();
    dlAnchorElem.remove();
    return true;
  };

  const restoreDatabaseFromBackup = (jsonInput) => {
    try {
      const parsed = typeof jsonInput === 'string' ? JSON.parse(jsonInput) : jsonInput;
      if (parsed.bikes && Array.isArray(parsed.bikes)) {
        setBikesList(parsed.bikes);
        localStorage.setItem('bike_service_system_bikes', JSON.stringify(parsed.bikes));
      }
      if (parsed.serviceRecords && Array.isArray(parsed.serviceRecords)) {
        setServiceRecords(parsed.serviceRecords);
        localStorage.setItem('bike_service_system_services', JSON.stringify(parsed.serviceRecords));
      }
      if (parsed.repairRecords && Array.isArray(parsed.repairRecords)) {
        setRepairRecords(parsed.repairRecords);
        localStorage.setItem('bike_service_system_repairs', JSON.stringify(parsed.repairRecords));
      }
      if (parsed.serviceIntervals) {
        setServiceIntervals(parsed.serviceIntervals);
        localStorage.setItem('bike_service_system_intervals', JSON.stringify(parsed.serviceIntervals));
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const resetDatabaseToDefaults = () => {
    setBikesList(initialBikesList);
    setServiceRecords(initialServiceRecords);
    setRepairRecords(initialRepairRecords);
    setServiceIntervals(defaultServiceIntervals);
    localStorage.removeItem('bike_service_system_bikes');
    localStorage.removeItem('bike_service_system_services');
    localStorage.removeItem('bike_service_system_repairs');
    localStorage.removeItem('bike_service_system_intervals');
  };

  // 6. WhatsApp & SMS Customer Notifications Integration
  const sendCustomerWhatsApp = (phone, message) => {
    const digits = (phone || '').replace(/[^0-9]/g, '');
    const recipient = digits.length === 10 ? `91${digits}` : digits;
    const url = `https://wa.me/${recipient}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const sendCustomerSms = (phone, message) => {
    const digits = (phone || '').replace(/[^0-9]/g, '');
    const url = `sms:${digits}?body=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        authUsers,
        login,
        signup,
        logout,
        switchAccountWithPassword,
        authError,
        setAuthError,
        failedAttempts,
        currentRole,
        switchRole,
        currentUser,
        updateCurrentUserProfile,
        adminsList,
        addAdmin,
        updateAdmin,
        deleteAdmin,
        storesList,
        addStore,
        updateStore,
        deleteStore,
        branding,
        updateBranding,
        usersList,
        addUser,
        updateUser,
        deleteUser,
        currentCustomer,
        loginCustomer,
        logoutCustomer,
        bikesList,
        addBike,
        updateBike,
        deleteBike,
        updateBikeKm,
        serviceRecords,
        addServiceRecord,
        updateServiceRecord,
        deleteServiceRecord,
        repairRecords,
        addRepairRecord,
        updateRepairRecord,
        deleteRepairRecord,
        serviceIntervals,
        updateServiceIntervals,
        exportDatabaseBackup,
        restoreDatabaseFromBackup,
        resetDatabaseToDefaults,
        sendCustomerWhatsApp,
        sendCustomerSms,
        customerFines,
        addPoliceFine,
        updatePoliceFine,
        deletePoliceFine,
        payFine,
        membership,
        redeemReward,
        earnPoints,
        geofences,
        toggleGeofenceAlert,
        pendingServices,
        updatePendingServiceStage,
        sendPendingReminder
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}


