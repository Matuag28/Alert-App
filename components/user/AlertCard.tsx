
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Alert, UserAlertPreference, Severity } from '../../types';
import { Icon } from '../common/Icon';

interface AlertCardProps {
  alert: Alert;
  preference: UserAlertPreference | undefined;
}

const SEVERITY_STYLES: Record<Severity, { icon: 'info' | 'warning' | 'critical'; border: string; iconColor: string }> = {
    [Severity.INFO]: { icon: 'info', border: 'border-blue-500', iconColor: 'text-blue-500' },
    [Severity.WARNING]: { icon: 'warning', border: 'border-yellow-500', iconColor: 'text-yellow-500' },
    [Severity.CRITICAL]: { icon: 'critical', border: 'border-red-500', iconColor: 'text-red-500' },
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, preference }) => {
  const { currentUser, updatePreference } = useAppContext();
  
  const isRead = preference?.isRead ?? false;
  const isSnoozed = preference?.snoozedUntil && new Date(preference.snoozedUntil) > new Date();

  const handleToggleRead = () => {
    if (!currentUser) return;
    updatePreference({
      userId: currentUser.id,
      alertId: alert.id,
      isRead: !isRead,
      snoozedUntil: preference?.snoozedUntil || null,
    });
  };

  const handleSnooze = () => {
    if (!currentUser) return;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Snooze until start of next day
    
    updatePreference({
      userId: currentUser.id,
      alertId: alert.id,
      isRead: preference?.isRead || false,
      snoozedUntil: tomorrow.toISOString(),
    });
  };
  
  const styles = SEVERITY_STYLES[alert.severity];

  if (isSnoozed) {
    return null; // Don't render snoozed alerts
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 ${styles.border} transition-all duration-300 ${isRead ? 'opacity-60' : 'opacity-100'}`}>
      <div className="p-5">
        <div className="flex items-start">
            <Icon name={styles.icon} className={`h-6 w-6 ${styles.iconColor} flex-shrink-0 mt-1`} />
            <div className="ml-4 flex-1">
                <h3 className={`text-lg font-bold ${isRead ? 'line-through' : ''} text-gray-900 dark:text-white`}>{alert.title}</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{alert.message}</p>
                 <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">Expires: {new Date(alert.expiryTime).toLocaleString()}</p>
            </div>
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3 flex justify-end space-x-3">
        <button
          onClick={handleToggleRead}
          className={`inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          <Icon name={isRead ? 'x' : 'check'} className="h-4 w-4 mr-2" />
          {isRead ? 'Mark as Unread' : 'Mark as Read'}
        </button>
        {alert.remindersEnabled && (
        <button
          onClick={handleSnooze}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Icon name="snooze" className="h-4 w-4 mr-2" />
          Snooze
        </button>
        )}
      </div>
    </div>
  );
};
