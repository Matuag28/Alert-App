
import React from 'react';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UserDashboard } from './components/user/UserDashboard';
import { Header } from './components/common/Header';
import { useAppContext } from './context/AppContext';

const App: React.FC = () => {
  const { currentUser } = useAppContext();

  return (
    <div className="min-h-screen font-sans text-gray-800 dark:text-gray-200">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        {currentUser?.isAdmin ? <AdminDashboard /> : <UserDashboard />}
      </main>
    </div>
  );
};

export default App;
