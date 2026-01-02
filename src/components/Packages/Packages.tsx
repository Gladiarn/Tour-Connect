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

// ==================== PROFESSIONAL FETCH UTILITY ====================
class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: 'NETWORK_ERROR' | 'TIMEOUT' | 'SERVER_ERROR' | 'CLIENT_ERROR'
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Type guard for ApiError
const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
};

// Type guard for AbortError
const isAbortError = (error: unknown): error is DOMException => {
  return error instanceof DOMException && error.name === 'AbortError';
};

// Type guard for TypeError with Failed to fetch message
const isNetworkError = (error: unknown): error is TypeError => {
  return error instanceof TypeError && error.message === 'Failed to fetch';
};

// Professional fetch wrapper with timeout and better error handling
const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout = 8000 // 8 second timeout
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error; // Re-throw for the caller to handle
  }
};

// Main API fetch function - accepts partial filters
const fetchPackagesApi = async (
  filters: Partial<packagesDataTypes> // Changed to Partial
): Promise<packagesDisplayTypes[]> => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  // Provide defaults for all properties
  const safeFilters: packagesDataTypes = {
    tourType: filters.tourType || "",
    packSize: filters.packSize || "",
    priceRange: filters.priceRange || ""
  };
  
  try {
    const response = await fetchWithTimeout(
      `${API_URL}/api/packages/filter`,
      {
        method: 'POST',
        body: JSON.stringify(safeFilters),
      }
    );

    // Handle HTTP error statuses
    if (!response.ok) {
      let errorMessage = `Server error: ${response.status}`;
      
      // Try to get error message from response body
      try {
        const errorData = await response.clone().json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Response is not JSON, that's ok
      }
      
      if (response.status >= 500) {
        throw new ApiError(errorMessage, response.status, 'SERVER_ERROR');
      } else {
        throw new ApiError(errorMessage, response.status, 'CLIENT_ERROR');
      }
    }

    // Parse successful response
    const result = await response.json();
    
    if (result.success) {
      return result.data || [];
    } else {
      throw new ApiError(
        result.message || 'Failed to fetch packages',
        200,
        'SERVER_ERROR'
      );
    }
    
  } catch (error: unknown) {
    // Handle network and timeout errors
    if (isApiError(error)) {
      throw error; // Re-throw our custom errors
    } else if (isAbortError(error)) {
      throw new ApiError('Request timeout. Please try again.', 0, 'TIMEOUT');
    } else if (isNetworkError(error)) {
      throw new ApiError('Cannot connect to server. Please check your connection.', 0, 'NETWORK_ERROR');
    } else {
      // Unknown error
      console.error('Unknown fetch error:', error);
      throw new ApiError('An unexpected error occurred', 0, 'NETWORK_ERROR');
    }
  }
};
// ==================== END PROFESSIONAL UTILITIES ====================

