import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal'; // Assuming you have a modal component
import { useAuth } from '../context/AuthContext'; // Adjust the import path if needed
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const CategoryModal = ({ isOpen, onClose, onSave, currentCategory }) => {
  const { user } = useAuth();
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    color: '#000000',
  });

  useEffect(() => {
    if (currentCategory) {
      setNewCategory({
        name: currentCategory.name || '',
        description: currentCategory.description || '',
        color: currentCategory.color || '#000000',
      });
    }
  }, [currentCategory]);

  const handleSave = async () => {
    try {
        const endpoint = currentCategory?.categoryId 
            ? `http://localhost:8080/category/updateCategory/${currentCategory.categoryId}`
            : 'http://localhost:8080/category/saveCategory';
            
        const method = currentCategory?.categoryId ? 'PUT' : 'POST';
        
        const categoryData = {
            categoryId: currentCategory?.categoryId,
            name: newCategory.name,  // Changed from categoryName to name
            description: newCategory.description,
            color: newCategory.color,
            user: { userId: user.userId }
        };

        const response = await fetch(endpoint, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(categoryData),
        });

        if (response.ok) {
            const data = await response.json();
            toast.success(currentCategory?.categoryId ? 'Category updated successfully' : 'Category saved successfully');
            onSave(data);
            onClose();
        } else {
            throw new Error('Failed to save category');
        }
    } catch (error) {
        console.error('Error saving category:', error);
        toast.error('Failed to save category');
    }
};





  return (
    <Modal isOpen={isOpen} onClose={onClose} onSave={handleSave} title={currentCategory ? 'Edit Category' : 'Add Category'}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded-md w-full"
            value={newCategory.name}
            onChange={(e) => setNewCategory((prev) => ({ ...prev, name: e.target.value }))} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            className="mt-1 p-2 border rounded-md w-full"
            value={newCategory.description}
            onChange={(e) =>
              setNewCategory((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Color</label>
          <input
            type="color"
            className="mt-1 w-16 h-10 border rounded-md"
            value={newCategory.color}
            onChange={(e) => setNewCategory((prev) => ({ ...prev, color: e.target.value }))}
          />
        </div>
      </div>
    </Modal>
  );
};

export default CategoryModal;
