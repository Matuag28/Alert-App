
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { AlertCard } from './AlertCard';
import { NotificationToast } from './NotificationToast';

export const UserDashboard: React.FC = () => {
  const { currentUser, getUserAlerts } = useAppContext();
  const [showToast, setShowToast] = useState(false);
  const [toastAlertTitle, setToastAlertTitle] = useState('');

  const userAlerts = currentUser ? getUserAlerts(currentUser.id) : [];
  
  const activeAlerts = userAlerts.filter(({ alert, preference }) => {
    const isSnoozed = preference?.snoozedUntil && new Date(preference.snoozedUntil) > new Date();
    return !preference?.isRead && !isSnoozed && alert.remindersEnabled;
  });

  useEffect(() => {
    const reminderInterval = setInterval(() => {
      if (activeAlerts.length > 0) {
        // In a real app, you'd cycle through them or pick the most critical one.
        // For this demo, we'll just pick the first one.
        setToastAlertTitle(activeAlerts[0].alert.title);
        setShowToast(true);
      }
    }, 5000); // Demo: 5 seconds instead of 2 hours

    return () => clearInterval(reminderInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAlerts.length]);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const sortedAlerts = [...userAlerts].sort((a, b) => {
      const severityOrder = { 'Critical': 3, 'Warning': 2, 'Info': 1 };
      return severityOrder[b.alert.severity] - severityOrder[a.alert.severity];
  })

  return (
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Your Alerts</h2>
      
      {sortedAlerts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedAlerts.map(({ alert, preference }) => (
            <AlertCard key={alert.id} alert={alert} preference={preference} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">All Clear!</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">You have no active alerts.</p>
        </div>
      )}

      {showToast && <NotificationToast title={toastAlertTitle} onClose={() => setShowToast(false)} />}
    </div>
  );
};
