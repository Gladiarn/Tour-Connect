import React, { useState, useEffect } from "react";
import { PackageBookingFormState, packagesDisplayTypes } from "../types";
import Image from "next/image";
import { Users, Calendar, MapPin, Clock } from "lucide-react";
import ReceiptModal from "./ReceiptModal";

export default function PackageModal({
  packageItem,
}: {
  packageItem: packagesDisplayTypes | null;
}) {
  const [booking, setBooking] = useState<PackageBookingFormState>({
    packageReference: packageItem?.reference || "",
    dateBooked: new Date().toISOString().split("T")[0],
    dateStart: "",
    image: packageItem?.images[0] || "",
    totalPrice: packageItem?.price || 0,
  });

  const [showReceipt, setShowReceipt] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const onClose = () => {
    setShowReceipt(false);
    setBookingSuccess(false);
    // Reset form when receipt is closed
    if (packageItem) {
      setBooking({
        packageReference: packageItem.reference,
        dateBooked: new Date().toISOString().split("T")[0],
        dateStart: "",
        image: packageItem.images[0],
        totalPrice: packageItem.price,
      });
    }
  };

  useEffect(() => {
    if (packageItem) {
      setBooking((prev) => ({
        ...prev,
        packageReference: packageItem.reference,
        image: packageItem.images[0],
        totalPrice: packageItem.price,
        dateBooked: new Date().toISOString().split("T")[0],
      }));
    }
  }, [packageItem]);

  const updateBooking = (updates: Partial<typeof booking>) => {
    setBooking((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  // Handle booking submission
  const handleBookNow = async () => {
    try {
      // Validation
      if (!booking.dateStart) {
        setBookingError("Please select a start date");
        return;
      }

      if (booking.totalPrice <= 0) {
        setBookingError("Invalid booking price");
        return;
      }

      // Validate that start date is in the future
      const startDate = new Date(booking.dateStart);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to compare dates only

      if (startDate < today) {
        setBookingError("Start date must be today or in the future");
        return;
      }

      setIsSubmitting(true);
      setBookingError(null);

      const token = localStorage.getItem("accessToken");

      if (!token) {
        setBookingError("Please login to book");
        setIsSubmitting(false);
        return;
      }

      // Prepare booking data for backend
      const bookingData = {
        packageReference: booking.packageReference,
        dateStart: booking.dateStart, // We don't send dateBooked, backend sets it
        image: booking.image,
        totalPrice: booking.totalPrice,
        // Additional package details for reference
        packageDetails: {
          name: packageItem?.name,
          location: packageItem?.location,
          duration: packageItem?.duration,
          packsize: packageItem?.packsize,
          price: packageItem?.price,
          pricePerHead: packageItem?.pricePerHead,
          inclusions: packageItem?.inclusions || [],
          description: packageItem?.description,
        },
      };

      console.log("Sending package booking data:", bookingData);

      // Send to correct endpoint
      const response = await fetch(
        "http://localhost:5000/api/users/package-bookings",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create package booking");
      }

      console.log("✅ Package booking created successfully:", data);
      setBookingSuccess(true);
      setShowReceipt(true); // Show receipt modal

    } catch (error) {
      console.error("❌ Package booking error:", error);
      setBookingError(
        error instanceof Error ? error.message : "Package booking failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!showReceipt && packageItem) {
      setBooking({
        packageReference: packageItem.reference,
        dateBooked: new Date().toISOString().split("T")[0],
        dateStart: "",
        image: packageItem.images[0],
        totalPrice: packageItem.price,
      });
    }
  }, [showReceipt, packageItem]);

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      <span className="ml-2">Processing...</span>
    </div>
  );

  if (!packageItem) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-red-500">Package information not available</p>
      </div>
    );
  }

  return (
    <>
      {showReceipt ? (
        <ReceiptModal
          booking={booking}
          isOpen={showReceipt}
          onClose={onClose}
          destination={null}
          packageItem={packageItem}
        />
      ) : (
        <div className="flex flex-col text-[#3C3D37] gap-5">
          <div className="w-full text-center">
            {bookingError && (
              <div className="p-3 mb-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-500 text-[14px] font-medium">{bookingError}</p>
              </div>
            )}

            {bookingSuccess && (
              <div className="p-3 mb-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-500 text-[14px] font-medium">
                  ✅ Booking successful! Your package has been booked.
                </p>
              </div>
            )}
            <p className="text-[20px] font-semibold">{packageItem.name}</p>
          </div>

          {/* Package Image */}
          <div className="relative w-full h-[200px] overflow-hidden rounded-md">
            <Image
              src={
                booking.image ||
                packageItem.images[0] ||
                "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
              }
              fill
              alt={packageItem.name}
              className="object-cover"
            />
          </div>

          {/* Package Details */}
          <div className="space-y-4">
            {/* Location */}
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Location</p>
                <p className="text-[15px] text-gray-700">{packageItem.location}</p>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-start gap-2">
              <Clock className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Duration</p>
                <p className="text-[15px] text-gray-700">{packageItem.duration}</p>
              </div>
            </div>

            {/* Group Size */}
            <div className="flex items-start gap-2">
              <Users className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Group Size</p>
                <p className="text-[15px] text-gray-700">
                  {packageItem.packsize.min} - {packageItem.packsize.max} people
                </p>
              </div>
            </div>

            {/* Price */}
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="flex justify-between items-baseline">
                <p className="font-semibold">Package Price</p>
                <p className="text-[24px] font-bold text-green-700">
                  ₱ {packageItem.price.toLocaleString()}
                </p>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                ₱ {packageItem.pricePerHead.toLocaleString()} per person
              </p>
            </div>
          </div>

          {/* Package Description */}
          <div className="w-full space-y-2">
            <p className="font-semibold text-[18px]">Description</p>
            <p className="text-[15px] text-gray-700">{packageItem.description}</p>
          </div>

          {/* Inclusions */}
          <div className="w-full space-y-2">
            <p className="font-semibold text-[18px]">What&apos;s Included</p>
            <ul className="space-y-1">
              {packageItem.inclusions.map((inclusion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-[15px] text-gray-800">{inclusion}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Date Selection */}
          <div className="w-full space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <p className="font-semibold">Select Start Date</p>
            </div>
            <div className="flex gap-2">
              <input
                type="date"
                className="flex-1 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3C3D37] focus:border-transparent"
                value={booking.dateStart}
                onChange={(e) => updateBooking({ dateStart: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <p className="text-xs text-gray-500">
              Booking will be made today:{" "}
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Booking Summary */}
          <div className="w-full p-4 border border-gray-200 rounded-md bg-gray-50">
            <p className="font-semibold text-lg mb-3">Booking Summary</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Package:</span>
                <span className="font-medium">{packageItem.name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Group Size:</span>
                <span className="font-medium">
                  {packageItem.packsize.min} - {packageItem.packsize.max} people
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{packageItem.duration}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Booking Date:</span>
                <span className="font-medium">
                  {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Start Date:</span>
                <span className="font-medium">
                  {booking.dateStart
                    ? new Date(booking.dateStart).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Not selected"}
                </span>
              </div>

              <div className="pt-3 border-t border-gray-300">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-xl font-bold text-green-700">
                    ₱ {booking.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Book Now Button */}
          <button
            onClick={handleBookNow}
            disabled={isSubmitting || !booking.dateStart}
            className={`w-full px-4 py-3 text-white rounded-md transition-colors ease-in-out duration-200 font-medium ${
              isSubmitting || !booking.dateStart
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#3C3D37] hover:bg-[#55564F] cursor-pointer"
            }`}
          >
            {isSubmitting ? (
              <LoadingSpinner />
            ) : !booking.dateStart ? (
              "Select a start date to book"
            ) : (
              `Book Now - ₱ ${booking.totalPrice.toLocaleString()}`
            )}
          </button>
        </div>
      )}
    </>
  );
}