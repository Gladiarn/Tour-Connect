import React, { useEffect, useState, useCallback, useRef } from "react";
import { popularDestinationsDisplayTypes } from "../types";
import Pagination from "../Pagination/Pagination";
import MainCard from "../Card/MainCard";

export default function PopularDestinations() {
  const [data, setData] = useState<popularDestinationsDisplayTypes[]>([]);
  const [paginated, setPaginated] = useState<popularDestinationsDisplayTypes[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<
    popularDestinationsDisplayTypes[]
  >([]);

  const searchRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 3;
  const [inputValue, setInputValue] = useState<string>("1");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Handle pagination
  const handlePagination = useCallback(
    (page: number) => {
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setPaginated(data.slice(startIndex, endIndex));
      setCurrentPage(page);
      setInputValue(page.toString());
    },
    [data, itemsPerPage]
  );

  // Fetch data with search
  const fetchPopularDestinations = useCallback(async (search: string = "") => {
    setIsLoading(true);
    try {
      // Option 1: Using POST with body
      const res = await fetch("http://localhost:5000/api/destination/popular", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search }),
      });

      const result = await res.json();
      console.log("Fetched data:", result);
      setData(result);

      // Reset to first page when new search
      setCurrentPage(1);
      setInputValue("1");
    } catch (error) {
      console.error("Failed to fetch popular destinations:", error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch suggestions as user types
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      // Fetch quick suggestions (limit to 5)
      const res = await fetch("http://localhost:5000/api/destination/popular", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search: query }),
      });

      const result = await res.json();
      setSuggestions(result.slice(0, 5));
      setShowSuggestions(result.length > 0);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      setSuggestions([]);
    }
  }, []);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Debounced search for suggestions
    const timeoutId = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  // Handle search button click
  const handleSearch = () => {
    fetchPopularDestinations(searchQuery);
    setShowSuggestions(false);
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (
    destination: popularDestinationsDisplayTypes
  ) => {
    setSearchQuery(destination.name);
    // Search with the destination name
    fetchPopularDestinations(destination.name);
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update pagination when data changes
  useEffect(() => {
    if (data.length > 0) {
      handlePagination(1);
    } else {
      setPaginated([]);
    }
  }, [data, handlePagination]);

  // Fetch initial data on component mount
  useEffect(() => {
    fetchPopularDestinations("");
  }, [fetchPopularDestinations]);

  if (isLoading && data.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading popular destinations...</div>
      </div>
    );
  }

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
        <div className="w-full max-w-[1400px] flex flex-col gap-[20px]">
          <p className="flex font-bold text-[32px] lg:text-[64px] text-white">
            Popular Destination
          </p>
          <p className="flex font-light text-[14px] lg:text-[26px] text-white text-start">
            Discover the beauty of Eastern Visayas – from pristine beaches to
            hidden gems in the mountains.
          </p>

          {/* Search Section */}
          <div className="w-full flex gap-5 relative" ref={searchRef}>
            <div className="w-full flex relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                className="w-full bg-white px-4 py-3 rounded-l-md outline-0 text-black"
                placeholder="Search destinations by name, location, or activity..."
              />
              <button
                onClick={handleSearch}
                className="px-4 py-3 bg-[#3C3D37] rounded-r-md cursor-pointer hover:bg-[#626459] disabled:opacity-50 disabled:cursor-not-allowed transition-colors ease-in-out duration-200"
              >
                Explore
              </button>

              {/* Suggestions Modal */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                  {suggestions.map((destination, index) => (
                    <div
                      key={destination._id || index}
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                      onClick={() => handleSuggestionClick(destination)}
                    >
                      <div className="font-medium text-gray-800">
                        {destination.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {destination.location}
                      </div>
                      <div className="text-xs text-gray-500">
                        {destination.activityType}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="w-full h-fit p-[30px] flex flex-col gap-[40px] items-center 2xl:px-[150px]">
        {data.length === 0 && !isLoading ? (
          <div className="text-center py-10">
            <div className="text-lg text-gray-600 mb-4">
              No destinations match your search
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                fetchPopularDestinations("");
              }}
              className="px-4 py-2 bg-[#3C3D37] text-white rounded-md hover:bg-[#626459] transition-colors"
            >
              Show All Destinations
            </button>
          </div>
        ) : (
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
                <MainCard info={info} key={info._id || index} />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                handlePagination={handlePagination}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
