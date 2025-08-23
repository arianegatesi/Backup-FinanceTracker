import React, { useState, useEffect } from 'react';
import { BarChart, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReportsPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [financialSummary, setFinancialSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0
  });

  const fetchTransactionData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/transaction/getTransactionsByUser/${user.userId}`);
      const data = await response.json();
      setTransactions(data);
      
      const income = data
        .filter(t => t.transactionType === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0);
      const expenses = data
        .filter(t => t.transactionType === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);
      
      setFinancialSummary({
        totalIncome: income,
        totalExpenses: expenses,
        balance: income - expenses
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      fetchTransactionData();
    }
  }, [user]);

  const generateMonthlySummary = () => {
    const monthlyData = transactions.reduce((acc, transaction) => {
      const month = new Date(transaction.date).getMonth();
      if (!acc[month]) {
        acc[month] = { income: 0, expenses: 0 };
      }
      if (transaction.transactionType === 'INCOME') {
        acc[month].income += transaction.amount;
      } else {
        acc[month].expenses += transaction.amount;
      }
      return acc;
    }, {});
    return monthlyData;
  };

  const generateCategoryAnalysis = () => {
    return transactions.reduce((acc, transaction) => {
      const category = transaction.category?.name || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += transaction.amount;
      return acc;
    }, {});
  };

  const handleGenerateReport = async (reportId) => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString();
    
    doc.setFontSize(16);
    doc.text('Financial Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${today}`, 20, 30);
    
    if (reportId === 1) { // Monthly Summary
      const monthlyData = generateMonthlySummary();
      const tableData = Object.entries(monthlyData).map(([month, data]) => [
        new Date(2024, month).toLocaleString('default', { month: 'long' }),
        `$${data.income.toFixed(2)}`,
        `$${data.expenses.toFixed(2)}`,
        `$${(data.income - data.expenses).toFixed(2)}`
      ]);
      
      doc.autoTable({
        head: [['Month', 'Income', 'Expenses', 'Balance']],
        body: tableData,
        startY: 40
      });
    } else { // Category Analysis
      const categoryData = generateCategoryAnalysis();
      const tableData = Object.entries(categoryData).map(([category, amount]) => [
        category,
        `$${amount.toFixed(2)}`
      ]);
      
      doc.autoTable({
        head: [['Category', 'Total Amount']],
        body: tableData,
        startY: 40
      });
    }
    
    doc.save('financial-report.pdf');
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString();
    
    doc.setFontSize(16);
    doc.text('Complete Financial Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${today}`, 20, 30);
    
    // Financial Summary
    doc.text('Financial Summary:', 20, 45);
    doc.text(`Total Income: $${financialSummary.totalIncome.toFixed(2)}`, 30, 55);
    doc.text(`Total Expenses: $${financialSummary.totalExpenses.toFixed(2)}`, 30, 65);
    doc.text(`Current Balance: $${financialSummary.balance.toFixed(2)}`, 30, 75);
    
    // Recent Transactions
    const transactionData = transactions.slice(0, 10).map(t => [
      new Date(t.date).toLocaleDateString(),
      t.description,
      t.category?.name || 'Uncategorized',
      t.transactionType,
      `$${t.amount.toFixed(2)}`
    ]);
    
    doc.autoTable({
      head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
      body: transactionData,
      startY: 85
    });
    
    doc.save('complete-financial-report.pdf');
  };
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reports</h1>
        <div className="space-x-4">
          <button 
            onClick={handleDownloadPDF}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Download className="h-5 w-5 mr-2" />
            Download Complete Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[
          {
            id: 1,
            title: 'Monthly Summary',
            description: 'Detailed breakdown of income and expenses for the current month',
            icon: BarChart
          },
          {
            id: 2,
            title: 'Category Analysis',
            description: 'Spending patterns across different categories',
            icon: BarChart
          }
        ].map((report) => (
          <div
            key={report.id}
            className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
          >
            <div className="px-4 py-5 sm:px-6">
              <div className="flex items-center">
                <report.icon className="h-6 w-6 text-indigo-600 mr-3" />
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {report.title}
                </h3>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {report.description}
              </p>
            </div>
            <div className="px-4 py-4 sm:px-6">
              <button 
                onClick={() => handleGenerateReport(report.id)}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Generate Report
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

};

export default ReportsPage;