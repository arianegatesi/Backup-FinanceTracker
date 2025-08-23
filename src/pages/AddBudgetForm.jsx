import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';


const AddBudgetForm = ({ isOpen, onClose, onSave, categories, currentBudget }) => {
  const [formData, setFormData] = useState({
    category: currentBudget?.category?.categoryId || '',
    limitAmount: currentBudget?.limitAmount || '',
  });

  useEffect(() => {
    if (currentBudget) {
      setFormData({
        category: currentBudget.category?.categoryId || '',
        limitAmount: currentBudget.limitAmount || '',
      });
    }
  }, [currentBudget]);

  const handleSave = () => {
    onSave({
      ...formData,
      category: { categoryId: formData.category },
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} onSave={handleSave} title={currentBudget ? "Edit Budget" : "Create Budget"}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            className="mt-1 p-2 border rounded-md w-full"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Budget Limit</label>
          <input
            type="number"
            className="mt-1 p-2 border rounded-md w-full"
            value={formData.limitAmount}
            onChange={(e) => setFormData({ ...formData, limitAmount: parseFloat(e.target.value) })}
          />
        </div>
      </div>
    </Modal>
  );
};



export default AddBudgetForm;
