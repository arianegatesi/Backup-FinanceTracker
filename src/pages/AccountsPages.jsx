import React, { useState, useEffect } from 'react';
import { Plus, Edit } from 'lucide-react';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext'; // Import the AuthContext

const AccountsPage = () => {
  const { user } = useAuth(); // Get the user from AuthContext
  const [currentPage, setCurrentPage] = useState(1);
  const accountsPerPage = 2; // Number of accounts per page
  const [accounts, setAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAccount, setCurrentAccount] = useState({
    balance: '',
  });

  useEffect(() => {
    const fetchAccounts = async () => {
      const response = await fetch(`http://localhost:8080/account/getAccountsByUser/${user.userId}`); // Fetch accounts by user ID
      if (response.ok) {
        const data = await response.json();
        setAccounts(data); // Set the fetched accounts
      } else {
        console.error('Failed to fetch accounts');
      }
    };

    if (user) {
      fetchAccounts(); // Fetch accounts only if user is available
    }
  }, [user]);

  // Calculate total pages
  const totalPages = Math.ceil(accounts.length / accountsPerPage);

  // Get accounts for the current page
  const paginatedAccounts = accounts.slice(
    (currentPage - 1) * accountsPerPage,
    currentPage * accountsPerPage
  );

  const columns = [
    { key: 'accountId', label: 'Account ID' },
    {
      key: 'balance',
      label: 'Balance',
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      key: 'edit',
      label: 'Actions',
      render: (value, row) => (
        <button
          onClick={() => handleEditAccount(row)}
          className="text-indigo-600 hover:text-indigo-900"
        >
          Edit
        </button>
      ),
    },
  ];

  const handleAddAccount = () => {
    setIsEditing(false);
    setCurrentAccount({ balance: '' });
    setIsModalOpen(true);
  };

  const handleEditAccount = (account) => {
    setIsEditing(true);
    setCurrentAccount(account);
    setIsModalOpen(true);
  };

  const handleSaveAccount = async () => {
    const accountToSave = {
      ...currentAccount,
      user: { id: user.userId }, // Include user ID when saving
    };

    const response = isEditing
      ? await fetch(`http://localhost:8080/account/updateAccount/${currentAccount.accountId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(accountToSave),
        })
      : await fetch('/account/saveAccount', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(accountToSave),
        });

    if (response.ok) {
      const savedAccount = await response.json();
      if (isEditing) {
        setAccounts((prev) => prev.map((account) =>
            account.accountId === savedAccount.accountId ? savedAccount : account
          )
        );
      } else {
        setAccounts((prev) => [...prev, savedAccount]);
      }
      setCurrentAccount({ balance: '' });
      setIsModalOpen(false);
    } else {
      console.error('Failed to save account');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Accounts</h1>
        <button
          onClick={handleAddAccount}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Account
        </ button>
      </div>

      <Table
        columns={columns}
        data={paginatedAccounts} // Pass paginated accounts
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAccount}
        title={isEditing ? "Edit Account" : "Add Account"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Balance</label>
            <input
              type="number"
              className="mt-1 p-2 border rounded-md w-full"
              value={currentAccount.balance}
              onChange={(e) =>
                setCurrentAccount((prev) => ({ ...prev, balance: e.target.value }))
              }
              placeholder="Enter account balance"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AccountsPage;