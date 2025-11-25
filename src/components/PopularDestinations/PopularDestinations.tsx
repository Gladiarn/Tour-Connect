import React, { useEffect, useState } from "react";
import { popularDestinationsDisplayTypes } from "../types";
import Pagination from "../Pagination/Pagination";
import MainCard from "../Card/MainCard";

const data = [
  {
    id: 1,
    name: "Kalanggaman Island",
    activityType: "Island",
    rating: 3.2,
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
    id: 2,
    name: "Kalanggaman Island",
    activityType: "Island",
    rating: 3.3,
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
    id: 3,
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

export default function PopularDestinations() {
  const [paginated, setPaginated] = useState<popularDestinationsDisplayTypes[]>(
    []
  );
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
