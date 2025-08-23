import React, { useState } from 'react';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext'; // Import the AuthContext

const AddAccountForm = ({ isOpen, onClose, onSave }) => {
  const { user } = useAuth(); // Get the user from AuthContext
  const [account, setAccount] = useState({
    balance: '',
  });

  const handleSave = async () => {
    const accountToSave = {
      ...account,
      user: { id: user.userId }, // Include user ID when saving
    };

    const response = await fetch('http://localhost:8080/account/saveAccount', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(accountToSave),
    });

    if (response.ok) {
      const savedAccount = await response.json();
      onSave(savedAccount); // Call onSave with the saved account
      setAccount({ balance: '' }); // Reset the form
      onClose(); // Close the modal after saving
    } else {
      console.error('Failed to save account');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} onSave={handleSave} title="Add Account">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Account Balance</label>
          <input
            type="number"
            className="mt-1 p-2 border rounded-md w-full"
            value={account.balance}
            onChange={(e) => setAccount((prev) => ({ ...prev, balance: e.target.value }))}
            placeholder="Enter account balance"
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddAccountForm;