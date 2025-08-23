import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const IndividualDashboard = () => {
    const { user, logout } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalBalance, setTotalBalance] = useState(0);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            // Replace with your actual transaction fetching endpoint
            const response = await fetch(`/transactions/user/${user.id}`);
            if (response.ok) {
                const transactionData = await response.json();
                setTransactions(transactionData);
                calculateTotalBalance(transactionData);
                setLoading(false);
            } else {
                toast.error('Failed to fetch transactions');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            toast.error('An error occurred');
            setLoading(false);
        }
    };

    const calculateTotalBalance = (transactions) => {
        const balance = transactions.reduce((total, transaction) => {
            return transaction.type === 'INCOME' 
                ? total + transaction.amount 
                : total - transaction.amount;
        }, 0);
        setTotalBalance(balance);
    };

    return (
        <div className="individual-dashboard">
            <header>
                <h1>Student Dashboard</h1>
                <div className="user-info">
                    <span>Welcome, {user?.userName || 'Student'}</span>
                    <button onClick={logout} className="logout-btn">Logout</button>
                </div>
            </header>

            <div className="dashboard-content">
                <div className="balance-summary">
                    <h2>Account Balance</h2>
                    <p className="total-balance">
                        ${totalBalance.toFixed(2)}
                    </p>
                </div>

                <div className="recent-transactions">
                    <h2>Recent Transactions</h2>
                    {loading ? (
                        <p>Loading transactions...</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Amount</th>
                                    <th>Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(transaction => (
                                    <tr key={transaction.id}>
                                        <td>{new Date(transaction.date).toLocaleDateString()}</td>
                                        <td>{transaction.description}</td>
                                        <td>${transaction.amount.toFixed(2)}</td>
                                        <td>{transaction.type}</td>
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

export default IndividualDashboard;