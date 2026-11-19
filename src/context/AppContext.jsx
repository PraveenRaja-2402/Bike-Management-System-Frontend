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

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Authentication & Security State
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
      const status = localStorage.getItem('bike_mgmt_auth_status');
      const stored = localStorage.getItem('bike_mgmt_auth_user');
      if (status === 'logged_in' && stored) {
        return JSON.parse(stored);
      }
      return null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const status = localStorage.getItem('bike_mgmt_auth_status');
    const stored = localStorage.getItem('bike_mgmt_auth_user');
    return status === 'logged_in' && !!stored;
  });

  const [authError, setAuthError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);

  const currentRole = currentUser?.role || 'guest';

  // Super Admin: Admins management
  const [adminsList, setAdminsList] = useState(mockAdmins);

  // Super Admin: Store locations
  const [storesList, setStoresList] = useState(mockStoreLocations);

  // Super Admin: Branding & Logo customizer
  const [branding, setBranding] = useState(initialBranding);

  // Admin & Super Admin: Users creation & management
  const [usersList, setUsersList] = useState(mockUsers);

  // Bikes fleet
  const [bikesList, setBikesList] = useState(mockBikes);

  // Mobile Customer: Fines / E-Challans
  const [customerFines, setCustomerFines] = useState(mockCustomerFines);

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

    // Verify distinct passwords: Super Admin and Admin have different passwords!
    if (account.password !== cleanPassword) {
      setFailedAttempts(prev => prev + 1);
      const isSuper = account.role === 'super_admin';
      const err = isSuper 
        ? 'Incorrect Super Admin password. (Hint: Super Admin password is SuperAdmin@2026!)'
        : 'Incorrect Operations Admin password. (Hint: Operations Admin password is Admin@Ops2026!)';
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

    if (rememberMe) {
      localStorage.setItem('bike_mgmt_auth_token', token);
      localStorage.setItem('bike_mgmt_auth_user', JSON.stringify(loggedInUser));
      localStorage.setItem('bike_mgmt_auth_status', 'logged_in');
    }

    return { success: true, user: loggedInUser };
  };

  // Logout handler
  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('bike_mgmt_auth_token');
    localStorage.removeItem('bike_mgmt_auth_user');
    localStorage.setItem('bike_mgmt_auth_status', 'logged_out');
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

    localStorage.setItem('bike_mgmt_auth_token', token);
    localStorage.setItem('bike_mgmt_auth_user', JSON.stringify(loggedInUser));
    localStorage.setItem('bike_mgmt_auth_status', 'logged_in');

    return { success: true, user: loggedInUser };
  };

  // Switch role with password verification
  const switchAccountWithPassword = (targetRole, password) => {
    const target = authUsers.find(u => u.role === targetRole);
    if (!target) return { success: false, error: 'Target role not found' };

    if (target.password !== password) {
      return { 
        success: false, 
        error: `Incorrect password for ${target.roleLabel}. Super Admin and Admin require different passwords.` 
      };
    }

    const updated = { ...target, lastLogin: 'Just now' };
    setCurrentUser(updated);
    setIsAuthenticated(true);
    localStorage.setItem('bike_mgmt_auth_user', JSON.stringify(updated));
    localStorage.setItem('bike_mgmt_auth_status', 'logged_in');
    return { success: true, user: updated };
  };

  // Quick switch role for preview/compatibility
  const switchRole = (newRole) => {
    const target = authUsers.find(u => u.role === newRole) || authUsers[0];
    setCurrentUser(target);
    localStorage.setItem('bike_mgmt_auth_user', JSON.stringify(target));
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

  // Admin action: User Creation
  const addUser = (userData) => {
    const newUser = {
      id: usersList.length + 1,
      name: userData.name,
      phone: userData.phone,
      email: userData.email,
      role: userData.role || "Customer",
      status: userData.status || "Active",
      registeredDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    setUsersList([newUser, ...usersList]);
    return newUser;
  };

  const updateUser = (id, updatedData) => {
    setUsersList(usersList.map(u => u.id === id ? { ...u, ...updatedData } : u));
  };

  const deleteUser = (id) => {
    setUsersList(usersList.filter(u => u.id !== id));
  };

  // Customer action: Pay Fine / E-Challan
  const payFine = (fineId, paymentRef = `UPI-${Date.now().toString().slice(-6)}`) => {
    setCustomerFines(customerFines.map(fine => {
      if (fine.id === fineId) {
        return {
          ...fine,
          status: "Paid",
          paidOn: "Just Now",
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
        bikesList,
        customerFines,
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

