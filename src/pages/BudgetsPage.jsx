import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Table from '../components/Table';
import SearchFilter from '../components/SearchFilter';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import GlobalSearch from '../components/GlobalSearch';
import AddBudgetForm from './AddBudgetForm';



const BudgetsPage = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    category: '',
    limitAmount: ''
  });
  const budgetsPerPage = 2;

  const fetchBudgets = async () => {
    try {
      const response = await fetch(`http://localhost:8080/budget/getBudgetsByUser/${user.userId}`);
      if (response.ok) {
        const data = await response.json();
        setBudgets(data);
        toast.success('Budgets loaded successfully');
      }
    } catch (error) {
      toast.error('Error loading budgets');
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

  useEffect(() => {
    if (user?.userId) {
      fetchBudgets();
      fetchCategories();
    }
  }, [user]);

  const handleSaveBudget = async (budgetData) => {
    try {
      const url = currentBudget
        ? `http://localhost:8080/budget/updateBudget/${currentBudget.budgetId}`
        : 'http://localhost:8080/budget/saveBudget';
      
      const response = await fetch(url, {
        method: currentBudget ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...budgetData,
          user: { userId: user.userId }
        }),
      });

      if (response.ok) {
        fetchBudgets();
        setIsModalOpen(false);
        toast.success(`Budget ${currentBudget ? 'updated' : 'created'} successfully`);
      }
    } catch (error) {
      toast.error('Error saving budget');
    }
  };

  const handleDeleteBudget = async (budgetId) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        const response = await fetch(`http://localhost:8080/budget/deleteBudget/${budgetId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          fetchBudgets();
          toast.success('Budget deleted successfully');
        }
      } catch (error) {
        toast.error('Error deleting budget');
      }
    }
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
    }
  ];

  const filteredBudgets = budgets.filter(budget => {
    const matchesCategory = !activeFilters.category || 
      budget.category?.categoryId === activeFilters.category;
    const matchesSearch = !searchTerm || 
      budget.category?.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const columns = [
    { 
      key: 'category',
      label: 'Category',
      render: (_, row) => row.category?.name
    },
    {
      key: 'limitAmount',
      label: 'Budget Limit',
      render: (value) => `$${value.toFixed(2)}`
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setCurrentBudget(row);
              setIsModalOpen(true);
            }}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteBudget(row.budgetId)}
            className="text-red-600 hover:text-red-900"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Budgets</h1>
        <button
          onClick={() => {
            setCurrentBudget(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Budget
        </button>
      </div>

      <SearchFilter 
        onSearch={setSearchTerm}
        filters={filters}
      />

      <Table
        columns={columns}
        data={filteredBudgets.slice(
          (currentPage - 1) * budgetsPerPage,
          currentPage * budgetsPerPage
        )}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredBudgets.length / budgetsPerPage)}
        onPageChange={setCurrentPage}
      />

      <AddBudgetForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentBudget(null);
        }}
        onSave={handleSaveBudget}
        categories={categories}
        currentBudget={currentBudget}
      />
    </div>
  );
};


export default BudgetsPage;
