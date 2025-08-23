import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import Table from "../components/Table";
import Modal from "../components/Modal";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [newUser, setNewUser] = useState({
    userName: "",
    userEmail: "",
    role: "User",
  });

  const usersPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/user/getAllUsers");
      if (response.ok) {
        const userData = await response.json();
        setUsers(userData);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    const deleteToast = toast.loading("Processing...");
  
    try {
      const response = await fetch(`/user/deleteUser/${userId}`, { method: "DELETE" });
      if (response.ok) {
        toast.update(deleteToast, { render: "User deleted successfully", type: "success", isLoading: false, autoClose: 3000 });
        fetchUsers(); // Refresh user list
      } else {
        toast.update(deleteToast, { render: "Failed to delete user", type: "error", isLoading: false, autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.update(deleteToast, { render: "An error occurred", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const handleAddUser = () => {
    setIsEditMode(false);
    setNewUser({
      userName: "",
      userEmail: "",
      role: "User",
    });
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setIsEditMode(true);
    setCurrentUser(user);
    setNewUser({
      userName: user.userName,
      userEmail: user.userEmail,
      role: user.role,
    });
    setIsModalOpen(true);
  };

  const handleSaveUser = async () => {
    if (isEditMode) {
      try {
        const response = await fetch(`/user/updateUser/${currentUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });

        if (response.ok) {
          toast.success("User updated successfully");
          fetchUsers(); // Refresh user list
        } else {
          toast.error("Failed to update user");
        }
      } catch (error) {
        toast.error("An error occurred");
      }
    } else {
      try {
        const response = await fetch("/user/createUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });

        if (response.ok) {
          toast.success("User created successfully");
          fetchUsers(); // Refresh user list
        } else {
          toast.error("Failed to create user");
        }
      } catch (error) {
        toast.error("An error occurred");
      }
    }

    setNewUser({
      userName: "",
      userEmail: "",
      role: "User",
    });
    setIsModalOpen(false);
  };

  const totalPages = Math.ceil(users.length / usersPerPage);
  const paginatedUsers = users.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const columns = [
    { key: "userName", label: "Name" },
    { key: "userEmail", label: "Email" },
    { key: "role", label: "Role" },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div>
          <button
            onClick={() => handleEditUser(row)}
            className="text-blue-600 hover:underline mr-4"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteUser(row.id)}
            className="text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-6">
        <span className="text-gray-600">Welcome, {user?.userName || "Admin"}!</span>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
        
        </div>
      </header>

      <div className="bg-white shadow-md rounded p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">User Management</h2>
        <button
          onClick={handleAddUser}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add User
        </button>

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <Table
            columns={columns}
            data={paginatedUsers}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        title={isEditMode ? "Edit User" : "Add User"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="mt-1 p-2 border rounded-md w-full"
              value={newUser.userName}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, userName: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 p-2 border rounded-md w-full"
              value={newUser.userEmail}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, userEmail: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              className="mt-1 p-2 border rounded-md w-full"
              value={newUser.role}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, userRole: e.target.value }))
              }
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
