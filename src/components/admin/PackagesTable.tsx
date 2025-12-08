import React, { useState, useEffect } from "react";
import { packagesDisplayTypes } from "../types";
import { Trash2, Edit, X, Check, Loader2 } from "lucide-react";
import AddPackageModal from "@/components/Modal/AddPackageModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface PackagesTableProps {
  data: packagesDisplayTypes[];
  onPackageDeleted?: () => void;
  onPackageUpdated?: () => void;
}

export default function PackagesTable({ data, onPackageDeleted, onPackageUpdated }: PackagesTableProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deletePosition, setDeletePosition] = useState<{x: number, y: number} | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingPackage, setEditingPackage] = useState<packagesDisplayTypes | null>(null);

  const handleDeleteClick = (packageReference: string, event: React.MouseEvent) => {
    const button = event.currentTarget as HTMLButtonElement;
    const rect = button.getBoundingClientRect();
    
    const modalWidth = 260;
    const viewportWidth = window.innerWidth;
    
    let modalX = rect.right + 10;
    const modalY = rect.top;
    
    if (modalX + modalWidth > viewportWidth) {
      modalX = rect.left - modalWidth - 10;
    }
    
    setDeletePosition({ x: modalX, y: modalY });
    setConfirmDelete(packageReference);
  };

  const handleEditClick = (pkg: packagesDisplayTypes) => {
    setEditingPackage(pkg);
    setShowEditDialog(true);
  };

  const handleConfirmDelete = async (packageReference: string) => {
    setIsDeleting(packageReference);
    
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:5000/api/packages/${packageReference}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete package');
      }

      if (result.success) {
        alert('Package deleted successfully!');
        
        if (onPackageDeleted) {
          onPackageDeleted();
        }
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to delete package'}`);
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

  const handleCloseEditDialog = () => {
    setShowEditDialog(false);
    setEditingPackage(null);
  };

  const handlePackageUpdated = () => {
    if (onPackageUpdated) {
      onPackageUpdated();
    }
    setShowEditDialog(false);
    setEditingPackage(null);
  };

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
                Package
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white bg-[#3C3D37] uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white bg-[#3C3D37] uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white bg-[#3C3D37] uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white bg-[#3C3D37] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((pkg, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{pkg.name}</div>
                  <div className="text-xs text-gray-500">
                    Group: {pkg.packsize?.min || 1}-{pkg.packsize?.max || 10}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {pkg.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm">{pkg.duration}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">${pkg.price}</div>
                  <div className="text-xs text-gray-500">${pkg.pricePerHead}/pax</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => handleEditClick(pkg)}
                    className="text-blue-600 hover:text-blue-900 mr-3 flex items-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(pkg.reference, e)}
                    disabled={isDeleting === pkg.reference}
                    className="text-red-600 hover:text-red-900 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting === pkg.reference ? (
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

      {/* Edit Package Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPackage ? "Edit Package" : "Add New Package"}
            </DialogTitle>
            <DialogDescription>
              {editingPackage 
                ? `Edit the details for ${editingPackage.name}.` 
                : "Fill in the details to add a new package."}
            </DialogDescription>
          </DialogHeader>
          <AddPackageModal
            onClose={handleCloseEditDialog}
            onPackageAdded={handlePackageUpdated}
            editingPackage={editingPackage}
          />
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      {confirmDelete && deletePosition && (
        <div className="fixed inset-0 z-50" style={{ pointerEvents: 'none' }}>
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
                Are you sure you want to delete this package? This action cannot be undone.
              </p>
              
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={handleCancelDelete}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleConfirmDelete(confirmDelete)}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md flex items-center gap-1"
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