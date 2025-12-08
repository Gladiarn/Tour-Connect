// components/admin/DestinationsTable.tsx
import React, { useState, useRef, useEffect } from 'react';
import { destinationsDisplayTypes } from '../types';
import { Trash2, Edit, X, Check, Loader2 } from 'lucide-react';
import AddDestinationModal from '@/components/Modal/AddDestinationModal'; // Adjust path as needed
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'; // Using the same Dialog component as hotels

interface DestinationsTableProps {
  data: destinationsDisplayTypes[];
  onDestinationDeleted?: () => void;
  onDestinationUpdated?: () => void; // Add this prop for updating
}

export default function DestinationsTable({ data, onDestinationDeleted, onDestinationUpdated }: DestinationsTableProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deletePosition, setDeletePosition] = useState<{x: number, y: number} | null>(null);
  const deleteButtonRefs = useRef<Record<string, HTMLButtonElement>>({});
  
  // Add these states for edit functionality
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingDestination, setEditingDestination] = useState<destinationsDisplayTypes | null>(null);

  const handleDeleteClick = (destinationId: string, event: React.MouseEvent) => {
    const button = event.currentTarget as HTMLButtonElement;
    const rect = button.getBoundingClientRect();

    const modalWidth = 280;
    const viewportWidth = window.innerWidth;
    
    let modalX = rect.right + 10;
    let modalY = rect.top;
    
    if (modalX + modalWidth > viewportWidth) {
      modalX = rect.left - modalWidth - 10;
    }
    
    if (modalY < 100) {
      modalY = 100;
    }
    
    setDeletePosition({ x: modalX, y: modalY });
    setConfirmDelete(destinationId);
  };

  // Add edit click handler
  const handleEditClick = (destination: destinationsDisplayTypes) => {
    setEditingDestination(destination);
    setShowEditDialog(true);
  };

  const handleConfirmDelete = async (destinationId: string) => {
    setIsDeleting(destinationId);
    
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:5000/api/destination/${destinationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete destination');
      }

      if (result.success) {
        if (onDestinationDeleted) {
          onDestinationDeleted();
        }
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error deleting destination:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to delete destination'}`);
    } finally {
      setIsDeleting(null);
      setConfirmDelete(null);
      setDeletePosition(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null);
    setDeletePosition(null);
  };

  // Add close edit dialog handler
  const handleCloseEditDialog = () => {
    setShowEditDialog(false);
    setEditingDestination(null);
  };

  // Add destination updated handler
  const handleDestinationUpdated = () => {
    if (onDestinationUpdated) {
      onDestinationUpdated();
    }
    setShowEditDialog(false);
    setEditingDestination(null);
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
                Destination
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white bg-[#3C3D37] uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white bg-[#3C3D37] uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white bg-[#3C3D37] uppercase tracking-wider">
                Budget & Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white bg-[#3C3D37] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((destination, index) => (
              <tr key={destination._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{destination.name}</div>
                  <div className="text-xs text-gray-500">
                    Ref: {destination.reference}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {destination.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm">{destination.activityType}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">${destination.budget}</div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="text-yellow-500 mr-1">★</span>
                    {destination.rating}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {/* Edit Button */}
                  <button 
                    onClick={() => handleEditClick(destination)}
                    className="text-blue-600 hover:text-blue-900 mr-3 flex items-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  {/* Delete Button */}
                  <button
                    ref={el => {
                      if (el && destination._id) {
                        const idString = String(destination._id);
                        deleteButtonRefs.current[idString] = el;
                      }
                    }}
                    onClick={(e) => {
                      if (destination._id) {
                        handleDeleteClick(String(destination._id), e);
                      }
                    }}
                    disabled={isDeleting === String(destination._id)}
                    className="text-red-600 hover:text-red-900 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting === String(destination._id) ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
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

      {/* Edit Destination Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingDestination ? "Edit Destination" : "Add New Destination"}
            </DialogTitle>
            <DialogDescription>
              {editingDestination 
                ? `Edit the details for ${editingDestination.name}.` 
                : "Fill in the details to add a new destination."}
            </DialogDescription>
          </DialogHeader>
          <AddDestinationModal
            onClose={handleCloseEditDialog}
            onDestinationAdded={handleDestinationUpdated}
            editingDestination={editingDestination}
          />
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      {confirmDelete && deletePosition && (
        <div 
          className="fixed inset-0 z-50"
          style={{ pointerEvents: 'none' }}
        >
          <div 
            className="absolute z-50 confirmation-modal bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-64"
            style={{
              left: `${deletePosition.x}px`,
              top: `${deletePosition.y}px`,
              pointerEvents: 'auto',
              transform: 'translateY(-50%)',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              animation: 'fadeIn 0.2s ease-out'
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
                Are you sure you want to delete this destination? This action cannot be undone.
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