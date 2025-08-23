import React, { useState } from 'react';
import Modal from '../components/Modal';

const InvoiceModal = ({ isOpen, onClose, onSave }) => {
  const [newInvoice, setNewInvoice] = useState({
    number: '',
    client: '',
    amount: '',
    status: 'Pending',
  });

  const handleSave = () => {
    onSave(newInvoice);
    setNewInvoice({ number: '', client: '', amount: '', status: 'Pending' });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} onSave={handleSave} title="Add Invoice">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded-md w-full"
            value={newInvoice.number}
            onChange={(e) => setNewInvoice((prev) => ({ ...prev, number: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Client</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded-md w-full"
            value={newInvoice.client}
            onChange={(e) => setNewInvoice((prev) => ({ ...prev, client: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            className="mt-1 p-2 border rounded-md w-full"
            value={newInvoice.amount}
            onChange={(e) => setNewInvoice((prev) => ({ ...prev, amount: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            className="mt-1 p-2 border rounded-md w-full"
            value={newInvoice.status}
            onChange={(e) => setNewInvoice((prev) => ({ ...prev, status: e.target.value }))}
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>
    </Modal>
  );
};

export default InvoiceModal;

