import React, { useCallback, useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { packagesDataTypes, packagesDisplayTypes } from "../types";
import PackageCard from "./PackageCard";
import Pagination from "../Pagination/Pagination";

export default function Packages() {
  const [data, setData] = useState<packagesDisplayTypes[]>([]);
  const [paginated, setPaginated] = useState<packagesDisplayTypes[]>([]);
  const itemsPerPage = 2;
  const [inputValue, setInputValue] = useState<string>("1");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const [packagesData, setPackagesData] = useState<packagesDataTypes>({
    tourType: "",
    packSize: "",
    priceRange: "",
  });

  // Add a state to track if data is being fetched
  const [isFiltering, setIsFiltering] = useState<boolean>(false);

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

  // Update paginated data when data or currentPage changes
  useEffect(() => {
    if (data.length > 0) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const newPaginated = data.slice(startIndex, endIndex);
      setPaginated(newPaginated);
    }
  }, [data, currentPage]);

  // Fetch filtered packages
  const fetchFilteredPackages = useCallback(async () => {
    setIsLoading(true);
    setIsFiltering(true); // Start filtering
    setError(null);
    setPaginated([]); // Clear paginated data immediately to prevent glitch
    
    try {
      const response = await fetch("http://localhost:5000/api/packages/filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(packagesData),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch packages: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setData(result.data);
        setCurrentPage(1);
        setInputValue("1");
      } else {
        throw new Error(result.message || "Failed to fetch packages");
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
      setIsFiltering(false); // End filtering
    }
  },[packagesData]);

  // Fetch all packages on initial load
  useEffect(() => {
    const fetchInitialPackages = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/packages/filter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch packages: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setData(result.data);
        } else {
          throw new Error(result.message || "Failed to fetch packages");
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialPackages();
  }, []);

  // Refetch when filters change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFilteredPackages();
    }, 150);

    return () => clearTimeout(timer);
  }, [packagesData, fetchFilteredPackages]);

  const tourTypesData: string[] = ["Beach", "Hiking", "Cultural", "Adventure"];
  const packSizeOptions = ["1 - 5", "1 - 10", "1 - 15", "15+"];
  const priceRangeOptions = ["1,000 - 5,000", "5,000 - 10,000", "10,000 - 15,000", "15,000+"];

  const triggerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (triggerRef.current) {
      setWidth(triggerRef.current.offsetWidth);
    }
  }, []);

  const dataSetter = <K extends keyof packagesDataTypes>(
    key: K,
    value: packagesDataTypes[K]
  ) => {
    setPackagesData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setPackagesData({
      tourType: "",
      packSize: "",
      priceRange: "",
    });
  };

  return (
    <div className="flex flex-col w-full h-fit min-h-[570px] bg-white">
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
            {/* Tour Type Filter */}
            <div className="w-full">
              <Popover>
                <PopoverTrigger asChild>
                  <div
                    ref={triggerRef}
                    className="focus:outline-0 p-[10px] cursor-pointer flex items-center justify-between w-full bg-white text-black rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <p className={packagesData.tourType ? "font-medium" : "text-gray-500"}>
                      {packagesData.tourType || "Tour Type"}
                    </p>
                    <button className="flex items-center cursor-pointer">
                      <IoIosArrowDown size={25} />
                    </button>
                  </div>
                </PopoverTrigger>
                <PopoverContent align="start" style={{ width }} className="p-4">
                  <div className="flex flex-col gap-1">
                    <div
                      onClick={() => {
                        dataSetter("tourType", "");
                      }}
                      className="p-1 hover:text-blue-500 cursor-pointer text-[17px] text-gray-400"
                    >
                      Clear selection
                    </div>
                    {tourTypesData.map((tour, index) => (
                      <div
                        onClick={() => {
                          dataSetter("tourType", tour);
                        }}
                        className={`p-1 hover:text-blue-500 cursor-pointer text-[17px] ${packagesData.tourType === tour ? "text-blue-600 font-medium" : ""}`}
                        key={index}
                      >
                        {tour}
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Pack Size Filter */}
            <div className="w-full">
              <Popover>
                <PopoverTrigger asChild>
                  <div
                    ref={triggerRef}
                    className="focus:outline-0 p-[10px] cursor-pointer flex items-center justify-between w-full bg-white text-black rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <p className={packagesData.packSize ? "font-medium" : "text-gray-500"}>
                      {packagesData.packSize || "Pack Size"}
                    </p>
                    <button className="flex items-center">
                      <IoIosArrowDown size={25} />
                    </button>
                  </div>
                </PopoverTrigger>
                <PopoverContent align="start" style={{ width }} className="p-4">
                  <div className="flex flex-col gap-1">
                    <div
                      onClick={() => {
                        dataSetter("packSize", "");
                      }}
                      className="p-1 hover:text-blue-500 cursor-pointer text-[17px] text-gray-400"
                    >
                      Clear selection
                    </div>
                    {packSizeOptions.map((size, index) => (
                      <p
                        key={index}
                        className={`p-1 hover:text-blue-500 cursor-pointer text-[17px] ${packagesData.packSize === size ? "text-blue-600 font-medium" : ""}`}
                        onClick={() => dataSetter("packSize", size)}
                      >
                        {size}
                      </p>
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
                    <p className={packagesData.priceRange ? "font-medium" : "text-gray-500"}>
                      {packagesData.priceRange || "Price Range"}
                    </p>
                    <button className="flex items-center">
                      <IoIosArrowDown size={25} />
                    </button>
                  </div>
                </PopoverTrigger>
                <PopoverContent align="start" style={{ width }} className="p-4">
                  <div className="flex flex-col gap-1">
                    <div
                      onClick={() => {
                        dataSetter("priceRange", "");
                      }}
                      className="p-1 hover:text-blue-500 cursor-pointer text-[17px] text-gray-400"
                    >
                      Clear selection
                    </div>
                    {priceRangeOptions.map((range, index) => (
                      <p
                        key={index}
                        className={`p-1 hover:text-blue-500 cursor-pointer text-[17px] ${packagesData.priceRange === range ? "text-blue-600 font-medium" : ""}`}
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

      {/* Loading and Error States */}
      {isLoading && (
        <div className="w-full p-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && !isLoading && (
        <div className="w-full p-8 flex justify-center">
          <div className="text-red-500 text-center">
            <p className="text-lg font-semibold">Error loading packages</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={fetchFilteredPackages}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Cards Section - Show empty state when filtering or when no data */}
      {!isLoading && !error && (
        <div className="w-full h-fit p-[30px] flex flex-col gap-[40px] items-center 2xl:px-[300px]">
          {/* Show loading spinner for filtering or empty state */}
          {isFiltering ? (
            <div className="w-full p-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : paginated.length > 0 ? (
            <>
              {paginated.map((packages, index) => (
                <PackageCard key={index} packages={packages} />
              ))}
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
              <p className="text-gray-500 text-lg">No packages found matching your filters</p>
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