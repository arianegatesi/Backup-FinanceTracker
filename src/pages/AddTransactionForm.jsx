import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';

const AddTransactionForm = ({ isOpen, onClose, onSave, categories, transaction }) => {
  const [formData, setFormData] = useState({
    description: '',
    categoryId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
     transactionType: 'EXPENSE'
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description || '',
        categoryId: transaction.category?.categoryId || '',
        amount: transaction.amount || '',
        date: new Date(transaction.date).toISOString().split('T')[0],
        transactionId: transaction.transactionId
      });
    } else {
      setFormData({
        description: '',
        categoryId: '',
        amount: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
  }, [transaction]);

  const handleSubmit = () => {
    const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        category: { categoryId: formData.categoryId },
        date: new Date(formData.date).toISOString()
    };
    onSave(transactionData);
};


  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      onSave={handleSubmit}
      title={transaction ? 'Edit Transaction' : 'Add Transaction'}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            className="mt-1 p-2 border rounded-md w-full"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          />
        </div>

        

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            className="mt-1 p-2 border rounded-md w-full"
            value={formData.categoryId}
            onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded-md w-full"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            step="0.01"
            className="mt-1 p-2 border rounded-md w-full"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
          />
        </div>
        <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                    className="mt-1 p-2 border rounded-md w-full"
                    value={formData.transactionType}
                    onChange={(e) => setFormData(prev => ({ ...prev, transactionType: e.target.value }))}
                >
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                </select>
            </div>
      </div>
    </Modal>
  );
};

export default AddTransactionForm;
