
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Alert, Severity } from '../../types';
import { Icon } from '../common/Icon';
import { AlertForm } from './AlertForm';
import { AlertsTable } from './AlertsTable';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SEVERITY_COLORS: Record<Severity, string> = {
    [Severity.INFO]: '#3b82f6', // blue-500
    [Severity.WARNING]: '#f59e0b', // amber-500
    [Severity.CRITICAL]: '#ef4444', // red-500
};

export const AdminDashboard: React.FC = () => {
  const { alerts, preferences } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const analyticsData = useMemo(() => {
    const totalAlerts = alerts.length;
    const deliveredCount = preferences.length;
    const readCount = preferences.filter(p => p.isRead).length;
    const snoozedCount = preferences.filter(p => p.snoozedUntil && new Date(p.snoozedUntil) > new Date()).length;

    const severityCounts = alerts.reduce((acc, alert) => {
      acc[alert.severity] = (acc[alert.severity] || 0) + 1;
      return acc;
    }, {} as Record<Severity, number>);

    const severityChartData = Object.entries(severityCounts).map(([name, value]) => ({ name, value }));
    const deliveredVsReadData = [
        { name: 'Read', value: readCount },
        { name: 'Unread', value: deliveredCount - readCount },
    ];
    
    return {
      totalAlerts,
      deliveredCount,
      readCount,
      snoozedCount,
      severityChartData,
      deliveredVsReadData,
    };
  }, [alerts, preferences]);


  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Icon name="chart" className="h-6 w-6" />
            Analytics Dashboard
        </h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Alerts Created</h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{analyticsData.totalAlerts}</p>
            </div>
             <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Alerts Delivered vs Read</h3>
                 <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{analyticsData.readCount} / {analyticsData.deliveredCount}</p>
            </div>
             <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Snoozed Alerts</h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{analyticsData.snoozedCount}</p>
            </div>
        </div>
         <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
             <h3 className="text-lg font-medium text-gray-900 dark:text-white">Alerts by Severity</h3>
             <div style={{ width: '100%', height: 300 }}>
                 <ResponsiveContainer>
                    <BarChart data={analyticsData.severityChartData}>
                        <XAxis dataKey="name" stroke="#9ca3af"/>
                        <YAxis stroke="#9ca3af"/>
                        <Tooltip contentStyle={{ backgroundColor: '#374151', border: 'none' }} />
                        <Legend />
                        <Bar dataKey="value" name="Alerts">
                            {analyticsData.severityChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.name as Severity]} />
                            ))}
                        </Bar>
                    </BarChart>
                 </ResponsiveContainer>
             </div>
         </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Alerts</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Icon name="plus" className="h-5 w-5 mr-2" />
            Create Alert
          </button>
        </div>
        <AlertsTable />
      </div>

      {isModalOpen && <AlertForm onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};
