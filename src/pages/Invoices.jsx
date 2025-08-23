import React, { useState } from 'react';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

const InvoicesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 5;

  const [invoices, setInvoices] = useState([
    { id: 1, number: 'INV-001', client: 'ABC Corp', amount: 1200.5, status: 'Paid' },
    { id: 2, number: 'INV-002', client: 'XYZ Ltd', amount: 950.75, status: 'Pending' },
    { id: 3, number: 'INV-003', client: '123 Co', amount: 1340.25, status: 'Overdue' },
    { id: 4, number: 'INV-004', client: 'Global Inc', amount: 870.0, status: 'Paid' },
    { id: 5, number: 'INV-005', client: 'Delta LLC', amount: 725.5, status: 'Pending' },
    { id: 6, number: 'INV-006', client: 'Tech Solutions', amount: 500.0, status: 'Overdue' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);

  const [newInvoice, setNewInvoice] = useState({
    number: '',
    client: '',
    amount: '',
    status: 'Pending',
  });

  // Calculate total pages
  const totalPages = Math.ceil(invoices.length / invoicesPerPage);

  // Get invoices for the current page
  const paginatedInvoices = invoices.slice(
    (currentPage - 1) * invoicesPerPage,
    currentPage * invoicesPerPage
  );

  const columns = [
    { key: 'number', label: 'Invoice Number' },
    { key: 'client', label: 'Client' },
    { key: 'amount', label: 'Amount ($)', render: (value) => `$${value.toFixed(2)}` },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-sm ${value === 'Paid' ? 'bg-green-200 text-green-800' : value === 'Pending' ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-800'}`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'edit',
      label: 'Actions',
      render: (_, row) => (
        <button
          onClick={() => handleEditInvoice(row)}
          className="text-blue-500 hover:text-blue-700"
        >
          Edit
        </button>
      ),
    },
  ];

  const handleAddInvoice = () => {
    setIsEditMode(false);
    setIsModalOpen(true);
    setNewInvoice({
      number: '',
      client: '',
      amount: '',
      status: 'Pending',
    });
  };

  const handleEditInvoice = (invoice) => {
    setIsEditMode(true);
    setCurrentInvoice(invoice);
    setNewInvoice({
      number: invoice.number,
      client: invoice.client,
      amount: invoice.amount,
      status: invoice.status,
    });
    setIsModalOpen(true);
  };

  const handleSaveInvoice = () => {
    if (isEditMode) {
      setInvoices((prev) =>
        prev.map((invoice) =>
          invoice.id === currentInvoice.id
            ? { ...invoice, ...newInvoice, amount: parseFloat(newInvoice.amount) }
            : invoice
        )
      );
    } else {
      setInvoices((prev) => [
        ...prev,
        {
          id: invoices.length + 1,
          ...newInvoice,
          amount: parseFloat(newInvoice.amount),
        },
      ]);
    }
    setNewInvoice({ number: '', client: '', amount: '', status: 'Pending' });
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <button
          onClick={handleAddInvoice}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Invoice
        </button>
      </div>

      <Table
        columns={columns}
        data={paginatedInvoices}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveInvoice}
        title={isEditMode ? 'Edit Invoice' : 'Add Invoice'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
            <input
              type="text"
              className="mt-1 p-2 border rounded-md w-full"
              value={newInvoice.number}
              onChange={(e) => setNewInvoice({ ...newInvoice, number: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Client</label>
            <input
              type="text"
              className="mt-1 p-2 border rounded-md w-full"
              value={newInvoice.client}
              onChange={(e) => setNewInvoice({ ...newInvoice, client: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              className="mt-1 p-2 border rounded-md w-full"
              value={newInvoice.amount}
              onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              className="mt-1 p-2 border rounded-md w-full"
              value={newInvoice.status}
              onChange={(e) => setNewInvoice({ ...newInvoice, status: e.target.value })}
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InvoicesPage;
