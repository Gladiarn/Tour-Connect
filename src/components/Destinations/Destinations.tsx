import React, { useEffect, useRef, useState } from "react";
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

const data = [
  {
    name: "Kalanggaman Island",
    activityType: "Island",
    rating: 3.4,
    images: [
      "https://media.istockphoto.com/id/1213315764/photo/kalanggaman-island-malapascua-the-philippines-aerial-photograph.webp?a=1&b=1&s=612x612&w=0&k=20&c=rxwJ8GHw7ja40Fjrjn4OBzA93Tt5dwMwc3s4zmSiG1o=",
      "https://media.istockphoto.com/id/514741984/photo/tropical-beach-kalanggaman-island.webp?a=1&b=1&s=612x612&w=0&k=20&c=N37LRI4EY9pTIDa1A2HUUKbo8H67dRmYH3Fyo6YK1n0=",
      "https://media.istockphoto.com/id/1203022831/photo/the-idyllic-kalanggaman-island-near-leyte-in-the-philippines.webp?a=1&b=1&s=612x612&w=0&k=20&c=7ZD7Y6YQfOL5ai5XEBi4gliAMndkqf3BOrGT49Mt47w=",
    ],
    description:
      "Experience the pristine white sandbar and crystal-clear turquoise waters of Kalanggaman Island, a paradise perfect for swimming, snorkeling, and beach camping.",
    budget: 12500,
    location: "Palompon, Leyte",
    bestTimeToVisit: "March to June",
    tips: [
      "Book tours in advance during peak season",
      "Bring waterproof bags for your belongings",
      "Apply reef-safe sunscreen to protect marine life",
      "Pack enough water and snacks",
    ],
    reference: "ABC-123",
  },
  {
    name: "Kalanggaman Island",
    activityType: "Island",
    rating: 4.5,
    images: [
      "https://media.istockphoto.com/id/1213315764/photo/kalanggaman-island-malapascua-the-philippines-aerial-photograph.webp?a=1&b=1&s=612x612&w=0&k=20&c=rxwJ8GHw7ja40Fjrjn4OBzA93Tt5dwMwc3s4zmSiG1o=",
      "https://media.istockphoto.com/id/514741984/photo/tropical-beach-kalanggaman-island.webp?a=1&b=1&s=612x612&w=0&k=20&c=N37LRI4EY9pTIDa1A2HUUKbo8H67dRmYH3Fyo6YK1n0=",
      "https://media.istockphoto.com/id/1203022831/photo/the-idyllic-kalanggaman-island-near-leyte-in-the-philippines.webp?a=1&b=1&s=612x612&w=0&k=20&c=7ZD7Y6YQfOL5ai5XEBi4gliAMndkqf3BOrGT49Mt47w=",
    ],
    description:
      "Experience the pristine white sandbar and crystal-clear turquoise waters of Kalanggaman Island, a paradise perfect for swimming, snorkeling, and beach camping.",
    budget: 12500,
    location: "Palompon, Leyte",
    bestTimeToVisit: "March to June",
    tips: [
      "Book tours in advance during peak season",
      "Bring waterproof bags for your belongings",
      "Apply reef-safe sunscreen to protect marine life",
      "Pack enough water and snacks",
    ],
    reference: "ABC-123",
  },
  {
    name: "Kalanggaman Island",
    activityType: "Island",
    rating: 4.8,
    images: [
      "https://media.istockphoto.com/id/1213315764/photo/kalanggaman-island-malapascua-the-philippines-aerial-photograph.webp?a=1&b=1&s=612x612&w=0&k=20&c=rxwJ8GHw7ja40Fjrjn4OBzA93Tt5dwMwc3s4zmSiG1o=",
      "https://media.istockphoto.com/id/514741984/photo/tropical-beach-kalanggaman-island.webp?a=1&b=1&s=612x612&w=0&k=20&c=N37LRI4EY9pTIDa1A2HUUKbo8H67dRmYH3Fyo6YK1n0=",
      "https://media.istockphoto.com/id/1203022831/photo/the-idyllic-kalanggaman-island-near-leyte-in-the-philippines.webp?a=1&b=1&s=612x612&w=0&k=20&c=7ZD7Y6YQfOL5ai5XEBi4gliAMndkqf3BOrGT49Mt47w=",
    ],
    description:
      "Experience the pristine white sandbar and crystal-clear turquoise waters of Kalanggaman Island, a paradise perfect for swimming, snorkeling, and beach camping.",
    budget: 12500,
    location: "Palompon, Leyte",
    bestTimeToVisit: "March to June",
    tips: [
      "Book tours in advance during peak season",
      "Bring waterproof bags for your belongings",
      "Apply reef-safe sunscreen to protect marine life",
      "Pack enough water and snacks",
    ],
    reference: "ABC-123",
  },
];

export default function Destinations() {
  const [paginated, setPaginated] = useState<destinationsDisplayTypes[]>([]);
  const itemsPerPage = 3;
  const [inputValue, setInputValue] = useState<string>("1");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePagination = (page: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginated(data.slice(startIndex, endIndex));
    setCurrentPage(page);
    setInputValue(page.toString());
  };
  useEffect(() => {
    handlePagination(1);
  }, []);

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
          backgroundImage: "url('/images/packages.avif')",
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
