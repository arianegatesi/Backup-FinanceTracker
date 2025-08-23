import React, { useState, useEffect } from 'react';
import { Plus, Circle } from 'lucide-react';
import Table from '../components/Table';
import SearchFilter from '../components/SearchFilter';
import GlobalSearch from '../components/GlobalSearch';
import { toast } from 'react-toastify';
import CategoryModal from './CategoryModal';
import { useAuth } from '../context/AuthContext';

const CategoriesPage = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 2;
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    categoryName: '',
    description: '',
    color: '#000000',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    name: '',
    description: '',
    color: ''
  });

  const fetchCategories = async () => {
    try {
      const response = await fetch(`http://localhost:8080/category/getCategoriesByUser/${user.userId}`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        toast.success('Categories loaded successfully');
      } else {
        toast.error('Failed to fetch categories');
      }
    } catch (error) {
      toast.error('Error loading categories');
    }
  };

  useEffect(() => {
    if (user?.userId) {
      fetchCategories();
    }
  }, [user]);

  const columns = [
    {
      key: 'name',
      label: 'Category',
      render: (value, row) => (
        <div className="flex items-center">
          <div 
            className="h-6 w-6 rounded-full mr-2" 
           
          />
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    { 
      key: 'description', 
      label: 'Description',
      render: (value) => value || 'No description'
    },
    {
      key: 'color',
      label: 'Color',
      render: (value) => (
        <div className="flex items-center">
          <div 
            className="h-4 w-4 rounded-md border border-gray-200" 
            style={{ backgroundColor: value }}
          />
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditCategory(row)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteCategory(row.categoryId)}
            className="text-red-600 hover:text-red-900"
          >
            Delete
          </button>
        </div>
      ),
    },
];

  const handleAddCategory = () => {
    setIsEditing(false);
    setCurrentCategory({ name: '', description: '', color: '#000000' });
    setIsModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setIsEditing(true);
    setCurrentCategory({
        categoryId: category.categoryId,
        name: category.name,
        description: category.description,
        color: category.color
    });
    setIsModalOpen(true);
};
  // Add this function to handle category deletion
const handleDeleteCategory = async (categoryId) => {
  if (window.confirm('Are you sure you want to delete this category?')) {
      try {
          const response = await fetch(`http://localhost:8080/category/deleteCategory/${categoryId}`, {
              method: 'DELETE'
          });
          
          if (response.ok) {
              setCategories(prev => prev.filter(category => category.categoryId !== categoryId));
              toast.success('Category deleted successfully');
          } else {
              toast.error('Failed to delete category');
          }
      } catch (error) {
          toast.error('Error deleting category');
      }
  }
};
const handleSaveCategory = async (savedCategory) => {
  try {
      if (isEditing) {
          setCategories(prev =>
              prev.map(category =>
                  category.categoryId === savedCategory.categoryId 
                      ? {...savedCategory, name: savedCategory.name} 
                      : category
              )
          );
      } else {
          setCategories(prev => [...prev, {...savedCategory, name: savedCategory.name}]);
      }
      fetchCategories();
  } catch (error) {
      toast.error('Error saving category');
  }
};

  const paginatedCategories = categories.slice(
    (currentPage - 1) * categoriesPerPage,
    currentPage * categoriesPerPage
  );

  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  const handleSearch = (searchResults) => {
    if (Array.isArray(searchResults)) {
      setCategories(searchResults);
    }
  };

  const filters = [
    {
      key: 'name',
      placeholder: 'Filter by Name',
      options: [...new Set(categories.map(cat => ({
        value: cat.name,
        label: cat.name
      })))],
      onChange: (value) => setActiveFilters(prev => ({ ...prev, name: value }))
    },
    {
      key: 'color',
      placeholder: 'Filter by Color',
      options: [...new Set(categories.map(cat => ({
        value: cat.color,
        label: cat.color
      })))],
      onChange: (value) => setActiveFilters(prev => ({ ...prev, color: value }))
    }
  ];

  const filteredCategories = categories.filter(category => {
    const matchesName = !activeFilters.name || 
      category.name.toLowerCase().includes(activeFilters.name.toLowerCase());
    const matchesColor = !activeFilters.color || 
      category.color === activeFilters.color;

    return matchesName && matchesColor;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button
          onClick={handleAddCategory}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Category
        </button>
      </div>

      <div className="space-y-4">
        <GlobalSearch onSearch={handleSearch} />
        
        <SearchFilter 
          onSearch={(term) => setSearchTerm(term)}
          filters={filters}
        />

        <Table
          columns={columns}
          data={filteredCategories.slice(
            (currentPage - 1) * categoriesPerPage,
            currentPage * categoriesPerPage
          )}
          currentPage={currentPage}
          totalPages={Math.ceil(filteredCategories.length / categoriesPerPage)}
          onPageChange={setCurrentPage}
        />
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        currentCategory={isEditing ? currentCategory : null}
      />
    </div>
);
};

export default CategoriesPage;
