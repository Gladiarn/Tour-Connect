import React, { useCallback, useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { destinationsDataTypes, destinationsDisplayTypes } from "../types";
import Pagination from "../Pagination/Pagination";
import MainCard from "../Card/MainCard";

export default function Destinations() {
  const [data, setData] = useState<destinationsDisplayTypes[]>([]);
  const [paginated, setPaginated] = useState<destinationsDisplayTypes[]>([]);
  const itemsPerPage = 3;
  const [inputValue, setInputValue] = useState<string>("1");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const totalPages = Math.ceil(data?.length / itemsPerPage);

  const [destinationsData, setDestinationsData] = useState<destinationsDataTypes>({
    province: "",
    activityType: "",
    priceRange: "",
  });

  // Add isFiltering state
  const [isFiltering, setIsFiltering] = useState<boolean>(false);

  const activityTypeData: string[] = ["Swimming", "Hiking", "Sight Seeing", "Adventure"];
  const provincesData: string[] = ["Cebu", "Palawan", "Bohol", "Leyte"];
  const priceRangeOptions = [
    "1,000 - 5,000",
    "5,000 - 10,000",
    "10,000 - 15,000",
    "15,000+"
  ];

  // Pagination handler
  const handlePagination = useCallback(
    (page: number) => {
      setCurrentPage(page);
      setInputValue(page.toString());
    },
    []
  );

  // Update paginated data when data or currentPage changes
  useEffect(() => {
    if (data.length > 0) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const newPaginated = data.slice(startIndex, endIndex);
      setPaginated(newPaginated);
    } else {
      setPaginated([]);
    }
  }, [data, currentPage, itemsPerPage]);

  const fetchDestinations = useCallback(async () => {
    setIsLoading(true);
    setIsFiltering(true); // Start filtering
    setError(null);
    setPaginated([]); // Clear paginated data immediately to prevent glitch
    
    try {
      const res = await fetch("http://localhost:5000/api/destination/filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(destinationsData),
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }

      const result = await res.json();
      if (result.success) {
        setData(result.data);
        setCurrentPage(1);
        setInputValue("1");
      } else {
        throw new Error(result.message || "Failed to fetch destinations");
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
      setIsFiltering(false); // End filtering
    }
  }, [destinationsData]);

  // Fetch all destinations on initial load
  useEffect(() => {
    const fetchInitialDestinations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/destination/filter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch destinations: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setData(result.data);
        } else {
          throw new Error(result.message || "Failed to fetch destinations");
        }
      } catch (error) {
        console.error("Error fetching destinations:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialDestinations();
  }, []);

  // Refetch when filters change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDestinations();
    }, 150); // Small debounce to prevent flickering

    return () => clearTimeout(timer);
  }, [destinationsData, fetchDestinations]);

  const triggerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (triggerRef.current) {
      setWidth(triggerRef.current.offsetWidth);
    }
  }, []);

  const dataSetter = <K extends keyof destinationsDataTypes>(
    key: K,
    value: destinationsDataTypes[K]
  ) => {
    setDestinationsData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setDestinationsData({
      province: "",
      activityType: "",
      priceRange: "",
    });
  };

  return (
    <div className="flex flex-col w-full h-fit min-h-[590px] bg-white">
      <div
        className="w-full flex items-center justify-center h-fit gap-[20px] lg:gap-[30px] p-[30px] py-[50px] pt-[130px]"
        style={{
          backgroundImage: "url('/images/des.png')",
          backgroundSize: "cover",
          backgroundPosition: "30% 59%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="w-full max-w-[1200px] flex flex-col gap-[20px] items-center">
          <p className="flex font-bold text-[32px] lg:text-[64px] text-white">
            Destinations
          </p>

          <div className="max-w-[1200px] w-full flex gap-5">
            {/* Province Filter */}
            <div className="w-full">
              <Popover>
                <PopoverTrigger asChild>
                  <div
                    ref={triggerRef}
                    className="focus:outline-0 p-[10px] cursor-pointer flex items-center justify-between w-full bg-white text-black rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <p className={destinationsData.province ? "font-medium" : "text-gray-500"}>
                      {destinationsData.province || "Province"}
                    </p>
                    <button className="flex items-center cursor-pointer">
                      <IoIosArrowDown size={25} />
                    </button>
                  </div>
                </PopoverTrigger>
                <PopoverContent align="start" style={{ width }} className="p-4">
                  <div className="flex flex-col gap-1">
                    <div
                      onClick={() => dataSetter("province", "")}
                      className="p-1 hover:text-blue-500 cursor-pointer text-[17px] text-gray-400"
                    >
                      Clear selection
                    </div>
                    {provincesData.map((province, index) => (
                      <div
                        onClick={() => dataSetter("province", province)}
                        className={`p-1 hover:text-blue-500 cursor-pointer text-[17px] ${
                          destinationsData.province === province ? "text-blue-600 font-medium" : ""
                        }`}
                        key={index}
                      >
                        {province}
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Activity Type Filter */}
            <div className="w-full">
              <Popover>
                <PopoverTrigger asChild>
                  <div
                    ref={triggerRef}
                    className="focus:outline-0 p-[10px] cursor-pointer flex items-center justify-between w-full bg-white text-black rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <p className={destinationsData.activityType ? "font-medium" : "text-gray-500"}>
                      {destinationsData.activityType || "Activity Type"}
                    </p>
                    <button className="flex items-center cursor-pointer">
                      <IoIosArrowDown size={25} />
                    </button>
                  </div>
                </PopoverTrigger>
                <PopoverContent align="start" style={{ width }} className="p-4">
                  <div className="flex flex-col gap-1">
                    <div
                      onClick={() => dataSetter("activityType", "")}
                      className="p-1 hover:text-blue-500 cursor-pointer text-[17px] text-gray-400"
                    >
                      Clear selection
                    </div>
                    {activityTypeData.map((activity, index) => (
                      <div
                        onClick={() => dataSetter("activityType", activity)}
                        className={`p-1 hover:text-blue-500 cursor-pointer text-[17px] ${
                          destinationsData.activityType === activity ? "text-blue-600 font-medium" : ""
                        }`}
                        key={index}
                      >
                        {activity}
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Price Range Filter */}
            <div className="w-full">
              <Popover>
                <PopoverTrigger asChild>
                  <div
                    ref={triggerRef}
                    className="focus:outline-0 p-[10px] cursor-pointer flex items-center justify-between w-full bg-white text-black rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <p className={destinationsData.priceRange ? "font-medium" : "text-gray-500"}>
                      {destinationsData.priceRange || "Price Range"}
                    </p>
                    <button className="flex items-center">
                      <IoIosArrowDown size={25} />
                    </button>
                  </div>
                </PopoverTrigger>
                <PopoverContent align="start" style={{ width }} className="p-4">
                  <div className="flex flex-col gap-1">
                    <div
                      onClick={() => dataSetter("priceRange", "")}
                      className="p-1 hover:text-blue-500 cursor-pointer text-[17px] text-gray-400"
                    >
                      Clear selection
                    </div>
                    {priceRangeOptions.map((range, index) => (
                      <p
                        key={index}
                        className={`p-1 hover:text-blue-500 cursor-pointer text-[17px] ${
                          destinationsData.priceRange === range ? "text-blue-600 font-medium" : ""
                        }`}
                        onClick={() => dataSetter("priceRange", range)}
                      >
                        {range}
                      </p>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="w-full p-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="w-full p-8 flex justify-center">
          <div className="text-red-500 text-center">
            <p className="text-lg font-semibold">Error loading destinations</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={fetchDestinations}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Cards Section - Show empty state when filtering or when no data */}
      {!isLoading && !error && (
        <div className="w-full h-fit p-[30px] flex flex-col gap-[40px] items-center 2xl:px-[150px]">
          {/* Show loading spinner for filtering or show cards/no results */}
          {isFiltering ? (
            <div className="w-full p-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : paginated.length > 0 ? (
            <>
              <div
                key={currentPage}
                className="grid gap-7 max-w-[1450px] w-full
                  grid-cols-1 
                  md:grid-cols-2
                  xl:grid-cols-3
                  mx-auto justify-items-center"
              >
                {paginated.map((info, index) => (
                  <MainCard info={info} key={index} />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                handlePagination={handlePagination}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No destinations found matching your filters</p>
              <button
                onClick={clearAllFilters}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}