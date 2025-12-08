// components/admin/AddUserModal.tsx
import React, { useState, useEffect } from 'react';
import { UserPlus, Loader2, CheckCircle, XCircle, Edit } from 'lucide-react';
import { IUser } from '@/components/types';

interface AddUserModalProps {
  onClose: () => void;
  onUserAdded: () => void;
  editingUser?: IUser | null;
}

export default function AddUserModal({ onClose, onUserAdded, editingUser }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'user' as 'user' | 'admin'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Initialize form with user data when editing
  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name || '',
        email: editingUser.email || '',
        password: '', // Password is empty for editing (optional to change)
        userType: editingUser.userType === 'admin' ? 'admin' : 'user'
      });
    } else {
      // Reset form for adding new user
      setFormData({
        name: '',
        email: '',
        password: '',
        userType: 'user'
      });
    }
    setError(null);
    setSuccess(false);
  }, [editingUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const validateForm = () => {
    // Basic validation
    if (!formData.name.trim()) {
      return 'Name is required';
    }
    if (!formData.email.trim()) {
      return 'Email is required';
    }
    if (!formData.email.includes('@')) {
      return 'Please enter a valid email address';
    }
    
    // Password validation differs for add vs edit
    if (!editingUser && !formData.password) {
      return 'Password is required';
    }
    if (!editingUser && formData.password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    // For edit, if password is provided, it must be at least 6 chars
    if (editingUser && formData.password && formData.password.length < 6) {
      return 'Password must be at least 6 characters if changing';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const url = editingUser 
        ? 'http://localhost:5000/api/users/edit' 
        : 'http://localhost:5000/api/users/create';
      
      const method = editingUser ? 'PUT' : 'POST';

      // Prepare typed request body
      const requestBody: {
        name: string;
        email: string;
        userType: 'user' | 'admin';
        id?: string;
        password?: string;
      } = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        userType: formData.userType
      };

      // Add ID for edit mode
      if (editingUser) {
        requestBody.id = editingUser._id;
      }

      // Add password only if provided (or for new user)
      if (formData.password || !editingUser) {
        requestBody.password = formData.password;
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Failed to ${editingUser ? 'update' : 'create'} user`);
      }

      // Success
      setSuccess(true);
      
      // Reset form if creating new user
      if (!editingUser) {
        setFormData({
          name: '',
          email: '',
          password: '',
          userType: 'user'
        });
      }

      // Refresh user list after a delay
      setTimeout(() => {
        onUserAdded();
        onClose();
      }, 1500);

    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else if (typeof error === 'string') {
        setError(error);
      } else {
        setError(`An unexpected error occurred while ${editingUser ? 'updating' : 'creating'} the user`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        name: '',
        email: '',
        password: '',
        userType: 'user'
      });
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  return (
    <div className="space-y-4 text-black">
      {success ? (
        <div className="py-6 text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-green-600">
            {editingUser ? 'User Updated Successfully!' : 'User Created Successfully!'}
          </h3>
          <p className="text-gray-600">
            {editingUser 
              ? 'The user has been updated in the system.' 
              : 'The new user has been added to the system.'
            }
          </p>
        </div>
      ) : (
        <>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {editingUser 
                ? 'Update user information and permissions.'
                : 'Create a new user account with specific role and permissions.'
              }
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="w-4 h-4" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                disabled={isLoading}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                disabled={isLoading}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* User Type Field */}
            <div className="space-y-2">
              <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
                User Role <span className="text-red-500">*</span>
              </label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <p className="text-xs text-gray-500">
                {editingUser 
                  ? 'Select the user role for this account.'
                  : 'Admin users have full access to all features including user management.'
                }
              </p>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password {!editingUser && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={
                  editingUser 
                    ? "Enter new password (leave blank to keep current)" 
                    : "Enter password (min. 6 characters)"
                }
                disabled={isLoading}
                required={!editingUser}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-500">
                {editingUser 
                  ? 'Leave blank to keep current password. If provided, must be at least 6 characters.'
                  : 'Password must be at least 6 characters long.'
                }
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-[#3C3D37] border border-transparent rounded-md hover:bg-[#55564F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3C3D37] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {editingUser ? 'Updating User...' : 'Creating User...'}
                  </>
                ) : (
                  <>
                    {editingUser ? (
                      <>
                        <Edit className="w-4 h-4" />
                        Update User
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Create User
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}