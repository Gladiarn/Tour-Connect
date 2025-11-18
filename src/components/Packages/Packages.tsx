import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
// import { DatePickerRange } from "../ui/DatePickerRange";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { packagesDataTypes, packagesDisplayTypes } from "../types";
import { Calendar as CalendarIcon } from "lucide-react";
import PackageCard from "./PackageCard";

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "2-digit",
};

export default function Packages() {


const [packagesDisplay, setPackagesDisplay] = useState<packagesDisplayTypes[]>([
  {
    name: "Kalanggaman Island Tour",
    location: "Palompon, Leyte",
    inclusions: [
      "Boat Transfer",
      "Entrance Fee",
      "Lunch Buffet",
      "Tour Guide"
    ],
    price: 12500,
    images: [
      "https://www.vacationhive.com/images/hives/13/13-kalanggaman-island-secondary-banner.jpg",
      "https://www.divescotty.com/images/social-media/kalanggaman-island_1440.jpg",
      "https://cebutrip.net/files/4f2cd067d3fc8dd7d2dc80366c6a6690.jpg"
    ],
    packsize: {
      min: 2,
      max: 5
    }
  },
    {
    name: "Kalanggaman Island Tour",
    location: "Palompon, Leyte",
    inclusions: [
      "Boat Transfer",
      "Entrance Fee",
      "Lunch Buffet",
      "Tour Guide"
    ],
    price: 12500,
    images: [
      "https://www.vacationhive.com/images/hives/13/13-kalanggaman-island-secondary-banner.jpg",
      "https://www.divescotty.com/images/social-media/kalanggaman-island_1440.jpg",
      "https://cebutrip.net/files/4f2cd067d3fc8dd7d2dc80366c6a6690.jpg"
    ],
    packsize: {
      min: 2,
      max: 5
    }
  },
    {
    name: "Kalanggaman Island Tour",
    location: "Palompon, Leyte",
    inclusions: [
      "Boat Transfer",
      "Entrance Fee",
      "Lunch Buffet",
      "Tour Guide"
    ],
    price: 12500,
    images: [
      "https://www.vacationhive.com/images/hives/13/13-kalanggaman-island-secondary-banner.jpg",
      "https://www.divescotty.com/images/social-media/kalanggaman-island_1440.jpg",
      "https://cebutrip.net/files/4f2cd067d3fc8dd7d2dc80366c6a6690.jpg"
    ],
    packsize: {
      min: 2,
      max: 5
    }
  }
]);

  const tourTypesData: string[] = ["Beach", "Hiking", "Cultural", "Adventure"];
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (triggerRef.current) {
      setWidth(triggerRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    if (date?.from && date?.to) {
      setPackagesData((prevData) => ({
        ...prevData,
        dateRange: { startDate: date.from, endDate: date.to },
      }));
    }
  }, [date]);

  const [packagesData, setPackagesData] = useState<packagesDataTypes>({
    tourType: "",
    dateRange: { startDate: undefined, endDate: undefined },
    priceRange: "",
  });

  const dataSetter = <K extends keyof packagesDataTypes>(
    key: K,
    value: packagesDataTypes[K]
  ) => {
    setPackagesData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  return (
    <div className="flex flex-col w-full h-fit bg-white">
      <div
        className="flex flex-col w-full items-center justify-center h-fit gap-[20px] lg:gap-[30px] p-[30px] py-[50px]"
        style={{
          backgroundImage: "url('/images/packages.avif')",
          backgroundSize: "cover",
          backgroundPosition: "30% 59%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <p className="flex font-bold text-[32px] lg:text-[64px] text-white">
          Discover Adventure Packages
        </p>
        <p className="flex font-normal text-[14px] lg:text-[26px] text-white text-center">
          Curated experiences across the breathtaking spots of Eastern Visayas
        </p>

        <div className="max-w-[1200px] w-full flex gap-5">
          <div className="w-full">
            <Popover>
              <PopoverTrigger asChild>
                <div
                  ref={triggerRef}
                  className="focus:outline-0 p-[10px] cursor-pointer flex items-center justify-between w-full bg-white text-black rounded-md"
                >
                  <p>
                    {packagesData.tourType
                      ? packagesData.tourType
                      : "Tour Type"}
                  </p>
                  <button className="flex items-center cursor-pointer">
                    <IoIosArrowDown size={25} />
                  </button>
                </div>
              </PopoverTrigger>
              <PopoverContent align="start" style={{ width }} className="p-4">
                <div className="flex flex-col gap-1">
                  {tourTypesData.map((tour, index) => (
                    <div
                      onClick={() => {
                        dataSetter("tourType", tour);
                      }}
                      className="p-1 hover:text-blue-500 cursor-pointer text-[17px]"
                      key={index}
                    >
                      {tour}
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="w-full">
            <Popover>
              <PopoverTrigger asChild>
                <div className="focus:outline-0 p-[10px] cursor-pointer flex items-center justify-between w-full bg-white text-black rounded-md">
                  <p>
                    {packagesData.dateRange.startDate &&
                    packagesData.dateRange.endDate
                      ? packagesData.dateRange.startDate.toLocaleDateString(
                          "en-US",
                          dateFormatOptions
                        ) +
                        " - " +
                        packagesData.dateRange.endDate.toLocaleDateString(
                          "en-US",
                          dateFormatOptions
                        )
                      : "Select Duration"}
                  </p>
                  <CalendarIcon className="h-[20px]" />
                </div>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-full p-0 border-none">
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
            <Popover>
              <PopoverTrigger asChild>
                <div
                  ref={triggerRef}
                  className="focus:outline-0 p-[10px] cursor-pointer flex items-center justify-between w-full bg-white text-black rounded-md"
                >
                  <p>
                    {packagesData.priceRange
                      ? packagesData.priceRange
                      : "Price Range"}
                  </p>
                  <button className="flex items-center">
                    <IoIosArrowDown size={25} />
                  </button>
                </div>
              </PopoverTrigger>
              <PopoverContent align="start" style={{ width }} className="p-4">
                <div className="flex flex-col gap-1">
                  <p
                    className="p-1 hover:text-blue-500 cursor-pointer text-[17px]"
                    onClick={() => dataSetter("priceRange", "1,000 - 2,000")}
                  >
                    1,000 - 5,000
                  </p>
                  <p
                    className="p-1 hover:text-blue-500 cursor-pointer text-[17px]"
                    onClick={() => dataSetter("priceRange", "2,000 - 3,000")}
                  >
                    5,000 - 10,000
                  </p>
                  <p
                    className="p-1 hover:text-blue-500 cursor-pointer text-[17px]"
                    onClick={() => dataSetter("priceRange", "3,000 - 4,000")}
                  >
                    10,000 - 15,000
                  </p>

                                    <p
                    className="p-1 hover:text-blue-500 cursor-pointer text-[17px]"
                    onClick={() => dataSetter("priceRange", "3,000 - 4,000")}
                  >
                    15,000+
                  </p>

                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="w-full border h-fit p-[30px] flex flex-col gap-[30px] items-center">
            {
              packagesDisplay?.map((packages, index)=> (
                <PackageCard key={index} packages={packages}/>
              ))
            }
      </div>
    </div>
  );
}
