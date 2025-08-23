import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const FinanceDashboard = () => {
    const { user, logout } = useAuth();
    const [financialReports, setFinancialReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [pendingPayments, setPendingPayments] = useState([]);

    useEffect(() => {
        fetchFinancialData();
    }, []);

    const fetchFinancialData = async () => {
        try {
            // Fetch financial reports
            const reportsResponse = await fetch('/financial-reports');
            // Fetch pending payments
            const paymentsResponse = await fetch('/pending-payments');

            if (reportsResponse.ok && paymentsResponse.ok) {
                const reportsData = await reportsResponse.json();
                const paymentsData = await paymentsResponse.json();

                setFinancialReports(reportsData);
                setPendingPayments(paymentsData);
                calculateTotalRevenue(reportsData);
                setLoading(false);
            } else {
                toast.error('Failed to fetch financial data');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching financial data:', error);
            toast.error('An error occurred');
            setLoading(false);
        }
    };

    const calculateTotalRevenue = (reports) => {
        const total = reports.reduce((sum, report) => sum + report.totalAmount, 0);
        setTotalRevenue(total);
    };

    const handleProcessPayment = async (paymentId) => {
        try {
            const response = await fetch(`/process-payment/${paymentId}`, {
                method: 'POST'
            });

            if (response.ok) {
                toast.success('Payment processed successfully');
                fetchFinancialData(); // Refresh data
            } else {
                toast.error('Failed to process payment');
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            toast.error('An error occurred');
        }
    };

    return (
        <div className="finance-dashboard">
            <header>
                <h1>Finance Dashboard</h1>
                <div className="user-info">
                    <span>Welcome, {user?.userName || 'Finance Officer'}</span>
                    <button onClick={logout} className="logout-btn">Logout</button>
                </div>
            </header>

            <div className="dashboard-content">
                <div className="financial-summary">
                    <div className="summary-card">
                        <h2>Total Revenue</h2>
                        <p className="total-revenue">${totalRevenue.toFixed(2)}</p>
                    </div>
                </div>

                <div className="financial-reports">
                    <h2>Financial Reports</h2>
                    {loading ? (
                        <p>Loading reports...</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Report Period</th>
                                    <th>Total Amount</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {financialReports.map(report => (
                                    <tr key={report.id}>
                                        <td>{report.period}</td>
                                        <td>${report.totalAmount.toFixed(2)}</td>
                                        <td>{report.category}</td>
                                        <td>{report.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="pending-payments">
                    <h2>Pending Payments</h2>
                    {loading ? (
                        <p>Loading pending payments...</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Amount</th>
                                    <th>Due Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingPayments.map(payment => (
                                    <tr key={payment.id}>
                                        <td>{payment.studentName}</td>
                                        <td>${payment.amount.toFixed(2)}</td>
                                        <td>{new Date(payment.dueDate).toLocaleDateString()}</td>
                                        <td>
                                            <button 
                                                onClick={() => handleProcessPayment(payment.id)}
                                                className="process-btn"
                                            >
                                                Process Payment
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FinanceDashboard;