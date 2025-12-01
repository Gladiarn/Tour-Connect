import Image from "next/image";
import React from "react";
import { Booking } from "../types";


interface ProfileCardProps {
  booking: Booking;
  type: 'ongoing' | 'past';
}

export default function ProfileCard({ booking, type }: ProfileCardProps) {
  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'upcoming': return 'bg-yellow-100 text-yellow-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Booking['status']) => {
    if(!status) return 'unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48">
        <Image
          src={booking.image}
          alt="Booking"
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(booking.status)}`}>
            {getStatusText(booking.status)}
          </span>
          <span className="text-lg font-semibold">
            ₱{booking.totalPrice?.toLocaleString()}
          </span>
        </div>
        <p className="font-semibold mb-1">Tour Type: {booking.tourType}</p>
        <p className="text-sm text-gray-600 mb-2">
          {type === 'ongoing' ? 'Starts: ' : 'Started: '}
          {new Date(booking.dateStart).toLocaleDateString()}
        </p>
        
        {booking.transportation?.length > 0 && (
          <p className="text-sm text-gray-600">
            Transportation: {booking.transportation?.join(', ')}
          </p>
        )}
        
        {type === 'past' && (
          <p className="text-sm text-gray-500 mt-2">
            Booked on: {new Date(booking.dateBooked).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}