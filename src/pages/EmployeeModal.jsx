import React, { useState } from 'react';
import Modal from '../components/Modal';

const EmployeeModal = ({ isOpen, onClose, onSave }) => {
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    position: '',
    email: '',
    transactions: '',
    totalAmount: '',
  });

  const handleSave = () => {
    onSave(newEmployee);
    setNewEmployee({ name: '', position: '', email: '', transactions: '', totalAmount: '' });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} onSave={handleSave} title="Add Employee">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded-md w-full"
            value={newEmployee.name}
            onChange={(e) => setNewEmployee((prev) => ({ ...prev, name: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Position</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded-md w-full"
            value={newEmployee.position}
            onChange={(e) => setNewEmployee((prev) => ({ ...prev, position: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="mt-1 p-2 border rounded-md w-full"
            value={newEmployee.email}
            onChange={(e) => setNewEmployee((prev) => ({ ...prev, email: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Transactions</label>
          <input
            type="number"
            className="mt-1 p-2 border rounded-md w-full"
            value={newEmployee.transactions}
            onChange={(e) => setNewEmployee((prev) => ({ ...prev, transactions: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Total Amount</label>
          <input
            type="number"
            className="mt-1 p-2 border rounded-md w-full"
            value={newEmployee.totalAmount}
            onChange={(e) => setNewEmployee((prev) => ({ ...prev, totalAmount: e.target.value }))}
          />
        </div>
      </div>
    </Modal>
  );
};

export default EmployeeModal;
