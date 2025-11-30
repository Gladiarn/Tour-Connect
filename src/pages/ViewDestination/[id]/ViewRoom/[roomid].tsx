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
const dateFormatOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "2-digit",
};

export default function ViewRoomPage() {
  const router = useRouter();
  const { id, roomid } = router.query;

  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [hotel, setHotel] = useState<hotelsTypes | null>(null);
  const [room, setRoom] = useState<roomPageTypes | null>(null);
  const [loading, setLoading] = useState(true);

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
    roomReference: String(roomid) || "",
    hotelReference: String(id) || "",
  });

useEffect(() => {
  
  const fetchRoomData = async () => {
    if (!id || !roomid) {
      console.log('❌ Missing parameters');
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
    } catch (error) {
      console.error("❌ Error fetching room data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchRoomData();
}, [id, roomid]);

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

  const [bookNow, setBookNow] = useState<boolean>(false);

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
        Loading room...
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
            <p className="font-semibold">{room.name} - {hotel?.name}</p>
            <p className="before:content-['₱'] after:content-['_per_night']">
              {room.price?.toLocaleString() ?? "0"}
            </p>
          </div>

          {/* details */}

          {bookNow ? (
            <div className="p-[15px] py-[20px] flex flex-col gap-5 bg-[#FFFFFF] rounded-md max-w-[450px] w-full min-w-[300px] h-fit">
              <p className="font-semibold text-[15px]">BOOKING DETAILS</p>
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
                onClick={() => console.log(data)}
                className="w-full py-2 bg-[#3C3D37] text-[#EEEEEE] border rounded-sm border-[#3C3D37] cursor-pointer hover:bg-white hover:text-[#3C3D37] transition-all ease-in-out duration-200"
              >
                Confirm
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
                onClick={() => setBookNow(true)}
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
