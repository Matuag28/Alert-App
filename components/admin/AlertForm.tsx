
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Alert, Severity, DeliveryType, VisibilityType, User, Team } from '../../types';
import { USERS, TEAMS } from '../../constants';
import { Icon } from '../common/Icon';

interface AlertFormProps {
  alert?: Alert;
  onClose: () => void;
}

export const AlertForm: React.FC<AlertFormProps> = ({ alert, onClose }) => {
  const { createAlert, updateAlert } = useAppContext();
  const [formData, setFormData] = useState<Omit<Alert, 'id' | 'createdAt' | 'isArchived'>>({
    title: alert?.title || '',
    message: alert?.message || '',
    severity: alert?.severity || Severity.INFO,
    deliveryTypes: alert?.deliveryTypes || [DeliveryType.IN_APP],
    visibilityType: alert?.visibilityType || VisibilityType.ORGANIZATION,
    visibilityTarget: alert?.visibilityTarget || [],
    startTime: alert?.startTime ? new Date(alert.startTime).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
    expiryTime: alert?.expiryTime ? new Date(alert.expiryTime).toISOString().slice(0, 16) : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    remindersEnabled: alert?.remindersEnabled ?? true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({...prev, [name]: checked}));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMultiSelect = (e: React.ChangeEvent<HTMLSelectElement>, field: 'visibilityTarget') => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, [field]: options }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (alert) {
      updateAlert({ 
        ...alert, 
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
        expiryTime: new Date(formData.expiryTime).toISOString(),
    });
    } else {
      createAlert({
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
        expiryTime: new Date(formData.expiryTime).toISOString(),
      });
    }
    onClose();
  };
  
  const renderVisibilityTarget = () => {
    if (formData.visibilityType === VisibilityType.TEAM) {
      return (
        <div>
          <label htmlFor="visibilityTarget" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Teams</label>
          <select multiple value={formData.visibilityTarget} onChange={(e) => handleMultiSelect(e, 'visibilityTarget')} id="visibilityTarget" name="visibilityTarget" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 h-32">
            {TEAMS.map((team: Team) => <option key={team.id} value={team.id}>{team.name}</option>)}
          </select>
        </div>
      );
    }
    if (formData.visibilityType === VisibilityType.USER) {
      return (
        <div>
          <label htmlFor="visibilityTarget" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Users</label>
          <select multiple value={formData.visibilityTarget} onChange={(e) => handleMultiSelect(e, 'visibilityTarget')} id="visibilityTarget" name="visibilityTarget" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 h-32">
            {USERS.filter(u => !u.isAdmin).map((user: User) => <option key={user.id} value={user.id}>{user.name}</option>)}
          </select>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">{alert ? 'Edit' : 'Create'} Alert</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <Icon name="x" className="h-6 w-6"/>
            </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" required className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
          <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Message" required className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 h-24"/>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select name="severity" value={formData.severity} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
              {Object.values(Severity).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select name="visibilityType" value={formData.visibilityType} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
              {Object.values(VisibilityType).map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          {renderVisibilityTarget()}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                 <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Time</label>
                 <input type="datetime-local" name="startTime" id="startTime" value={formData.startTime} onChange={handleChange} required className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
             </div>
             <div>
                 <label htmlFor="expiryTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Expiry Time</label>
                 <input type="datetime-local" name="expiryTime" id="expiryTime" value={formData.expiryTime} onChange={handleChange} required className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
             </div>
          </div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input id="remindersEnabled" name="remindersEnabled" type="checkbox" checked={formData.remindersEnabled} onChange={handleChange} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"/>
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="remindersEnabled" className="font-medium text-gray-700 dark:text-gray-300">Enable 2-hour reminders</label>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">{alert ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
