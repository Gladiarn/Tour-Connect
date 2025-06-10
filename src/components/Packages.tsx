import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineStarBorder } from "react-icons/md";
import { MdOutlineStar } from "react-icons/md";
import { DatePickerRange } from "./ui/DatePickerRange";
import { DateRange } from "react-day-picker";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import packagesDataTypes from "./types";

export default function Packages() {
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
  const dataSetter = <K extends keyof packagesDataTypes>(key: K, value: packagesDataTypes[K]) => {

    setPackagesData((prevData)=>({
      ...prevData,
      [key]:value
    }))
  };

  return (
    <div className="flex flex-col w-full h-fit bg-white">
      <div
        className="flex flex-col w-full items-center justify-center h-fit gap-[30px] pl-[300px] pt-[130px] pr-[300px] pb-[20px]"
        style={{
          backgroundImage: "url('/images/packages.avif')",
          backgroundSize: "100%", // or 100%, 90%, etc.
          backgroundPosition: "30% 59%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <p className="flex font-bold text-[64px] text-white">
          Discover Adventure Packages
        </p>
        <p className="flex font-normal text-[26px] text-white">
          Curated experiences across the breathtaking spots of Eastern Visayas
        </p>

        <div className="flex w-full font-black h-fit gap-[30px] px-[10px] items-center justify-center py-[10px] text-[#3C3D37] ">
          <div className="flex items-center justify-between bg-white rounded-[10px] w-full h-fit font-medium text-[19px] relative ">
            <Popover>
              <PopoverTrigger asChild>
                <div
                  ref={triggerRef}
                  className="flex-grow focus:outline-0 p-[10px] cursor-pointer flex items-center justify-between"
                >
                  <p>
                    {packagesData.tourType
                      ? packagesData.tourType
                      : "Tour Type"}
                  </p>
                  <button className="flex items-center">
                    <IoIosArrowDown size={25} />
                  </button>
                </div>
              </PopoverTrigger>
              <PopoverContent align="start" style={{ width }} className="p-4">
                <div className="flex flex-col gap-1">
                  {tourTypesData.map((tour, index) => (
                    <div
                      onClick={() => {
                        dataSetter("tourType", tour)
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
          <div className="flex items-center justify-between rounded-[10px] w-full h-fit">
            <DatePickerRange
              className="w-full h-full"
              date={date}
              setDate={setDate}
            />
          </div>
          <div className="flex items-center justify-between bg-white py-[10px] px-[10px] rounded-[10px] w-full h-fit font-medium text-[19px] relative ">
            <input
              type="text"
              className="flex-grow focus:outline-0"
              placeholder="Price Range"
              value={packagesData.priceRange}
            />
            <button className="flex items-center cursor-pointer">
              <IoIosArrowDown size={25} />
            </button>
          </div>
        </div>
      </div>
      <div className="flex w-full h-fit bg-white gap-[30px] flex-wrap items-center justify-center px-[180px] py-[20px]">
        <div className="flex flex-col w-[525px] h-[307px]">
          <div
            className="flex w-full rounded-t-[10px] h-[173px]"
            style={{
              backgroundImage: "url('/images/kalanggaman.jpg')",
              backgroundSize: "100%", // or 100%, 90%, etc.
              backgroundPosition: "30% 10%",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <div className="flex flex-col w-full px-[10px] py-[10px] ">
            <p className="flex font-medium text-[25px] text-black">
              Kalanggaman Island
            </p>
            <p className="flex font-normal text-[20px] text-black">
              Palompon, Leyte
            </p>
            <div className="flex w-full h-fit bg-white gap-[250px]">
              <div className="flex w-full h-fit">
                <MdOutlineStarBorder className="flex h-[30px] w-[30px] text-yellow-500" />
                <MdOutlineStarBorder className="flex h-[30px] w-[30px] text-yellow-500" />
                <MdOutlineStarBorder className="flex h-[30px] w-[30px] text-yellow-500" />
                <MdOutlineStarBorder className="flex h-[30px] w-[30px] text-yellow-500" />
                <MdOutlineStarBorder className="flex h-[30px] w-[30px] text-yellow-500" />
              </div>

              <button
                className="flex w-full h-fit cursor-pointer py-[10px] gap-[10px] bg-[#3C3D37] items-center justify-center rounded-[10px] text-white"
                onClick={() => {
                  alert(
                    packagesData.tourType
                  );
                }}
              >
                View More
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-[525px] h-[307px]">
          <div
            className="flex w-full rounded-t-[10px] h-[173px]"
            style={{
              backgroundImage: "url('/images/cave.jpg')",
              backgroundSize: "100%", // or 100%, 90%, etc.
              backgroundPosition: "30% 80%",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <div className="flex flex-col w-full px-[10px] py-[10px] ">
            <p className="flex font-medium text-[25px] text-black">
              Sohoton Cave
            </p>
            <p className="flex font-normal text-[20px] text-black">
              Basey, Samar
            </p>
            <div className="flex w-full h-fit bg-white gap-[250px]">
              <div className="flex w-full h-fit">
                <MdOutlineStar className="flex h-[30px] w-[30px] text-yellow-500" />
                <MdOutlineStarBorder className="flex h-[30px] w-[30px] text-yellow-500" />
                <MdOutlineStarBorder className="flex h-[30px] w-[30px] text-yellow-500" />
                <MdOutlineStarBorder className="flex h-[30px] w-[30px] text-yellow-500" />
                <MdOutlineStarBorder className="flex h-[30px] w-[30px] text-yellow-500" />
              </div>

              <button className="flex w-full h-fit cursor-pointer py-[10px] gap-[10px] bg-[#3C3D37] items-center justify-center rounded-[10px] text-white">
                View More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
