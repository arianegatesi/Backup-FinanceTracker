
import { DollarSign, ArrowUpRight, ArrowDownRight, Activity, Info, CheckCircle} from 'lucide-react';
import DashboardCard from '../components/DashboardCard';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    totalBudget: 0,
    incomeChange: 0,
    expenseChange: 0,
    budgetChange: 0
  });
  const fetchDashboardData = async () => {
    try {
      // Fetch transactions
      const transactionsResponse = await fetch(
        `http://localhost:8080/transaction/getTransactionsByUser/${user.userId}`
      );
      const transactions = await transactionsResponse.json();

      // Calculate totals
      const income = transactions
        .filter(t => t.transactionType === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = transactions
        .filter(t => t.transactionType === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);

      // Calculate month-over-month changes
      const currentMonth = new Date().getMonth();
      const currentYearTransactions = transactions.filter(
        t => new Date(t.date).getFullYear() === new Date().getFullYear()
      );

      const thisMonthIncome = currentYearTransactions
        .filter(t => new Date(t.date).getMonth() === currentMonth && t.transactionType === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0);

      const lastMonthIncome = currentYearTransactions
        .filter(t => new Date(t.date).getMonth() === currentMonth - 1 && t.transactionType === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0);

      const thisMonthExpenses = currentYearTransactions
        .filter(t => new Date(t.date).getMonth() === currentMonth && t.transactionType === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);

      const lastMonthExpenses = currentYearTransactions
        .filter(t => new Date(t.date).getMonth() === currentMonth - 1 && t.transactionType === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);

      // Calculate percentage changes
      const incomeChange = lastMonthIncome ? ((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100 : 0;
      const expenseChange = lastMonthExpenses ? ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 : 0;
      const budgetChange = ((income - expenses) / Math.abs(expenses)) * 100;

      setDashboardData({
        totalIncome: income,
        totalExpenses: expenses,
        totalBudget: income - expenses,
        incomeChange,
        expenseChange,
        budgetChange
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      fetchDashboardData();
    }
  }, [user]);
  
  const tips = [
    {
      title: "Track Your Spending",
      content: "Keeping a record of your daily expenses helps you see where your money goes and identify areas to save.",
      icon: <Activity size={20} className="text-green-500" />
    },
    {
      title: "Emergency Fund",
      content: "It's recommended to have 3-6 months of expenses saved for emergencies to avoid debt when the unexpected happens.",
      icon: <Activity size={20} className="text-green-500" />
    },
    {
      title: "Automate Savings",
      content: "Set up automatic transfers to savings or investment accounts to ensure you’re regularly saving without effort.",
      icon: <Activity size={20} className="text-green-500" />
    }
  ];

  const didYouKnow = [
    {
      fact: "The average person spends 20% less when using cash instead of cards.",
      icon: <Info size={20} className="text-blue-500" />
    },
    {
      fact: "Building a good credit score can save you thousands of dollars in interest over a lifetime.",
      icon: <Info size={20} className="text-blue-500" />
    },
    {
      fact: "Cutting out small daily expenses like coffee or takeout can result in big savings over time.",
      icon: <Info size={20} className="text-blue-500" />
    }
  ];

  const funFacts = [
    {
      fact: "The world’s first banknote was issued in China during the Tang Dynasty (618–907).",
      icon: <CheckCircle size={20} className="text-teal-500" />
    },
    {
      fact: "The first credit card was issued by Diners Club in 1950.",
      icon: <CheckCircle size={20} className="text-teal-500" />
    },
    {
      fact: "In ancient Rome, salt was used as currency, which is where the word 'salary' comes from.",
      icon: <CheckCircle size={20} className="text-teal-500" />
    }
  ];

  return (
    <div className="p-6">
      {/* Welcome User Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user.lastName}!</h1>
        <p className="text-gray-600">We’re glad to have you here. Let’s take a look at your financial insights and some tips for improving your financial health.</p>
      </div>

  {/* Financial Cards Section */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="Total Budget"
          value={`$${dashboardData.totalBudget.toFixed(2)}`}
          icon={<DollarSign size={24} />}
          trend={{ value: dashboardData.budgetChange, isPositive: dashboardData.budgetChange >= 0 }}
        />
        <DashboardCard
          title="Total Expenses"
          value={`$${dashboardData.totalExpenses.toFixed(2)}`}
          icon={<ArrowDownRight size={24} />}
          trend={{ value: dashboardData.expenseChange, isNegative: dashboardData.expenseChange <= 0 }}
        />
        <DashboardCard
          title="Total Income"
          value={`$${dashboardData.totalIncome.toFixed(2)}`}
          icon={<ArrowUpRight size={24} />}
          trend={{ value: dashboardData.incomeChange, isPositive: dashboardData.incomeChange >= 0 }}
        />
      </div>

      {/* Static Tips & Insights Section */}
      <h2 className="text-xl font-semibold mb-4">Helpful Tips & Insights</h2>
      
      {/* Financial Tips Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {tips.map((tip, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-6 flex items-start space-x-4 hover:shadow-xl transition-shadow">
            {tip.icon}
            <div>
              <h3 className="font-semibold text-lg">{tip.title}</h3>
              <p className="text-gray-600 mt-2">{tip.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Did You Know? Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Did You Know?</h3>
        <div className="space-y-4">
          {didYouKnow.map((item, index) => (
            <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
              {item.icon}
              <span className="font-medium text-gray-700">{item.fact}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fun Facts Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Fun Facts About Money</h3>
        <div className="space-y-4">
          {funFacts.map((fact, index) => (
            <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
              {fact.icon}
              <span className="font-medium text-gray-700">{fact.fact}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
