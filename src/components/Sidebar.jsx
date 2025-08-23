import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, PiggyBank, Tags, BarChart3, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';  // Import the useAuth hook

const Sidebar = () => {
  const { user } = useAuth(); // Access the user object from context

  // Common navigation items available to all users
  const navItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/transactions', icon: <Receipt size={20} />, label: 'Transactions' },
    { path: '/budgets', icon: <PiggyBank size={20} />, label: 'Budgets' },
    
    { path: '/categories', icon: <Tags size={20} />, label: 'Categories' },
    { path: '/reports', icon: <BarChart3 size={20} />, label: 'Reports' },
  ];

  // Conditionally add items based on roles
  if (user) {
    if (user.role === 'ADMIN') {
      navItems.push({ path: '/admin-dashboard', icon: <LayoutDashboard size={20} />, label: 'Admin Dashboard' });
    }

    if (['ACCOUNTANT', 'FINANCEANALYST'].includes(user.role)) {
      navItems.push({ path: '/invoice', icon: <Receipt size={20} />, label: 'Invoice' });
    }

    if (['TREASURER', 'MANAGER'].includes(user.role)) {
      navItems.push({ path: '/employee', icon: <Tags size={20} />, label: 'Employee' });
    }
  }

  return (
    <div className="h-screen w-64 bg-gray-900 text-gray-100 fixed left-0 top-0">
      <div className="p-4">
        <h1 className="text-xl font-bold mb-8">Finance Tracker</h1>
        <nav>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="absolute bottom-0 w-full p-4">
        <NavLink
          to="/login"
          className="flex items-center space-x-3 text-gray-300 hover:text-white w-full p-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
