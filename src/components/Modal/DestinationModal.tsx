import React, { useState, useEffect, useCallback } from "react";
import { BookingFormState, destinationsDisplayTypes } from "../types";
import Image from "next/image";
import ReceiptModal from "./ReceiptModal";

export default function DestinationModal({
  destination,
}: {
  destination: destinationsDisplayTypes | null;
}) {
  const [booking, setBooking] = useState<BookingFormState>({
    destinationReference: destination?.reference,
    tourType: "",
    transportation: [] as string[],
    image: destination?.images[0],
    dateBooked: new Date().toISOString().split("T")[0],
    dateStart: "",
    totalPrice: 0,
  });
  const onClose = () => {
    setShowReceipt(false);
  };
  const [showReceipt, setShowReceipt] = useState<boolean>(false);
  // Calculate total whenever relevant booking details change
  const calculateTotal = useCallback(() => {
    let basePrice = 0;

    // Calculate base price based on tour type
    if (booking.tourType === "dayTour") {
      basePrice = (destination?.budget ?? 0) / 2;
    } else if (booking.tourType === "overnightStay") {
      basePrice = destination?.budget ?? 0;
    }

    // Calculate transportation costs
    const transportCost = booking.transportation.reduce((total, transport) => {
      if (transport === "vanRental") return total + 2500;
      if (transport === "boatTransfer") return total + 1800;
      return total;
    }, 0);

    return basePrice + transportCost;
  }, [booking.tourType, booking.transportation, destination?.budget]);

  // Update total whenever dependencies change
  useEffect(() => {
    const newTotal = calculateTotal();
    if (booking.totalPrice !== newTotal) {
      setBooking((prev) => ({ ...prev, totalPrice: newTotal }));
    }
  }, [calculateTotal, booking.totalPrice]);

  const updateBooking = (updates: Partial<typeof booking>) => {
    setBooking((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const handleTourTypeChange = (tourType: string) => {
    updateBooking({ tourType });
  };

  const handleTransportationChange = (
    transportType: string,
    isChecked: boolean
  ) => {
    setBooking((prev) => {
      const updatedTransportation = isChecked
        ? [...prev.transportation, transportType]
        : prev.transportation.filter((t) => t !== transportType);

      return {
        ...prev,
        transportation: updatedTransportation,
      };
    });
  };

  // Handle booking submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Handle booking submission
  const handleBookNow = async () => {
    try {
      // Validation
      if (!booking.tourType) {
        setBookingError("Please select a tour type");
        return;
      }

      if (!booking.dateStart) {
        setBookingError("Please select a start date");
        return;
      }

      if (booking.totalPrice <= 0) {
        setBookingError("Invalid booking price");
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

      const bookingData = {
        destinationReference: booking.destinationReference,
        tourType: booking.tourType,
        transportation: booking.transportation,
        image: booking.image,
        dateStart: booking.dateStart,
        totalPrice: booking.totalPrice,
      };

      console.log("Sending booking data:", bookingData);

      const response = await fetch(
        "http://localhost:5000/api/bookings/create",
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
        throw new Error(data.message || "Failed to create booking");
      }

      console.log("✅ Booking created successfully:", data);
      setBookingSuccess(true);
      setShowReceipt(true);

      // Reset form after successful booking
    } catch (error) {
      console.error("❌ Booking error:", error);
      setBookingError(
        error instanceof Error ? error.message : "Booking failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!showReceipt) {
      setBooking({
        destinationReference: destination?.reference,
        tourType: "",
        transportation: [],
        image: destination?.images[0],
        dateBooked: new Date().toISOString().split("T")[0],
        dateStart: "",
        totalPrice: 0,
      });
    }
  }, [showReceipt, destination?.images, destination?.reference]);

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      <span className="ml-2">Processing...</span>
    </div>
  );

  return (
    <>
      {showReceipt ? (
        <ReceiptModal
          destination={destination}
          booking={booking}
          isOpen={showReceipt}
          onClose={onClose}
        />
      ) : (
        <div className="flex flex-col text-[#3C3D37] gap-5">
          <div className="w-full text-center">
            {bookingError && (
              <p className="text-red-500 text-[14px]">{bookingError}</p>
            )}

            {bookingSuccess && (
              <p className="text-green-500 text-[14px]">processing...</p>
            )}
            <p className="text-[20px] font-semibold">{destination?.name}</p>
          </div>

          <div className="flex gap-5">
            <div className="relative w-[250px] h-[250px] overflow-hidden rounded-md">
              <Image
                src={
                  destination?.images[0] ||
                  "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                }
                fill
                alt={destination?.name || "Destination Image"}
                className="object-cover"
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-semibold text-[20px]">
                {destination?.location}
              </p>

              {/* Tour Type Selection */}
              <div className="w-full flex flex-col items-start gap-1">
                <p className="font-semibold">Day Tour</p>
                <span className="flex gap-1 pl-2">
                  <input
                    type="radio"
                    name="tour"
                    id="tour-day"
                    checked={booking.tourType === "dayTour"}
                    onChange={() => handleTourTypeChange("dayTour")}
                  />
                  <label htmlFor="tour-day" className="text-[15px]">
                    ₱ {(destination?.budget ?? 0) / 2} per head
                  </label>
                </span>
              </div>

              <div className="w-full flex flex-col items-start gap-1">
                <p className="font-semibold">Overnight Stay</p>
                <span className="flex gap-1 pl-2">
                  <input
                    type="radio"
                    name="tour"
                    id="tour-night"
                    checked={booking.tourType === "overnightStay"}
                    onChange={() => handleTourTypeChange("overnightStay")}
                  />
                  <label htmlFor="tour-night" className="text-[15px]">
                    ₱ {destination?.budget ?? 0} per head
                  </label>
                </span>
              </div>

              {/* Date Selection */}
              <div className="w-full flex flex-col items-start gap-1">
                <p className="font-semibold">When</p>
                <span className="flex gap-1 pl-2">
                  <input
                    type="date"
                    className="border border-black px-1 rounded-md"
                    value={booking.dateStart}
                    onChange={(e) =>
                      updateBooking({ dateStart: e.target.value })
                    }
                    min={new Date().toISOString().split("T")[0]}
                  />
                </span>
              </div>

              <button
                onClick={handleBookNow}
                disabled={isSubmitting}
                className={`mt-3 w-full text-nowrap px-4 py-2 text-white border border-white rounded-sm transition-colors ease-in-out duration-200 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#3C3D37] hover:bg-white hover:text-[#3C3D37] hover:border-[#3C3D37] cursor-pointer"
                }`}
              >
                {isSubmitting ? (
                  <LoadingSpinner />
                ) : (
                  `Book - ₱ ${booking.totalPrice.toLocaleString()}`
                )}
              </button>
            </div>
          </div>

          <div className="w-full space-y-3">
            <p className="text-[18px] font-semibold">
              Transportation (optional)
            </p>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="van-rental"
                  checked={booking.transportation.includes("vanRental")}
                  onChange={(e) =>
                    handleTransportationChange("vanRental", e.target.checked)
                  }
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="van-rental"
                  className="cursor-pointer text-gray-700"
                >
                  Van Rental - ₱ 2,500/day
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="boat-transfer"
                  checked={booking.transportation.includes("boatTransfer")}
                  onChange={(e) =>
                    handleTransportationChange("boatTransfer", e.target.checked)
                  }
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="boat-transfer"
                  className="cursor-pointer text-gray-700"
                >
                  Boat Transfer - ₱ 1,800/ride
                </label>
              </div>
            </div>
          </div>

          {/* Booking Summary (Optional) */}
          <div className="w-full p-4 border border-gray-200 rounded-md">
            <p className="font-semibold text-lg mb-2">Booking Summary</p>
            <div className="space-y-1 text-sm">
              <p>Tour Type: {booking.tourType || "Not selected"}</p>
              <p>Start Date: {booking.dateStart || "Not selected"}</p>
              <p>
                Transportation: {booking.transportation.join(", ") || "None"}
              </p>
              <p className="font-semibold mt-2">
                Total: ₱ {booking.totalPrice.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
