// components/admin/AddPackageModal.tsx
import React, { useState } from 'react';
import { Package, Loader2, CheckCircle, XCircle, Plus, Trash2 } from 'lucide-react';

interface AddPackageModalProps {
  onClose: () => void;
  onPackageAdded: () => void;
}

interface PackageFormData {
  name: string;
  location: string;
  inclusions: string[];
  pricePerHead: number;
  duration: string;
  description: string;
  price: number;
  images: string[];
  packsize: {
    min: number;
    max: number;
  };
  reference: string;
}

export default function AddPackageModal({ onClose, onPackageAdded }: AddPackageModalProps) {
  const [formData, setFormData] = useState<PackageFormData>({
    name: '',
    location: '',
    inclusions: [''],
    pricePerHead: 0,
    duration: '',
    description: '',
    price: 0,
    images: [''],
    packsize: {
      min: 1,
      max: 10
    },
    reference: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'packsize.min' || name === 'packsize.max') {
      const packsizeKey = name.split('.')[1] as 'min' | 'max';
      setFormData(prev => ({
        ...prev,
        packsize: {
          ...prev.packsize,
          [packsizeKey]: parseInt(value) || 0
        }
      }));
    } else if (name === 'pricePerHead' || name === 'price') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    setError(null);
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        images: newImages
      }));
    }
  };

  const handleInclusionChange = (index: number, value: string) => {
    const newInclusions = [...formData.inclusions];
    newInclusions[index] = value;
    setFormData(prev => ({
      ...prev,
      inclusions: newInclusions
    }));
  };

  const addInclusionField = () => {
    setFormData(prev => ({
      ...prev,
      inclusions: [...prev.inclusions, '']
    }));
  };

  const removeInclusionField = (index: number) => {
    if (formData.inclusions.length > 1) {
      const newInclusions = formData.inclusions.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        inclusions: newInclusions
      }));
    }
  };

  const validateForm = (): string | null => {
    // Basic validation
    if (!formData.name.trim()) {
      return 'Package name is required';
    }
    if (!formData.location.trim()) {
      return 'Location is required';
    }
    if (formData.inclusions.some(inclusion => !inclusion.trim())) {
      return 'All inclusions are required';
    }
    if (formData.pricePerHead <= 0) {
      return 'Price per head must be greater than 0';
    }
    if (!formData.duration.trim()) {
      return 'Duration is required';
    }
    if (!formData.description.trim()) {
      return 'Description is required';
    }
    if (formData.price <= 0) {
      return 'Total price must be greater than 0';
    }
    if (formData.images.some(img => !img.trim())) {
      return 'All image URLs are required';
    }
    if (formData.packsize.min < 1) {
      return 'Minimum pack size must be at least 1';
    }
    if (formData.packsize.max < formData.packsize.min) {
      return 'Maximum pack size must be greater than or equal to minimum';
    }
    if (!formData.reference.trim()) {
      return 'Package reference is required';
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

      // Prepare data for API
      const dataToSend = {
        ...formData,
        inclusions: formData.inclusions.filter(inclusion => inclusion.trim() !== ''),
        images: formData.images.filter(img => img.trim() !== '')
      };

      const response = await fetch('http://localhost:5000/api/packages/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create package');
      }

      // Success
      setSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        location: '',
        inclusions: [''],
        pricePerHead: 0,
        duration: '',
        description: '',
        price: 0,
        images: [''],
        packsize: {
          min: 1,
          max: 10
        },
        reference: ''
      });

      // Refresh package list after a delay
      setTimeout(() => {
        onPackageAdded();
        onClose();
      }, 1500);

    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else if (typeof error === 'string') {
        setError(error);
      } else {
        setError('An unexpected error occurred while creating the package');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        name: '',
        location: '',
        inclusions: [''],
        pricePerHead: 0,
        duration: '',
        description: '',
        price: 0,
        images: [''],
        packsize: {
          min: 1,
          max: 10
        },
        reference: ''
      });
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  return (
    <div className="space-y-4 text-black max-h-[80vh] overflow-y-auto pr-2">
      {success ? (
        <div className="py-6 text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-green-600">Package Created Successfully!</h3>
          <p className="text-gray-600">The new package has been added to the system.</p>
        </div>
      ) : (
        <>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Add New Package</h3>
            <p className="text-sm text-gray-500 mt-1">
              Create a new travel package with inclusions, pricing, and details.
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Package Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Package Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter package name"
                    disabled={isLoading}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Palo, Leyte"
                    disabled={isLoading}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                    Duration <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g., 5 days, 4 nights"
                    disabled={isLoading}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Reference */}
                <div className="space-y-2">
                  <label htmlFor="reference" className="block text-sm font-medium text-gray-700">
                    Package Reference <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="reference"
                    name="reference"
                    value={formData.reference}
                    onChange={handleChange}
                    placeholder="e.g., Test-001"
                    disabled={isLoading}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Price per Head */}
                <div className="space-y-2">
                  <label htmlFor="pricePerHead" className="block text-sm font-medium text-gray-700">
                    Price per Head <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="pricePerHead"
                    name="pricePerHead"
                    value={formData.pricePerHead}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    disabled={isLoading}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500">Price per person</p>
                </div>

                {/* Total Price */}
                <div className="space-y-2">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Total Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    disabled={isLoading}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500">Total package price</p>
                </div>

                {/* Pack Size - Min */}
                <div className="space-y-2">
                  <label htmlFor="packsize.min" className="block text-sm font-medium text-gray-700">
                    Minimum Group Size <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="packsize.min"
                    name="packsize.min"
                    value={formData.packsize.min}
                    onChange={handleChange}
                    min="1"
                    disabled={isLoading}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Pack Size - Max */}
                <div className="space-y-2">
                  <label htmlFor="packsize.max" className="block text-sm font-medium text-gray-700">
                    Maximum Group Size <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="packsize.max"
                    name="packsize.max"
                    value={formData.packsize.max}
                    onChange={handleChange}
                    min={formData.packsize.min}
                    disabled={isLoading}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500">Must be ≥ {formData.packsize.min}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-4 space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter package description"
                  disabled={isLoading}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              {/* Images */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Images <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={image}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        placeholder="Enter image URL"
                        disabled={isLoading}
                        required
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageField(index)}
                          disabled={isLoading}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addImageField}
                    disabled={isLoading}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="w-4 h-4" />
                    Add Another Image
                  </button>
                </div>
              </div>

              {/* Inclusions */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Inclusions <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-2">included in the package</p>
                <div className="space-y-2">
                  {formData.inclusions.map((inclusion, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={inclusion}
                        onChange={(e) => handleInclusionChange(index, e.target.value)}
                        placeholder="e.g., Accommodation, Breakfast, Airport Transfer"
                        disabled={isLoading}
                        required
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      {formData.inclusions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeInclusionField(index)}
                          disabled={isLoading}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addInclusionField}
                    disabled={isLoading}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="w-4 h-4" />
                    Add Another Inclusion
                  </button>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
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
                    Creating Package...
                  </>
                ) : (
                  <>
                    <Package className="w-4 h-4" />
                    Create Package
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