import Image from "next/image";
import React from "react";

interface HotelBookingCardProps {
  booking: {
    _id: string;
    name: string;
    phoneNumber: string;
    address: string;
    checkInDate: string | Date;
    checkOutDate: string | Date;
    nightCount: number;
    totalPrice: number;
    roomReference: string;
    hotelReference: string;
    image: string;
    dateBooked: string | Date;
    status?: "upcoming" | "ongoing" | "completed" | "cancelled";
  };
}

export default function HotelBookingCard({ booking }: HotelBookingCardProps) {
  const formatDate = (date: string | Date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status?: string) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status.toLowerCase()) {
      case 'upcoming': return 'bg-yellow-100 text-yellow-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status?: string) => {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Booking Image */}
      <div className="relative h-48">
        <Image
          src={booking.image || "/images/default-hotel.jpg"}
          alt="Hotel Booking"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute bottom-2 left-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(booking.status)}`}>
            {getStatusText(booking.status)}
          </span>
        </div>
      </div>
      
      {/* Booking Info */}
      <div className="p-4">
        {/* Price and Nights */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-sm text-gray-600">Total Price:</p>
            <span className="text-lg font-semibold">
              ₱{booking.totalPrice?.toLocaleString() || "0"}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">{booking.nightCount || 0} night{(booking.nightCount || 0) !== 1 ? 's' : ''}</p>
            <p className="text-xs text-gray-500">
              {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
            </p>
          </div>
        </div>
        
        {/* Guest Information */}
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-700 mb-1">Guest Information:</p>
          <p className="text-sm font-semibold">{booking.name || "N/A"}</p>
          <p className="text-sm text-gray-600">{booking.phoneNumber || "N/A"}</p>
          <p className="text-sm text-gray-500 line-clamp-1 mt-1">{booking.address || "N/A"}</p>
        </div>
        
        {/* References */}
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-600">Room Ref:</p>
              <p className="font-medium truncate">{booking.roomReference || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-600">Hotel Ref:</p>
              <p className="font-medium truncate">{booking.hotelReference || "N/A"}</p>
            </div>
          </div>
        </div>
        
        {/* Dates */}
        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Booked on: {formatDate(booking.dateBooked)}
          </p>
          <div className="flex justify-between items-center mt-2">
            <div className="text-xs text-gray-500">
              Booking ID: {booking._id ? booking._id.substring(0, 8) + "..." : "N/A"}
            </div>
            <button 
              onClick={() => {
                console.log("View booking details:", booking._id);
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View Details →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}