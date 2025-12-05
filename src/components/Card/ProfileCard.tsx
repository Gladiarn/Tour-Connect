import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { Booking } from "../types";
import { X, Check, Loader2 } from "lucide-react";

interface ProfileCardProps {
  booking: Booking;
  type: 'ongoing' | 'past';
  onBookingCancelled?: () => void;
}

export default function ProfileCard({ booking, type, onBookingCancelled }: ProfileCardProps) {
  const [isCancelling, setIsCancelling] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);
  const [cancelPosition, setCancelPosition] = useState<{x: number, y: number} | null>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

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

  const handleCancelClick = (bookingId: string, event: React.MouseEvent) => {
    const button = event.currentTarget as HTMLButtonElement;
    const rect = button.getBoundingClientRect();
    
    const modalWidth = 260;
    const viewportWidth = window.innerWidth;
    
    let modalX = rect.right + 10;
    const modalY = rect.top;
    
    if (modalX + modalWidth > viewportWidth) {
      modalX = rect.left - modalWidth - 10;
    }
    
    setCancelPosition({ x: modalX, y: modalY });
    setConfirmCancel(bookingId);
  };

  const handleConfirmCancel = async (bookingId: string) => {
    setIsCancelling(bookingId);
    
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to cancel booking');
      }

      if (result.success) {
        alert('Booking cancelled successfully!');
        
        if (onBookingCancelled) {
          onBookingCancelled();
        }
        
        window.location.reload();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to cancel booking'}`);
    } finally {
      setIsCancelling(null);
      setConfirmCancel(null);
      setCancelPosition(null);
    }
  };

  const handleCancelConfirmation = () => {
    setConfirmCancel(null);
    setCancelPosition(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (confirmCancel && !(event.target as Element).closest('.confirmation-modal')) {
        handleCancelConfirmation();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [confirmCancel]);

  // Only show cancel button for upcoming bookings
  const showCancelButton = booking.status === 'upcoming' && type === 'ongoing';

  return (
    <>
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow relative">
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

          {/* Cancel Button - Only show for upcoming bookings */}
          {showCancelButton && (
            <div className="mt-4 pt-3 border-t">
              <button
                ref={cancelButtonRef}
                onClick={(e) => handleCancelClick(booking._id!, e)}
                disabled={isCancelling === booking._id}
                className="w-full text-red-600 hover:text-red-800 border border-red-300 hover:border-red-500 rounded-md py-2 px-3 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isCancelling === booking._id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    Cancel Booking
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cancellation Confirmation Modal */}
      {confirmCancel && cancelPosition && (
        <div className="fixed inset-0 z-50" style={{ pointerEvents: 'none' }}>
          <div 
            className="absolute z-50 confirmation-modal bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-64"
            style={{
              left: `${cancelPosition.x}px`,
              top: `${cancelPosition.y}px`,
              pointerEvents: 'auto',
              transform: 'translateY(-50%)'
            }}
          >
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900">Confirm Cancellation</h3>
                <button
                  onClick={handleCancelConfirmation}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-sm text-gray-600">
                Are you sure you want to cancel this booking? This action cannot be undone.
              </p>
              
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={handleCancelConfirmation}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Keep Booking
                </button>
                <button
                  onClick={() => handleConfirmCancel(confirmCancel)}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md flex items-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}