
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { User } from '../../types';
import { Icon } from './Icon';

export const Header: React.FC = () => {
  const { currentUser, users, setCurrentUser } = useAppContext();

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUser = users.find(u => u.id === event.target.value);
    if (selectedUser) {
      setCurrentUser(selectedUser);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Icon name="bell" className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Alerting Platform
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Viewing as:
            </span>
            <select
              value={currentUser?.id}
              onChange={handleUserChange}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            >
              {users.map((user: User) => (
                <option key={user.id} value={user.id}>
                  {user.name} {user.isAdmin ? '(Admin)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