export default function Packages() {
  const [data, setData] = useState<packagesDisplayTypes[]>([]);
  const [paginated, setPaginated] = useState<packagesDisplayTypes[]>([]);
  const itemsPerPage = 2;
  const [inputValue, setInputValue] = useState<string>("1");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Professional state management
  const [packagesData, setPackagesData] = useState<packagesDataTypes>({
    tourType: "",
    packSize: "",
    priceRange: "",
  });

  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  // Pagination handler
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

  // Update paginated data
  useEffect(() => {
    if (data.length > 0) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const newPaginated = data.slice(startIndex, endIndex);
      setPaginated(newPaginated);
    }
  }, [data, currentPage]);

  // Main fetch function using professional utility
  const fetchFilteredPackages = useCallback(async () => {
    setIsLoading(true);
    setIsFiltering(true);
    setError(null);
    setPaginated([]);
    
    try {
      const packages = await fetchPackagesApi(packagesData);
      setData(packages);
      setCurrentPage(1);
      setInputValue("1");
      setRetryCount(0); // Reset retry count on success
    } catch (err: unknown) {
      // Type-safe error handling
      if (isApiError(err)) {
        setError(err);
      } else {
        // Fallback for unexpected errors
        setError(new ApiError('An unexpected error occurred', 0, 'NETWORK_ERROR'));
      }
      
      setData([]); // Clear data on error
      setPaginated([]);
      
      // Auto-retry logic for network errors (max 2 retries)
      if (isApiError(err) && err.code === 'NETWORK_ERROR' && retryCount < 2) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchFilteredPackages();
        }, 2000 * (retryCount + 1)); // Exponential backoff: 2s, 4s
      }
    } finally {
      setIsLoading(false);
      setIsFiltering(false);
    }
  }, [packagesData, retryCount]);

  // Initial fetch on mount - FIXED: Can now pass empty object
  useEffect(() => {
    const fetchInitialPackages = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const packages = await fetchPackagesApi({}); // Now works with empty object
        setData(packages);
      } catch (err: unknown) {
        if (isApiError(err)) {
          setError(err);
        } else {
          setError(new ApiError('An unexpected error occurred', 0, 'NETWORK_ERROR'));
        }
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialPackages();
  }, []);

  // Debounced filter fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFilteredPackages();
    }, 300); // Increased debounce for better UX

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

  const clearAllFilters = () => {
    setPackagesData({
      tourType: "",
      packSize: "",
      priceRange: "",
    });
  };

  const retryFetch = () => {
    setRetryCount(0);
    setError(null);
    fetchFilteredPackages();
  };


  const getErrorMessage = (error: ApiError | null) => {
    if (!error) return '';
    
    switch (error.code) {
      case 'NETWORK_ERROR':
        return 'Cannot connect to server. Please check your internet connection.';
      case 'TIMEOUT':
        return 'Request timed out. The server is taking too long to respond.';
      case 'SERVER_ERROR':
        return `Server error: ${error.message}`;
      case 'CLIENT_ERROR':
        return `Error: ${error.message}`;
      default:
        return 'An unexpected error occurred.';
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="w-full h-fit p-[30px] flex flex-col gap-[40px] items-center 2xl:px-[300px]">
      {[1, 2].map((i) => (
        <div key={i} className="w-full animate-pulse">
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      ))}
    </div>
  );

  // Error state component
  const ErrorState = ({ error, onRetry }: { error: ApiError; onRetry: () => void }) => (
    <div className="w-full h-fit p-[30px] flex flex-col items-center justify-center 2xl:px-[300px] min-h-[400px]">
      <div className="text-center max-w-md">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {error.code === 'NETWORK_ERROR' ? 'Connection Error' : 'Something went wrong'}
        </h3>
        <p className="text-gray-600 mb-6">{getErrorMessage(error)}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onRetry}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
          {error.code === 'NETWORK_ERROR' && (
            <button
              onClick={clearAllFilters}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
        {retryCount > 0 && (
          <p className="text-sm text-gray-500 mt-4">
            Attempt {retryCount + 1} of 3
          </p>
        )}
      </div>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="text-gray-400 text-5xl mb-4">📦</div>
      <p className="text-gray-500 text-lg mb-2">No packages found</p>
      <p className="text-gray-400 text-sm mb-6">
        Try adjusting your filters or clear them to see all packages
      </p>
      <button
        onClick={clearAllFilters}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="flex flex-col w-full h-fit min-h-[570px] bg-white">
      {/* Hero Section with Filters */}
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
                    <IoIosArrowDown size={25} />
                  </div>
                </PopoverTrigger>
                <PopoverContent align="start" style={{ width }} className="p-4">
                  <div className="flex flex-col gap-1">
                    <div
                      onClick={() => dataSetter("tourType", "")}
                      className="p-1 hover:text-blue-500 cursor-pointer text-[17px] text-gray-400"
                    >
                      Clear selection
                    </div>
                    {tourTypesData.map((tour, index) => (
                      <div
                        onClick={() => dataSetter("tourType", tour)}
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
                    className="focus:outline-0 p-[10px] cursor-pointer flex items-center justify-between w-full bg-white text-black rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <p className={packagesData.packSize ? "font-medium" : "text-gray-500"}>
                      {packagesData.packSize || "Pack Size"}
                    </p>
                    <IoIosArrowDown size={25} />
                  </div>
                </PopoverTrigger>
                <PopoverContent align="start" style={{ width }} className="p-4">
                  <div className="flex flex-col gap-1">
                    <div
                      onClick={() => dataSetter("packSize", "")}
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
                    className="focus:outline-0 p-[10px] cursor-pointer flex items-center justify-between w-full bg-white text-black rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <p className={packagesData.priceRange ? "font-medium" : "text-gray-500"}>
                      {packagesData.priceRange || "Price Range"}
                    </p>
                    <IoIosArrowDown size={25} />
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

      {/* Main Content Area */}
      {isLoading && !isFiltering ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState error={error} onRetry={retryFetch} />
      ) : (
        <div className="w-full h-fit p-[30px] flex flex-col gap-[40px] items-center 2xl:px-[300px]">
          {/* Filtering indicator */}
          {isFiltering && (
            <div className="w-full flex justify-center">
              <div className="flex items-center gap-2 text-blue-500">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                <span className="text-sm">Updating results...</span>
              </div>
            </div>
          )}

          {/* Results */}
          {paginated.length > 0 ? (
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
            <EmptyState />
          )}
        </div>
      )}
    </div>
  );
}