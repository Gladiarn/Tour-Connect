// components/admin/AddDestinationModal.tsx
import React, { useState } from 'react';
import { MapPin, Loader2, CheckCircle, XCircle, Plus, Trash2 } from 'lucide-react';

interface AddDestinationModalProps {
  onClose: () => void;
  onDestinationAdded: () => void;
}

interface DestinationFormData {
  name: string;
  activityType: string;
  rating: number;
  images: string[];
  description: string;
  budget: number;
  location: string;
  bestTimeToVisit: string;
  tips: string[];
  reference: string;
}

export default function AddDestinationModal({ onClose, onDestinationAdded }: AddDestinationModalProps) {
  const [formData, setFormData] = useState<DestinationFormData>({
    name: '',
    activityType: '',
    rating: 4.0,
    images: [''],
    description: '',
    budget: 0,
    location: '',
    bestTimeToVisit: '',
    tips: [''],
    reference: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' || name === 'budget' ? parseFloat(value) || 0 : value
    }));
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

  const handleTipChange = (index: number, value: string) => {
    const newTips = [...formData.tips];
    newTips[index] = value;
    setFormData(prev => ({
      ...prev,
      tips: newTips
    }));
  };

  const addTipField = () => {
    setFormData(prev => ({
      ...prev,
      tips: [...prev.tips, '']
    }));
  };

  const removeTipField = (index: number) => {
    if (formData.tips.length > 1) {
      const newTips = formData.tips.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        tips: newTips
      }));
    }
  };

  const validateForm = (): string | null => {
    // Basic validation
    if (!formData.name.trim()) {
      return 'Destination name is required';
    }
    if (!formData.activityType.trim()) {
      return 'Activity type is required';
    }
    if (formData.rating < 0 || formData.rating > 5) {
      return 'Rating must be between 0 and 5';
    }
    if (formData.images.some(img => !img.trim())) {
      return 'All image URLs are required';
    }
    if (!formData.description.trim()) {
      return 'Description is required';
    }
    if (formData.budget < 0) {
      return 'Budget cannot be negative';
    }
    if (!formData.location.trim()) {
      return 'Location is required';
    }
    if (!formData.bestTimeToVisit.trim()) {
      return 'Best time to visit is required';
    }
    if (!formData.reference.trim()) {
      return 'Destination reference is required';
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
        images: formData.images.filter(img => img.trim() !== ''),
        tips: formData.tips.filter(tip => tip.trim() !== '')
      };

      const response = await fetch('http://localhost:5000/api/destination/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create destination');
      }

      // Success
      setSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        activityType: '',
        rating: 4.0,
        images: [''],
        description: '',
        budget: 0,
        location: '',
        bestTimeToVisit: '',
        tips: [''],
        reference: ''
      });

      // Refresh destination list after a delay
      setTimeout(() => {
        onDestinationAdded();
        onClose();
      }, 1500);

    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else if (typeof error === 'string') {
        setError(error);
      } else {
        setError('An unexpected error occurred while creating the destination');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        name: '',
        activityType: '',
        rating: 4.0,
        images: [''],
        description: '',
        budget: 0,
        location: '',
        bestTimeToVisit: '',
        tips: [''],
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
          <h3 className="text-xl font-semibold text-green-600">Destination Created Successfully!</h3>
          <p className="text-gray-600">The new destination has been added to the system.</p>
        </div>
      ) : (
        <>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Add New Destination</h3>
            <p className="text-sm text-gray-500 mt-1">
              Create a new travel destination with details and images.
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
                <MapPin className="w-4 h-4" />
                Destination Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Destination Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter destination name"
                    disabled={isLoading}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Activity Type */}
                <div className="space-y-2">
                  <label htmlFor="activityType" className="block text-sm font-medium text-gray-700">
                    Activity Type <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="activityType"
                    name="activityType"
                    value={formData.activityType}
                    onChange={handleChange}
                    placeholder="e.g., Beach, Mountain, Cultural"
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

                {/* Best Time to Visit */}
                <div className="space-y-2">
                  <label htmlFor="bestTimeToVisit" className="block text-sm font-medium text-gray-700">
                    Best Time to Visit <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="bestTimeToVisit"
                    name="bestTimeToVisit"
                    value={formData.bestTimeToVisit}
                    onChange={handleChange}
                    placeholder="e.g., November to March"
                    disabled={isLoading}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Rating */}
                <div className="space-y-2">
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                    Rating <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    min="0"
                    max="5"
                    step="0.1"
                    disabled={isLoading}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500">Rating must be between 0 and 5</p>
                </div>

                {/* Budget */}
                <div className="space-y-2">
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                    Budget <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    disabled={isLoading}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500">Estimated budget per person</p>
                </div>

                {/* Reference */}
                <div className="space-y-2">
                  <label htmlFor="reference" className="block text-sm font-medium text-gray-700">
                    Reference <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="reference"
                    name="reference"
                    value={formData.reference}
                    onChange={handleChange}
                    placeholder="e.g., BALI-BEACH-001"
                    disabled={isLoading}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
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
                  placeholder="Enter destination description"
                  disabled={isLoading}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              {/* Images */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination Images <span className="text-red-500">*</span>
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

              {/* Travel Tips */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Tips
                </label>
                <div className="space-y-2">
                  {formData.tips.map((tip, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={tip}
                        onChange={(e) => handleTipChange(index, e.target.value)}
                        placeholder="Enter travel tip"
                        disabled={isLoading}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      {formData.tips.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTipField(index)}
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
                    onClick={addTipField}
                    disabled={isLoading}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="w-4 h-4" />
                    Add Another Tip
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
                    Creating Destination...
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4" />
                    Create Destination
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