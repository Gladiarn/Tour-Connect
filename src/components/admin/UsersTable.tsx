// components/admin/UsersTable.tsx
import React, { useState, useRef, useEffect } from "react";
import { IUser } from "../types";
import { Trash2, Edit, X, Check } from "lucide-react";

interface UsersTableProps {
  data: IUser[];
  onUserDeleted?: () => void;
}

const deleteUser = async (userId: string | undefined) => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export default function UsersTable({ data, onUserDeleted }: UsersTableProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deletePosition, setDeletePosition] = useState<{x: number, y: number} | null>(null);
  const deleteButtonRefs = useRef<Record<string, HTMLButtonElement>>({});

  const handleDeleteClick = (userId: string, event: React.MouseEvent) => {
    const button = event.currentTarget as HTMLButtonElement;
    const rect = button.getBoundingClientRect();
    
    // Store the button position for modal placement
    setDeletePosition({
      x: rect.left + rect.width + 10, // Position to the right of button
      y: rect.top
    });
    setConfirmDelete(userId);
  };

  const handleConfirmDelete = async (userId: string) => {
    setIsDeleting(userId);
    setConfirmDelete(null);
    
    try {
      const result = await deleteUser(userId);
      
      if (result.success) {
        // Call the refresh callback if provided
        if (onUserDeleted) {
          onUserDeleted();
        }
        alert('User deleted successfully!');
      } else {
        alert(`Failed to delete user: ${result.message}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An error occurred while deleting the user.');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null);
    setDeletePosition(null);
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (confirmDelete && !(event.target as Element).closest('.confirmation-modal')) {
        handleCancelDelete();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [confirmDelete]);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white bg-[#3C3D37] uppercase tracking-wider">
                No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white bg-[#3C3D37] uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white bg-[#3C3D37] uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white bg-[#3C3D37] uppercase tracking-wider">
                User Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white bg-[#3C3D37] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((user, index) => (
              <tr key={user._id} className="hover:bg-gray-50 relative">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {user.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.userType === "admin"
                        ? "bg-red-100 text-red-800"
                        : user.userType === "premium_traveler"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.userType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3 flex items-center gap-1">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    ref={el => {
                      if (el && user._id) {
                        deleteButtonRefs.current[user._id] = el;
                      }
                    }}
                    onClick={(e) => handleDeleteClick(user._id!, e)}
                    disabled={isDeleting === user._id}
                    className="text-red-600 hover:text-red-900 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting === user._id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {confirmDelete && deletePosition && (
        <div 
          className="fixed inset-0 z-50"
          style={{ pointerEvents: 'none' }}
        >
          <div 
            className="absolute z-50 confirmation-modal bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-64"
            style={{
              left: `${deletePosition.x}px`,
              top: `${deletePosition.y}px`,
              pointerEvents: 'auto',
              transform: 'translateY(-50%)'
            }}
          >
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900">Confirm Delete</h3>
                <button
                  onClick={handleCancelDelete}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-sm text-gray-600">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={handleCancelDelete}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleConfirmDelete(confirmDelete)}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors flex items-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}