// components/admin/AddHotelModal.tsx
import React, { useState } from 'react';
import { Hotel, Loader2, CheckCircle, XCircle, Plus, Trash2 } from 'lucide-react';

interface AddHotelModalProps {
  onClose: () => void;
  onHotelAdded: () => void;
}

interface RoomFormData {
  roomReference: string;
  name: string;
  image: string;
  features: string[];
  facilities: string[];
  description: string;
  price: number;
  guests: string[];
  area: string;
}

interface HotelFormData {
  name: string;
  location: string;
  reference: string;
  images: string[];
  rating: number;
  rooms: RoomFormData[];
}

export default function AddHotelModal({ onClose, onHotelAdded }: AddHotelModalProps) {
  const [hotelFormData, setHotelFormData] = useState<HotelFormData>({
    name: '',
    location: '',
    reference: '',
    images: [''],
    rating: 4.0,
    rooms: [
      {
        roomReference: '',
        name: '',
        image: '',
        features: [''],
        facilities: [''],
        description: '',
        price: 0,
        guests: [''],
        area: ''
      }
    ]
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleHotelChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setHotelFormData(prev => ({
      ...prev,
      [name]: name === 'rating' || name === 'price' ? parseFloat(value) || 0 : value
    }));
    setError(null);
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...hotelFormData.images];
    newImages[index] = value;
    setHotelFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const addImageField = () => {
    setHotelFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageField = (index: number) => {
    if (hotelFormData.images.length > 1) {
      const newImages = hotelFormData.images.filter((_, i) => i !== index);
      setHotelFormData(prev => ({
        ...prev,
        images: newImages
      }));
    }
  };

  // Room handlers
  const handleRoomStringChange = (roomIndex: number, field: 'roomReference' | 'name' | 'image' | 'description' | 'area', value: string) => {
    const newRooms = [...hotelFormData.rooms];
    newRooms[roomIndex][field] = value;
    setHotelFormData(prev => ({
      ...prev,
      rooms: newRooms
    }));
  };

  const handleRoomPriceChange = (roomIndex: number, value: string) => {
    const newRooms = [...hotelFormData.rooms];
    newRooms[roomIndex].price = parseFloat(value) || 0;
    setHotelFormData(prev => ({
      ...prev,
      rooms: newRooms
    }));
  };

  const handleRoomFeaturesChange = (roomIndex: number, value: string) => {
    const newRooms = [...hotelFormData.rooms];
    newRooms[roomIndex].features = value.split(',').map(item => item.trim()).filter(item => item !== '');
    setHotelFormData(prev => ({
      ...prev,
      rooms: newRooms
    }));
  };

  const handleRoomFacilitiesChange = (roomIndex: number, value: string) => {
    const newRooms = [...hotelFormData.rooms];
    newRooms[roomIndex].facilities = value.split(',').map(item => item.trim()).filter(item => item !== '');
    setHotelFormData(prev => ({
      ...prev,
      rooms: newRooms
    }));
  };

  const handleRoomGuestsChange = (roomIndex: number, value: string) => {
    const newRooms = [...hotelFormData.rooms];
    newRooms[roomIndex].guests = value.split(',').map(item => item.trim()).filter(item => item !== '');
    setHotelFormData(prev => ({
      ...prev,
      rooms: newRooms
    }));
  };

  const addRoom = () => {
    setHotelFormData(prev => ({
      ...prev,
      rooms: [
        ...prev.rooms,
        {
          roomReference: '',
          name: '',
          image: '',
          features: [''],
          facilities: [''],
          description: '',
          price: 0,
          guests: [''],
          area: ''
        }
      ]
    }));
  };

  const removeRoom = (index: number) => {
    if (hotelFormData.rooms.length > 1) {
      const newRooms = hotelFormData.rooms.filter((_, i) => i !== index);
      setHotelFormData(prev => ({
        ...prev,
        rooms: newRooms
      }));
    }
  };

  const validateForm = (): string | null => {
    // Hotel validation
    if (!hotelFormData.name.trim()) {
      return 'Hotel name is required';
    }
    if (!hotelFormData.location.trim()) {
      return 'Location is required';
    }
    if (!hotelFormData.reference.trim()) {
      return 'Hotel reference is required';
    }
    if (hotelFormData.images.some(img => !img.trim())) {
      return 'All image URLs are required';
    }
    if (hotelFormData.rating < 0 || hotelFormData.rating > 5) {
      return 'Rating must be between 0 and 5';
    }

    // Rooms validation
    for (let i = 0; i < hotelFormData.rooms.length; i++) {
      const room = hotelFormData.rooms[i];
      if (!room.roomReference.trim()) {
        return `Room ${i + 1}: Room reference is required`;
      }
      if (!room.name.trim()) {
        return `Room ${i + 1}: Room name is required`;
      }
      if (!room.image.trim()) {
        return `Room ${i + 1}: Room image URL is required`;
      }
      if (!room.description.trim()) {
        return `Room ${i + 1}: Description is required`;
      }
      if (room.price <= 0) {
        return `Room ${i + 1}: Price must be greater than 0`;
      }
      if (!room.area.trim()) {
        return `Room ${i + 1}: Area is required`;
      }
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
        ...hotelFormData,
        images: hotelFormData.images.filter(img => img.trim() !== ''),
        rooms: hotelFormData.rooms.map(room => ({
          ...room,
          features: room.features.filter(f => f.trim() !== ''),
          facilities: room.facilities.filter(f => f.trim() !== ''),
          guests: room.guests.filter(g => g.trim() !== '')
        }))
      };

      const response = await fetch('http://localhost:5000/api/hotels/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create hotel');
      }

      // Success
      setSuccess(true);
      
      // Reset form
      setHotelFormData({
        name: '',
        location: '',
        reference: '',
        images: [''],
        rating: 4.0,
        rooms: [
          {
            roomReference: '',
            name: '',
            image: '',
            features: [''],
            facilities: [''],
            description: '',
            price: 0,
            guests: [''],
            area: ''
          }
        ]
      });

      // Refresh hotel list after a delay
      setTimeout(() => {
        onHotelAdded();
        onClose();
      }, 1500);

    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else if (typeof error === 'string') {
        setError(error);
      } else {
        setError('An unexpected error occurred while creating the hotel');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setHotelFormData({
        name: '',
        location: '',
        reference: '',
        images: [''],
        rating: 4.0,
        rooms: [
          {
            roomReference: '',
            name: '',
            image: '',
            features: [''],
            facilities: [''],
            description: '',
            price: 0,
            guests: [''],
            area: ''
          }
        ]
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
          <h3 className="text-xl font-semibold text-green-600">Hotel Created Successfully!</h3>
          <p className="text-gray-600">The new hotel has been added to the system.</p>
        </div>
      ) : (
        <>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Add New Hotel</h3>
            <p className="text-sm text-gray-500 mt-1">
              Create a new hotel with rooms and amenities.
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
            {/* Hotel Basic Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                <Hotel className="w-4 h-4" />
                Hotel Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hotel Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Hotel Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={hotelFormData.name}
                    onChange={handleHotelChange}
                    placeholder="Enter hotel name"
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
                    value={hotelFormData.location}
                    onChange={handleHotelChange}
                    placeholder="e.g., Palo, Leyte"
                    disabled={isLoading}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Hotel Reference */}
                <div className="space-y-2">
                  <label htmlFor="reference" className="block text-sm font-medium text-gray-700">
                    Hotel Reference <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="reference"
                    name="reference"
                    value={hotelFormData.reference}
                    onChange={handleHotelChange}
                    placeholder="e.g., GRAND-PARIS-001"
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
                    value={hotelFormData.rating}
                    onChange={handleHotelChange}
                    min="0"
                    max="5"
                    step="0.1"
                    disabled={isLoading}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500">Rating must be between 0 and 5</p>
                </div>
              </div>

              {/* Images */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hotel Images <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {hotelFormData.images.map((image, index) => (
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
                      {hotelFormData.images.length > 1 && (
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
            </div>

            {/* Rooms Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-700 flex items-center gap-2">
                  Rooms
                </h4>
                <button
                  type="button"
                  onClick={addRoom}
                  disabled={isLoading}
                  className="flex items-center gap-2 text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Room
                </button>
              </div>

              <div className="space-y-6">
                {hotelFormData.rooms.map((room, roomIndex) => (
                  <div key={roomIndex} className="border border-gray-200 p-4 rounded-lg bg-white">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="font-medium text-gray-700">Room {roomIndex + 1}</h5>
                      {hotelFormData.rooms.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRoom(roomIndex)}
                          disabled={isLoading}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Room Reference */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Room Reference <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={room.roomReference}
                          onChange={(e) => handleRoomStringChange(roomIndex, 'roomReference', e.target.value)}
                          placeholder="e.g., DLX-001"
                          disabled={isLoading}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>

                      {/* Room Name */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Room Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={room.name}
                          onChange={(e) => handleRoomStringChange(roomIndex, 'name', e.target.value)}
                          placeholder="e.g., Deluxe King Room"
                          disabled={isLoading}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>

                      {/* Room Image URL */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Room Image URL <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={room.image}
                          onChange={(e) => handleRoomStringChange(roomIndex, 'image', e.target.value)}
                          placeholder="Enter image URL"
                          disabled={isLoading}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>

                      {/* Price */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Price <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={room.price}
                          onChange={(e) => handleRoomPriceChange(roomIndex, e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          disabled={isLoading}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>

                      {/* Area */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Area <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={room.area}
                          onChange={(e) => handleRoomStringChange(roomIndex, 'area', e.target.value)}
                          placeholder="e.g., 45 sqm"
                          disabled={isLoading}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>

                      {/* Features */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Features (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={room.features.join(', ')}
                          onChange={(e) => handleRoomFeaturesChange(roomIndex, e.target.value)}
                          placeholder="e.g., Ocean View, Balcony, King Size Bed"
                          disabled={isLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>

                      {/* Facilities */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Facilities (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={room.facilities.join(', ')}
                          onChange={(e) => handleRoomFacilitiesChange(roomIndex, e.target.value)}
                          placeholder="e.g., Free WiFi, Smart TV, Minibar"
                          disabled={isLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>

                      {/* Guests */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Guests (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={room.guests.join(', ')}
                          onChange={(e) => handleRoomGuestsChange(roomIndex, e.target.value)}
                          placeholder="e.g., 2 Adults, 1 Child"
                          disabled={isLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mt-4 space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={room.description}
                        onChange={(e) => handleRoomStringChange(roomIndex, 'description', e.target.value)}
                        placeholder="Enter room description"
                        disabled={isLoading}
                        required
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                ))}
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
                    Creating Hotel...
                  </>
                ) : (
                  <>
                    <Hotel className="w-4 h-4" />
                    Create Hotel
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