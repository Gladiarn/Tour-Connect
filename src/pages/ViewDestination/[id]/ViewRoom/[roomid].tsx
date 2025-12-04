import { bookRoomTypes, hotelsTypes, roomPageTypes } from "@/components/types";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import SmallCard from "@/components/Card/SmallCard";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "2-digit",
};

export default function ViewRoomPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { id, roomid } = router.query;

  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [hotel, setHotel] = useState<hotelsTypes | null>(null);
  const [room, setRoom] = useState<roomPageTypes | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookNow, setBookNow] = useState<boolean>(false);
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const [data, setData] = useState<bookRoomTypes>({
    name: "",
    phoneNumber: "",
    address: "",
    dateRange: {
      startDate: undefined,
      endDate: undefined,
    },
    nightCount: 0,
    totalPrice: 0,
    image: room?.image || "",
    roomReference: String(roomid) || "",
    hotelReference: String(id) || "",
  });

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!id || !roomid) {
        console.log("❌ Missing parameters");
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:5000/api/hotels/${id}/${roomid}`
        );
        const data = await res.json();
        setHotel(data.hotel);
        setRoom(data.room);

        if (user?.name) {
          dataSetter("name", user.name);
        }

        if (data.room?.image) {
          dataSetter("image", data.room.image);
        }
      } catch (error) {
        console.error("❌ Error fetching room data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [id, roomid, user]);

  useEffect(() => {
    if (date?.from && date?.to && room) {
      // Calculate night count
      const timeDifference = date.to.getTime() - date.from.getTime();
      const nightCount = Math.ceil(timeDifference / (1000 * 3600 * 24));

      // Calculate total price
      const totalPrice = nightCount * room.price;

      setData((prevData) => ({
        ...prevData,
        dateRange: { startDate: date.from, endDate: date.to },
        nightCount: nightCount,
        totalPrice: totalPrice,
      }));
    } else {
      // Reset if no date range selected
      setData((prevData) => ({
        ...prevData,
        nightCount: 0,
        totalPrice: 0,
      }));
    }
  }, [date, room]);

  const dataSetter = <K extends keyof bookRoomTypes>(
    key: K,
    value: bookRoomTypes[K]
  ) => {
    setData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleOnClick = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setBookNow(true);
  };

  // Function to send hotel booking
  const sendHotelBooking = async () => {
    try {
      setIsBooking(true);
      setBookingError(null);

      // Validate required fields
      if (!data.name.trim()) {
        throw new Error("Name is required");
      }
      if (!data.phoneNumber.trim() || data.phoneNumber.length < 10) {
        throw new Error("Valid phone number is required (minimum 10 digits)");
      }
      if (!data.address.trim()) {
        throw new Error("Address is required");
      }
      if (!data.dateRange.startDate || !data.dateRange.endDate) {
        throw new Error("Please select check-in and check-out dates");
      }
      if (data.nightCount <= 0) {
        throw new Error("Please select valid dates");
      }
      if (!data.roomReference || !data.hotelReference) {
        throw new Error("Room or hotel reference is missing");
      }
      if (!data.image) {
        throw new Error("Image is required");
      }

      // Get token from localStorage
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Please login first");
      }

      const bookingData = {
        name: data.name.trim(),
        phoneNumber: data.phoneNumber.trim(),
        address: data.address.trim(),
        dateRange: {
          startDate: data.dateRange.startDate,
          endDate: data.dateRange.endDate,
        },
        nightCount: data.nightCount,
        totalPrice: data.totalPrice,
        roomReference: data.roomReference,
        hotelReference: data.hotelReference,
        image: data.image,

        roomDetails: room
          ? {
              name: room.name,
              price: room.price,
              features: room.features || [],
              facilities: room.facilities || [],
              description: room.description || "",
              guests: room.guests || [],
              area: room.area || "",
            }
          : undefined,
        hotelDetails: hotel
          ? {
              name: hotel.name,
              location: hotel.location,
              rating: hotel.rating,
            }
          : undefined,
      };

      console.log("Sending booking data:", bookingData);

      const response = await fetch(
        "http://localhost:5000/api/users/hotel-bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bookingData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create booking");
      }

      if (!result.success) {
        throw new Error(result.message || "Booking failed");
      }

      // Booking successful
      setBookingSuccess(true);
      console.log("Booking created successfully:", result.data);

      // Optionally redirect to profile page or show success message
      setTimeout(() => {
        router.push("/profile");
      }, 2000);
    } catch (error) {
      console.error("Booking error:", error);
      setBookingError(
        error instanceof Error
          ? error.message
          : "An error occurred during booking"
      );
    } finally {
      setIsBooking(false);
    }
  };

  const handleConfirmBooking = () => {
    sendHotelBooking();
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Loading room...
      </div>
    );
  }

  if (!room) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Room not found
      </div>
    );
  }

  return (
    <div className=" w-full text-[#3C3D37] bg-[#EEEEEE] py-[90px] px-[30px] md:px-[80px] flex flex-col gap-5 justify-center items-center">
      <div className="w-fit flex flex-col gap-10">
        {/* upper part */}
        <div className="flex gap-10 xl:flex-row flex-col">
          <div className="bg-[#FFFFFF] p-[15px] rounded-md flex flex-col gap-1 shadow-[0px_4px_14px_1px_rgba(0,_0,_0,_0.1)] w-full md:w-fit">
            <div className="relative aspect-[16/8] md:w-[500] md:h-[300px] lg:w-[800px] lg:h-[400px] overflow-hidden rounded-sm">
              <Image src={room.image} fill alt={"test"} />
            </div>
            <p className="font-semibold">
              {room.name} - {hotel?.name}
            </p>
            <p className="before:content-['₱'] after:content-['_per_night']">
              {room.price?.toLocaleString() ?? "0"}
            </p>
          </div>

          {/* details */}

          {bookNow ? (
            <div className="p-[15px] py-[20px] flex flex-col gap-5 bg-[#FFFFFF] rounded-md max-w-[450px] w-full min-w-[300px] h-fit">
              <p className="font-semibold text-[15px]">BOOKING DETAILS</p>

              {/* Success Message */}
              {bookingSuccess && (
                <div className="p-3 bg-green-100 text-green-800 rounded-md">
                  ✅ Booking successful!
                </div>
              )}

              {/* Error Message */}
              {bookingError && (
                <div className="p-3 bg-red-100 text-red-800 rounded-md">
                  ❌ {bookingError}
                </div>
              )}

              <div className="w-full flex gap-2">
                <div className="flex flex-col">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={data.name}
                    onChange={(e) => {
                      dataSetter("name", e.target.value);
                    }}
                    className="border border-[#3C3D37] rounded-sm outline-none px-1 w-full"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="text"
                    id="phone"
                    onChange={(e) => {
                      // Only allow numbers
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      dataSetter("phoneNumber", value);
                    }}
                    value={data.phoneNumber}
                    className="border border-[#3C3D37] rounded-sm outline-none px-1 w-full"
                    inputMode="numeric"
                    maxLength={11}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  onChange={(e) => {
                    dataSetter("address", e.target.value);
                  }}
                  value={data.address}
                  className="border border-[#3C3D37] rounded-sm outline-none px-1 w-full"
                />
              </div>
              <div className="w-full flex justify-around border border-[#3C3D37] rounded-sm mt-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="focus:outline-0 p-[5px] cursor-pointer flex items-center justify-between w-full bg-white text-black rounded-md">
                      <p>
                        {data.dateRange.startDate && data.dateRange.endDate
                          ? data.dateRange.startDate.toLocaleDateString(
                              "en-US",
                              dateFormatOptions
                            ) +
                            " - " +
                            data.dateRange.endDate.toLocaleDateString(
                              "en-US",
                              dateFormatOptions
                            )
                          : "Select Duration"}
                      </p>
                      <CalendarIcon className="h-[20px]" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="w-full p-0 border-none"
                  >
                    <Calendar
                      mode="range"
                      numberOfMonths={2}
                      selected={date}
                      onSelect={setDate}
                      className="rounded-lg border shadow-sm"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="w-full">
                <p>
                  No. of nights:{" "}
                  <b className=" font-semibold">{data.nightCount}</b>
                </p>
                <p>
                  Total Amount to Pay:{" "}
                  <b className="before:content-['₱'] font-semibold">
                    {data.totalPrice?.toLocaleString() ?? "0"}
                  </b>
                </p>
              </div>
              <button
                onClick={handleConfirmBooking}
                disabled={isBooking || bookingSuccess}
                className="w-full py-2 bg-[#3C3D37] text-[#EEEEEE] border rounded-sm border-[#3C3D37] cursor-pointer hover:bg-white hover:text-[#3C3D37] transition-all ease-in-out duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBooking ? "Processing..." : "Confirm Booking"}
              </button>

              <button
                onClick={() => setBookNow(false)}
                className="w-full py-2 bg-gray-200 text-gray-700 border rounded-sm border-gray-300 cursor-pointer hover:bg-gray-300 transition-all ease-in-out duration-200"
              >
                Back
              </button>
            </div>
          ) : (
            <div className="p-[15px] py-[20px] flex flex-col gap-5 bg-[#FFFFFF] rounded-md max-w-[450px] w-full min-w-[300px] h-fit">
              <p className="font-medium text-[17px] before:content-['₱']">
                {room.price?.toLocaleString() ?? "0"} per night
              </p>

              <div className="w-full flex flex-col gap-2">
                <p className="text-[15px] font-medium">Features</p>
                <div className="w-full flex gap-2 flex-wrap">
                  {room.features?.map((feature, index) => (
                    <SmallCard key={index} text={feature} />
                  ))}
                </div>
              </div>

              <div className="w-full flex flex-col gap-2">
                <p className="text-[15px] font-medium">Facilities</p>
                <div className="w-full flex gap-2 flex-wrap">
                  {room.facilities?.map((facility, index) => (
                    <SmallCard key={index} text={facility} />
                  ))}
                </div>
              </div>

              <div className="w-full flex flex-col gap-2">
                <p className="text-[15px] font-medium">Guests</p>
                <div className="w-full flex gap-2 flex-wrap">
                  {room.guests?.map((guest, index) => (
                    <SmallCard key={index} text={guest} />
                  ))}
                </div>
              </div>

              <div className="w-full flex flex-col gap-2">
                <p className="text-[15px] font-medium">Area</p>
                <div className="w-full flex gap-2 flex-wrap">
                  <SmallCard text={room.area} />
                </div>
              </div>

              <button
                onClick={handleOnClick}
                className="w-full py-2 bg-[#3C3D37] text-[#EEEEEE] border rounded-sm border-[#3C3D37] cursor-pointer hover:bg-white hover:text-[#3C3D37] transition-all ease-in-out duration-200"
              >
                Book Now
              </button>
            </div>
          )}
        </div>
        {/* lower part */}
        <div className="w-full flex flex-col gap-2">
          <p className="font-semibold">Description</p>
          <div className="w-full bg-[#FFFFFF] p-[15px] rounded-md">
            {room.description}
          </div>
        </div>
      </div>
    </div>
  );
}
