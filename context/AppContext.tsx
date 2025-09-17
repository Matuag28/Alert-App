import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, Alert, UserAlertPreference } from '../types';
import { USERS, INITIAL_ALERTS, INITIAL_PREFERENCES } from '../constants';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  alerts: Alert[];
  preferences: UserAlertPreference[];
  setCurrentUser: (user: User) => void;
  // FIX: Aligned the createAlert signature with its implementation.
  // The implementation sets `isArchived: false`, so it should not be part of the input.
  createAlert: (alert: Omit<Alert, 'id' | 'createdAt' | 'isArchived'>) => void;
  updateAlert: (alert: Alert) => void;
  updatePreference: (preference: UserAlertPreference) => void;
  getUserAlerts: (userId: string) => { alert: Alert; preference: UserAlertPreference | undefined }[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users] = useState<User[]>(USERS);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', USERS[0]);
  const [alerts, setAlerts] = useLocalStorage<Alert[]>('alerts', INITIAL_ALERTS);
  const [preferences, setPreferences] = useLocalStorage<UserAlertPreference[]>('preferences', INITIAL_PREFERENCES);

  const createAlert = useCallback((alertData: Omit<Alert, 'id' | 'createdAt' | 'isArchived'>) => {
    const newAlert: Alert = {
      ...alertData,
      id: `alert-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isArchived: false,
    };
    setAlerts(prev => [...prev, newAlert]);
  }, [setAlerts]);

  const updateAlert = useCallback((updatedAlert: Alert) => {
    setAlerts(prev => prev.map(a => a.id === updatedAlert.id ? updatedAlert : a));
  }, [setAlerts]);

  const updatePreference = useCallback((pref: UserAlertPreference) => {
    setPreferences(prev => {
      const existing = prev.find(p => p.userId === pref.userId && p.alertId === pref.alertId);
      if (existing) {
        return prev.map(p => p.userId === pref.userId && p.alertId === pref.alertId ? pref : p);
      }
      return [...prev, pref];
    });
  }, [setPreferences]);

  const getUserAlerts = useCallback((userId: string) => {
    if (!currentUser) return [];
    const user = users.find(u => u.id === userId);
    if (!user) return [];

    const now = new Date();
    
    return alerts
      .filter(alert => !alert.isArchived)
      .filter(alert => {
        const startTime = new Date(alert.startTime);
        const expiryTime = new Date(alert.expiryTime);
        return startTime <= now && now <= expiryTime;
      })
      .filter(alert => {
        if (alert.visibilityType === 'Entire Organization') return true;
        if (alert.visibilityType === 'Specific Teams') return alert.visibilityTarget.includes(user.teamId);
        if (alert.visibilityType === 'Specific Users') return alert.visibilityTarget.includes(user.id);
        return false;
      })
      .map(alert => ({
        alert,
        preference: preferences.find(p => p.userId === userId && p.alertId === alert.id)
      }));
  }, [alerts, preferences, users, currentUser]);

  return (
    <AppContext.Provider value={{ currentUser, users, alerts, preferences, setCurrentUser, createAlert, updateAlert, updatePreference, getUserAlerts }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
