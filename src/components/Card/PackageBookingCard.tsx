import React from 'react';
import { PackageBooking } from '@/components/types';
import Image from 'next/image';
import { Calendar, MapPin, Users, Clock, CreditCard } from 'lucide-react';

interface PackageBookingCardProps {
  booking: PackageBooking;
}

export default function PackageBookingCard({ booking }: PackageBookingCardProps) {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format price in PHP
  const formatPrice = (price: number) => {
    return `₱${price.toLocaleString('en-PH', { minimumFractionDigits: 0 })}`;
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative w-full h-48">
        <Image
          src={booking.image || '/images/default-package.jpg'}
          alt={booking.packageDetails?.name || 'Package Booking'}
          fill
          className="object-cover"
        />
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
            {getStatusText(booking.status)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Package Name */}
        <h3 className="text-xl font-bold text-[#3C3D37] mb-2 truncate">
          {booking.packageDetails?.name || 'Package Booking'}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{booking.packageDetails?.location || 'Location not specified'}</span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Start Date */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Start Date</p>
              <p className="text-sm font-medium">{formatDate(booking.dateStart)}</p>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Duration</p>
              <p className="text-sm font-medium">{booking.packageDetails?.duration || 'N/A'}</p>
            </div>
          </div>

          {/* Group Size */}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Group Size</p>
              <p className="text-sm font-medium">
                {booking.packageDetails?.packsize 
                  ? `${booking.packageDetails.packsize.min}-${booking.packageDetails.packsize.max}` 
                  : 'N/A'}
              </p>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Price</p>
              <p className="text-sm font-medium text-green-600">{formatPrice(booking.totalPrice)}</p>
            </div>
          </div>
        </div>

        {/* Inclusions */}
        {booking.packageDetails?.inclusions && booking.packageDetails.inclusions.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Inclusions:</p>
            <div className="flex flex-wrap gap-1">
              {booking.packageDetails.inclusions.slice(0, 3).map((inclusion, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {inclusion}
                </span>
              ))}
              {booking.packageDetails.inclusions.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  +{booking.packageDetails.inclusions.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Booking Date */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Booked on</p>
              <p className="text-sm font-medium">{formatDate(booking.dateBooked)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Reference</p>
              <p className="text-sm font-medium font-mono">{booking.packageReference?.slice(0, 8)}...</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        {booking.status === 'upcoming' && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button className="w-full px-4 py-2 bg-[#3C3D37] text-white rounded-md hover:bg-[#55564F] transition-colors duration-200 text-sm font-medium">
              View Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}