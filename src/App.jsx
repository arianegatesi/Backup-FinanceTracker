import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import DashboardLayout from './pages/DashboardLayout';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/AdminDashboard';
import Invoices from './pages/Invoices';
import Employees from './pages/Employees';
import DashboardPage from './pages/DashboardPage';

import Unauthorized from './pages/Unauthorized';
import TransactionsPage from './pages/TransactionsPage';
import BudgetsPage from './pages/BudgetsPage';
import CategoriesPage from './pages/CategoriesPage';
import ReportsPage from './pages/ReportsPage';
import AccountsPage from './pages/AccountsPages';

function App() {
  return (
    
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Toaster position="top-right" />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected routes */}
            <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
              <Route
                path="/admin-dashboard"
                element={
                  <DashboardLayout>
                    <AdminDashboard />
                  </DashboardLayout>
                }
              />
            </Route>

            <Route element={<PrivateRoute allowedRoles={['STUDENT', 'PARTICULAR', 'ACCOUNTANT', 'FINANCEANALYST', 'TREASURER', 'MANAGER']} />}>
              <Route
                path="/dashboard"
                element={
                  <DashboardLayout>
                    <DashboardPage />
                  </DashboardLayout>
                }
              />
            </Route>

            <Route element={<PrivateRoute allowedRoles={['ACCOUNTANT', 'FINANCEANALYST']} />}>
              <Route
                path="/invoice"
                element={
                  <DashboardLayout>
                    <Invoices />
                  </DashboardLayout>
                }
              />
            </Route>

            <Route element={<PrivateRoute allowedRoles={['TREASURER', 'MANAGER']} />}>
              <Route
                path="/employee"
                element={
                  <DashboardLayout>
                    <Employees />
                  </DashboardLayout>
                }
              />
            </Route>

            {/* Other Routes */}
            <Route path="/transactions" element={<DashboardLayout><TransactionsPage /></DashboardLayout>} />
            <Route path="/budgets" element={<DashboardLayout><BudgetsPage /></DashboardLayout>} />
            <Route path="/categories" element={<DashboardLayout><CategoriesPage /></DashboardLayout>} />
            <Route path="/reports" element={<DashboardLayout><ReportsPage /></DashboardLayout>} />
            <Route path="/accounts" element={<DashboardLayout><AccountsPage /></DashboardLayout>} />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
    
    
  );
  
}

export default App;
