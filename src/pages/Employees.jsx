import React, { useState } from 'react';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

const EmployeesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 5;

  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'John Doe',
      position: 'Manager',
      email: 'john@example.com',
      transactions: 15,
      totalAmount: 4500.0,
    },
    {
      id: 2,
      name: 'Jane Smith',
      position: 'Accountant',
      email: 'jane@example.com',
      transactions: 20,
      totalAmount: 5200.0,
    },
    {
      id: 3,
      name: 'Mike Johnson',
      position: 'Clerk',
      email: 'mike@example.com',
      transactions: 10,
      totalAmount: 3200.0,
    },
    {
      id: 4,
      name: 'Alice Brown',
      position: 'Supervisor',
      email: 'alice@example.com',
      transactions: 18,
      totalAmount: 4800.0,
    },
    {
      id: 5,
      name: 'Bob White',
      position: 'Assistant',
      email: 'bob@example.com',
      transactions: 12,
      totalAmount: 3600.0,
    },
    {
      id: 6,
      name: 'Sara Black',
      position: 'Director',
      email: 'sara@example.com',
      transactions: 22,
      totalAmount: 6500.0,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    position: '',
    email: '',
    transactions: '',
    totalAmount: '',
  });

  // Calculate total pages
  const totalPages = Math.ceil(employees.length / employeesPerPage);

  // Get employees for the current page
  const paginatedEmployees = employees.slice(
    (currentPage - 1) * employeesPerPage,
    currentPage * employeesPerPage
  );

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'position', label: 'Position' },
    { key: 'email', label: 'Email' },
    { key: 'transactions', label: 'Transactions' },
    {
      key: 'totalAmount',
      label: 'Total Amount ($)',
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <button
          className="text-indigo-600 hover:text-indigo-900"
          onClick={() => handleEditEmployee(row)}
        >
          Edit
        </button>
      ),
    },
  ];

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setNewEmployee({ name: '', position: '', email: '', transactions: '', totalAmount: '' });
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setNewEmployee({
      name: employee.name,
      position: employee.position,
      email: employee.email,
      transactions: employee.transactions.toString(),
      totalAmount: employee.totalAmount.toString(),
    });
    setIsModalOpen(true);
  };

  const handleSaveEmployee = () => {
    if (editingEmployee) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === editingEmployee.id
            ? {
                ...emp,
                ...newEmployee,
                transactions: parseInt(newEmployee.transactions, 10),
                totalAmount: parseFloat(newEmployee.totalAmount),
              }
            : emp
        )
      );
    } else {
      setEmployees((prev) => [
        ...prev,
        {
          id: employees.length + 1,
          ...newEmployee,
          transactions: parseInt(newEmployee.transactions, 10),
          totalAmount: parseFloat(newEmployee.totalAmount),
        },
      ]);
    }
    setNewEmployee({ name: '', position: '', email: '', transactions: '', totalAmount: '' });
    setEditingEmployee(null);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employees</h1>
        <button
          onClick={handleAddEmployee}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Employee
        </button>
      </div>

      <Table
        columns={columns}
        data={paginatedEmployees}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEmployee}
        title={editingEmployee ? "Edit Employee" : "Add Employee"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="mt-1 p-2 border rounded-md w-full"
              value={newEmployee.name}
              onChange={(e) =>
                setNewEmployee((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Position</label>
            <input
              type="text"
              className="mt-1 p-2 border rounded-md w-full"
              value={newEmployee.position}
              onChange={(e) =>
                setNewEmployee((prev) => ({ ...prev, position: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 p-2 border rounded-md w-full"
              value={newEmployee.email}
              onChange={(e) =>
                setNewEmployee((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Transactions</label>
            <input
              type="number"
              className="mt-1 p-2 border rounded-md w-full"
              value={newEmployee.transactions}
              onChange={(e) =>
                setNewEmployee((prev) => ({ ...prev, transactions: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Amount</label>
            <input
              type="number"
              className="mt-1 p-2 border rounded-md w-full"
              value={newEmployee.totalAmount}
              onChange={(e) =>
                setNewEmployee((prev) => ({ ...prev, totalAmount: e.target.value }))
              }
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EmployeesPage;
