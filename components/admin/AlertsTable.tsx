
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Alert, Severity, VisibilityType, Team, User } from '../../types';
import { TEAMS, USERS } from '../../constants';
import { Icon } from '../common/Icon';
import { AlertForm } from './AlertForm';

const SeverityTag: React.FC<{ severity: Severity }> = ({ severity }) => {
  const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
  const colorClasses = {
    [Severity.INFO]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    [Severity.WARNING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    [Severity.CRITICAL]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  };
  return <span className={`${baseClasses} ${colorClasses[severity]}`}>{severity}</span>;
};

const StatusTag: React.FC<{ alert: Alert }> = ({ alert }) => {
    const now = new Date();
    const start = new Date(alert.startTime);
    const end = new Date(alert.expiryTime);

    if (alert.isArchived) {
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100">Archived</span>;
    }
    if (now < start) {
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">Scheduled</span>;
    }
    if (now > end) {
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100">Expired</span>;
    }
    return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Active</span>;
};


export const AlertsTable: React.FC = () => {
  const { alerts, updateAlert } = useAppContext();
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const [filter, setFilter] = useState({ severity: '', status: '', audience: '' });

  const filteredAlerts = useMemo(() => {
    return alerts
      .filter(alert => {
        if (filter.severity && alert.severity !== filter.severity) return false;
        if (filter.audience && alert.visibilityType !== filter.audience) return false;
        if (filter.status) {
            const now = new Date();
            const start = new Date(alert.startTime);
            const end = new Date(alert.expiryTime);
            if (filter.status === 'active' && !(start <= now && now <= end && !alert.isArchived)) return false;
            if (filter.status === 'expired' && !(now > end && !alert.isArchived)) return false;
            if (filter.status === 'archived' && !alert.isArchived) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [alerts, filter]);

  const handleArchive = (alert: Alert) => {
    if(window.confirm(`Are you sure you want to archive "${alert.title}"?`)) {
        updateAlert({ ...alert, isArchived: true });
    }
  };
  
  const getAudience = (alert: Alert) => {
    if (alert.visibilityType === VisibilityType.ORGANIZATION) return 'Entire Organization';
    if (alert.visibilityType === VisibilityType.TEAM) {
        return alert.visibilityTarget.map(id => TEAMS.find(t => t.id === id)?.name).join(', ');
    }
    if (alert.visibilityType === VisibilityType.USER) {
        return alert.visibilityTarget.map(id => USERS.find(u => u.id === id)?.name).join(', ');
    }
    return 'N/A';
  }

  return (
    <>
      <div className="flex space-x-4 mb-4">
        <select onChange={e => setFilter(f => ({...f, severity: e.target.value}))} className="block w-full sm:w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          <option value="">All Severities</option>
          {Object.values(Severity).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select onChange={e => setFilter(f => ({...f, status: e.target.value}))} className="block w-full sm:w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="archived">Archived</option>
        </select>
        <select onChange={e => setFilter(f => ({...f, audience: e.target.value}))} className="block w-full sm:w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="">All Audiences</option>
            {Object.values(VisibilityType).map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Severity</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Audience</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Active Period</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredAlerts.map(alert => (
              <tr key={alert.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{alert.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">{alert.message}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap"><SeverityTag severity={alert.severity} /></td>
                <td className="px-6 py-4 whitespace-nowrap"><StatusTag alert={alert}/></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{getAudience(alert)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(alert.startTime).toLocaleString()} - {new Date(alert.expiryTime).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => setEditingAlert(alert)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"><Icon name="edit" /></button>
                  {!alert.isArchived && <button onClick={() => handleArchive(alert)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"><Icon name="archive" /></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingAlert && <AlertForm alert={editingAlert} onClose={() => setEditingAlert(null)} />}
    </>
  );
};
