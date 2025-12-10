import React, { useCallback, useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
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
import Pagination from "../Pagination/Pagination";

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "2-digit",
};

export default function Packages() {
  const [data, setData] = useState<packagesDisplayTypes[]>([]);
  const [paginated, setPaginated] = useState<packagesDisplayTypes[]>([]);
  const itemsPerPage = 2;
  const [inputValue, setInputValue] = useState<string>("1");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePagination = useCallback(
    (page: number) => {
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setPaginated(data.slice(startIndex, endIndex));
      setCurrentPage(page);
      setInputValue(page.toString());
    },
    [data]
  );

  useEffect(() => {
    handlePagination(1);
  }, [handlePagination]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/packages/all");

        if (!response.ok) {
          throw new Error(`Failed to fetch packages: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setData(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch packages");
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    fetchPackages();
  }, []);

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
        className="w-full flex items-center justify-center h-fit gap-[20px] lg:gap-[30px] p-[30px] py-[50px]"
        style={{
          backgroundImage: "url('/images/packages.avif')",
          backgroundSize: "cover",
          backgroundPosition: "30% 59%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="w-full max-w-[1200px] flex flex-col gap-[20px]">
          <p className="flex font-bold text-[32px] lg:text-[64px] text-white">
            Discover Adventure Packages
          </p>
          <p className="flex font-light text-[14px] lg:text-[26px] text-white text-center">
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
      </div>

      {/* Cards Section */}
      <div className="w-full h-fit p-[30px] flex flex-col gap-[40px] items-center 2xl:px-[300px]">
        {paginated?.map((packages, index) => (
          <PackageCard key={index} packages={packages} />
        ))}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePagination={handlePagination}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />
      </div>
    </div>
  );
}
