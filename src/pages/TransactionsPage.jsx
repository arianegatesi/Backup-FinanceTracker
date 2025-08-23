import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Table from '../components/Table';
import SearchFilter from '../components/SearchFilter';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import GlobalSearch from '../components/GlobalSearch';
import AddTransactionForm from './AddTransactionForm';

const TransactionsPage = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const transactionsPerPage = 2;
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    category: '',
    date: '',
    amount: ''
  });

  const handleSearch = (searchResults) => {
    if (Array.isArray(searchResults)) {
      setTransactions(searchResults);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`http://localhost:8080/category/getCategoriesByUser/${user.userId}`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      toast.error('Error loading categories');
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`http://localhost:8080/transaction/getTransactionsByUser/${user.userId}`);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
        toast.success('Transactions loaded successfully');
      } else {
        toast.error('Failed to fetch transactions');
      }
    } catch (error) {
      toast.error('Error loading transactions');
    }
  };

  useEffect(() => {
    if (user?.userId) {
      fetchTransactions();
      fetchCategories();
    }
  }, [user]);

  const handleAddTransaction = () => {
    setIsEditMode(false);
    setCurrentTransaction(null);
    setIsModalOpen(true);
  };

  const handleSaveTransaction = async (transactionData) => {
    try {
        const endpoint = isEditMode
            ? `http://localhost:8080/transaction/updateTransaction/${currentTransaction.transactionId}`
            : 'http://localhost:8080/transaction/saveTransaction';
            
        const method = isEditMode ? 'PUT' : 'POST';
        
        const response = await fetch(endpoint, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...transactionData,
                user: { userId: user.userId }
            }),
        });

        if (response.ok) {
            await fetchTransactions();
            toast.success(isEditMode ? 'Transaction updated successfully' : 'Transaction created successfully');
            setIsModalOpen(false);
        } else {
            throw new Error('Failed to save transaction');
        }
    } catch (error) {
        toast.error('Error saving transaction');
    }
};


  const handleDeleteTransaction = async (transactionId) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        const response = await fetch(`http://localhost:8080/transaction/deleteTransaction/${transactionId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setTransactions(prev => prev.filter(transaction => transaction.transactionId !== transactionId));
          toast.success('Transaction deleted successfully');
        } else {
          toast.error('Failed to delete transaction');
        }
      } catch (error) {
        toast.error('Error deleting transaction');
      }
    }
  };

  const columns = [
    { key: 'date', label: 'Date' },
     { 
      key: 'category', 
      label: 'Category',
      render: (_, row) => row.category?.name || 'Uncategorized'
    },
    { key: 'description', label: 'Description' },
   
    {
      key: 'amount',
      label: 'Amount',
      render: (value, row) => {
          const amount = Math.abs(parseFloat(value));
          const isExpense = row.transactionType === 'EXPENSE';
          return (
              <span className={isExpense ? 'text-red-600' : 'text-green-600'}>
                  {isExpense ? '-' : '+'}${amount.toFixed(2)}
              </span>
          );
      }
  },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setIsEditMode(true);
              setCurrentTransaction(row);
              setIsModalOpen(true);
            }}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteTransaction(row.transactionId)}
            className="text-red-600 hover:text-red-900"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const getUniqueValues = (key) => {
    return [...new Set(transactions.map(t => 
      key === 'category' ? (t.category?.name || 'Uncategorized') : t[key]
    ))];
  };

  const filters = [
    {
      key: 'category',
      placeholder: 'Filter by Category',
      options: categories.map(cat => ({
        value: cat.categoryId,
        label: cat.name
      })),
      onChange: (value) => setActiveFilters(prev => ({ ...prev, category: value }))
    },
    {
      key: 'date',
      placeholder: 'Filter by Date',
      options: getUniqueValues('date').map(date => ({
        value: date,
        label: new Date(date).toLocaleDateString()
      })),
      onChange: (value) => setActiveFilters(prev => ({ ...prev, date: value }))
    }
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesCategory = !activeFilters.category || 
      transaction.category?.categoryId === activeFilters.category;
    const matchesDate = !activeFilters.date || 
      transaction.date === activeFilters.date;

    return matchesCategory && matchesDate;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <button
          onClick={handleAddTransaction}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Transaction
        </button>
      </div>

      <GlobalSearch onSearch={handleSearch} />
      
      <SearchFilter 
        onSearch={setSearchTerm}
        filters={filters}
      />

      <Table
        columns={columns}
        data={filteredTransactions.slice(
          (currentPage - 1) * transactionsPerPage,
          currentPage * transactionsPerPage
        )}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredTransactions.length / transactionsPerPage)}
        onPageChange={setCurrentPage}
      />

      <AddTransactionForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentTransaction(null);
        }}
        onSave={handleSaveTransaction}
        categories={categories}
        transaction={currentTransaction}
      />
    </div>
  );
};

export default TransactionsPage;
