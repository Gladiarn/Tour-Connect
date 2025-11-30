import React, { useEffect, useState, useCallback } from "react";
import { popularDestinationsDisplayTypes } from "../types";
import Pagination from "../Pagination/Pagination";
import MainCard from "../Card/MainCard";

export default function PopularDestinations() {
  const [data, setData] = useState<popularDestinationsDisplayTypes[]>([]);
  const [paginated, setPaginated] = useState<popularDestinationsDisplayTypes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const itemsPerPage = 3;
  const [inputValue, setInputValue] = useState<string>("1");
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchPopularDestinations = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/destination/popular");
        const result = await res.json();
        console.log(result)
        setData(result);
      } catch (error) {
        console.error("Failed to fetch popular destinations:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularDestinations();
  }, []);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePagination = useCallback((page: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginated(data.slice(startIndex, endIndex));
    setCurrentPage(page);
    setInputValue(page.toString());
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      handlePagination(1);
    }
  }, [data, handlePagination]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Loading popular destinations...</div>
      </div>
    );
  }

 
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>No popular destinations found</div>
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

          <div className="w-full flex gap-5">
            <div className="w-full flex">
              <input
                type="text"
                className="w-full bg-white px-4 py-3 rounded-l-md outline-0 text-black"
                placeholder="Search..."
              />
              <button className="px-4 py-3 bg-[#3C3D37] rounded-r-md cursor-pointer hover:bg-[#626459] transition-colors ease-in-out duration-200">
                Explore
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="w-full h-fit p-[30px] flex flex-col gap-[40px] items-center 2xl:px-[150px]">
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
      </div>
    </div>
  );
}