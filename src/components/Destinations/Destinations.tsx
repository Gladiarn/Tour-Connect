import React, { useCallback, useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
// import { DatePickerRange } from "../ui/DatePickerRange";
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
  const totalPages = Math.ceil(data?.length / itemsPerPage);

   useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/destination/all");
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setData([]);
      }
    };
    
    fetchData();
  }, []);


  const handlePagination = useCallback(
    (page: number) => {
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setPaginated(data?.slice(startIndex, endIndex));
      setCurrentPage(page);
      setInputValue(page.toString());
    },
    [data]
  );

  useEffect(() => {
    handlePagination(1);
  }, [handlePagination]);

  const activityTypeData: string[] = [
    "Swimming",
    "Hiking",
    "Sight Seeing",
    "Adventure",
  ];
  const provincesData: string[] = ["Cebu", "Palawan", "Bohol", "Leyte"];

  const triggerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (triggerRef.current) {
      setWidth(triggerRef.current.offsetWidth);
    }
  }, []);

  const [destinationsData, setDestinationsData] =
    useState<destinationsDataTypes>({
      province: "",
      activityType: "",
      priceRange: "",
    });

  const dataSetter = <K extends keyof destinationsDataTypes>(
    key: K,
    value: destinationsDataTypes[K]
  ) => {
    setDestinationsData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  return (
    <div className="flex flex-col w-full h-fit bg-white">
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
            <div className="w-full">
              <Popover>
                <PopoverTrigger asChild>
                  <div
                    ref={triggerRef}
                    className="focus:outline-0 p-[10px] cursor-pointer flex items-center justify-between w-full bg-white text-black rounded-md"
                  >
                    <p>
                      {destinationsData.province
                        ? destinationsData.province
                        : "Province"}
                    </p>
                    <button className="flex items-center cursor-pointer">
                      <IoIosArrowDown size={25} />
                    </button>
                  </div>
                </PopoverTrigger>
                <PopoverContent align="start" style={{ width }} className="p-4">
                  <div className="flex flex-col gap-1">
                    {provincesData.map((province, index) => (
                      <div
                        onClick={() => {
                          dataSetter("province", province);
                        }}
                        className="p-1 hover:text-blue-500 cursor-pointer text-[17px]"
                        key={index}
                      >
                        {province}
                      </div>
                    ))}
                  </div>
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
                      {destinationsData.activityType
                        ? destinationsData.activityType
                        : "Activity Type"}
                    </p>
                    <button className="flex items-center cursor-pointer">
                      <IoIosArrowDown size={25} />
                    </button>
                  </div>
                </PopoverTrigger>
                <PopoverContent align="start" style={{ width }} className="p-4">
                  <div className="flex flex-col gap-1">
                    {activityTypeData.map((activity, index) => (
                      <div
                        onClick={() => {
                          dataSetter("activityType", activity);
                        }}
                        className="p-1 hover:text-blue-500 cursor-pointer text-[17px]"
                        key={index}
                      >
                        {activity}
                      </div>
                    ))}
                  </div>
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
                      {destinationsData.priceRange
                        ? destinationsData.priceRange
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
      <div className="w-full h-fit p-[30px] flex flex-col gap-[40px] items-center 2xl:px-[150px]">
        <div
          key={currentPage}
          className="grid gap-7 max-w-[1450px] w-full
    grid-cols-1 
    md:grid-cols-2
    xl:grid-cols-3
    mx-auto justify-items-center"
        >
          {paginated && paginated.map((info, index) => (
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
