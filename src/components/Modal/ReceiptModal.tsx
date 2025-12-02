// components/ReceiptModal.tsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CheckCircle2, Calendar, MapPin, CreditCard, Users, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { BookingFormState, destinationsDisplayTypes } from '../types';
import { useAuth } from '@/context/AuthContext';


interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingFormState;
  destination: destinationsDisplayTypes | null;
}

export default function ReceiptModal({ isOpen, onClose, booking, destination }: ReceiptModalProps) {
    const {user} = useAuth();
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate tax (12% VAT for Philippines)
  const calculateTax = (price: number) => {
    return price * 0.12;
  };

  // Format price in PHP
  const formatPrice = (price: number) => {
    return `₱${price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const subtotal = booking.totalPrice;
  const tax = calculateTax(subtotal);
  const grandTotal = subtotal + tax;

//   const handlePrint = () => {
//     window.print();
//   };

  const handleDownload = () => {
    // Create a printable version of the receipt
    const receiptContent = `
      TOUR CONNECT - BOOKING RECEIPT
      =================================
      Booking ID: ${booking.destinationReference}-${Date.now()}
      Date: ${formatDate(booking.dateBooked)}
      
      CUSTOMER INFORMATION:
      Name: ${user?.name || 'N/A'}
      Email: ${user?.email || 'N/A'}
      
      BOOKING DETAILS:
      Destination: ${destination?.name || 'N/A'}
      Location: ${destination?.location || 'N/A'}
      Tour Type: ${booking.tourType}
      Start Date: ${formatDate(booking.dateStart)}
      Transportation: ${booking.transportation.join(', ') || 'None'}
      
      PAYMENT SUMMARY:
      Subtotal: ${formatPrice(subtotal)}
      VAT (12%): ${formatPrice(tax)}
      Total: ${formatPrice(grandTotal)}
      
      =================================
      Thank you for booking with Tour Connect!
      For inquiries: support@tourconnect.com
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TourConnect-Receipt-${booking.destinationReference}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle2 className="w-6 h-6" />
              <span className="text-2xl font-bold">Booking Confirmed!</span>
            </div>
          </DialogTitle>
          <DialogDescription className="text-center">
            Your booking has been successfully processed
          </DialogDescription>
        </DialogHeader>

        {/* Receipt Card */}
        <div className="border-2 border-gray-200 rounded-lg p-6 space-y-6">
          {/* Header */}
          <div className="text-center border-b pb-4">
            <h2 className="text-2xl font-bold text-[#3C3D37]">TOUR CONNECT</h2>
            <p className="text-gray-600">Your Travel Partner</p>
            <div className="mt-2 text-sm text-gray-500">
              Booking ID: <span className="font-mono font-bold">{booking.destinationReference}-{Date.now().toString().slice(-6)}</span>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-[#3C3D37]">Booking Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Destination</p>
                    <p className="font-medium">{destination?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{destination?.location}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Tour Start Date</p>
                    <p className="font-medium">{formatDate(booking.dateStart)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Tour Type</p>
                    <p className="font-medium capitalize">{booking.tourType}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transportation */}
            {booking.transportation.length > 0 && (
              <div className="pt-2">
                <p className="text-sm text-gray-500 mb-1">Transportation Included:</p>
                <div className="flex flex-wrap gap-2">
                  {booking.transportation.map((transport, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {transport}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Payment Summary */}
          <div className="border-t pt-4">
            <h3 className="font-bold text-lg text-[#3C3D37] mb-4">Payment Summary</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">VAT (12%)</span>
                <span className="font-medium">{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-lg font-bold text-[#3C3D37]">Total Amount</span>
                <span className="text-xl font-bold text-green-600">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-blue-700">Payment Status: <span className="font-bold">Paid</span></span>
              </div>
            </div>
          </div>

          {/* Booking Date */}
          <div className="text-center text-sm text-gray-500">
            <p>Booking Date: {formatDate(booking.dateBooked)}</p>
          </div>

          {/* Terms */}
          <div className="text-xs text-gray-500 border-t pt-4">
            <p className="mb-1">• Confirmation email with detailed itinerary will be sent within 24 hours</p>
            <p className="mb-1">• Free cancellation up to 7 days before the tour start date</p>
            <p>• For assistance, contact support@tourconnect.com or +63 912 345 6789</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button
            variant="outline"
            onClick={handleDownload}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Receipt
          </Button>
          <Button
            onClick={onClose}
            className="bg-[#3C3D37] hover:bg-[#55564F] text-white"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}