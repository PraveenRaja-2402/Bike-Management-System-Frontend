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
      const stored = localStorage.getItem('bike_mgmt_auth_user');
      return stored ? JSON.parse(stored) : mockAuthCredentials[0];
    } catch {
      return mockAuthCredentials[0];
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('bike_mgmt_auth_status') !== 'logged_out';
  });

  const [authError, setAuthError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);

  const currentRole = currentUser?.role || 'super_admin';

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

    // Find account by email or aliases
    const account = authUsers.find(u => 
      u.email.toLowerCase() === input || 
      (u.aliases && u.aliases.some(a => a.toLowerCase() === input))
    );

    if (!account) {
      const err = 'Account not found. Please verify the email or username entered.';
      setAuthError(err);
      return { success: false, error: err };
    }

    // Verify distinct passwords: Super Admin and Admin have different passwords!
    if (account.password !== password) {
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
    localStorage.removeItem('bike_mgmt_auth_token');
    localStorage.removeItem('bike_mgmt_auth_user');
    localStorage.setItem('bike_mgmt_auth_status', 'logged_out');
    setAuthError('');
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

