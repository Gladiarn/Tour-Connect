import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { destinationsDisplayTypes, hotelsTypes } from "@/components/types";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";
import Pagination from "@/components/Pagination/Pagination";
import HotelCard from "@/components/Card/HotelCard";

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
      "Experience the pristine white sandbar and crystal-clear turquoise waters of Kalanggaman Island, a paradise perfect for swimming, snorkeling, and beach camping. Experience the pristine white sandbar and crystal-clear turquoise waters of Kalanggaman Island, a paradise perfect for swimming, snorkeling, and beach camping. ",
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

const hotels = [
  {
    id: 1,
    name: "Ocean Breeze Resort",
    images: [
      "https://media.istockphoto.com/id/1390168364/photo/pristine-and-turquoise-blue-green-beach-under-blue-sky-portuguese-island-in-maputo-mozambique.webp?a=1&b=1&s=612x612&w=0&k=20&c=BuIhVQEMx9SrmO1iv9Dmw9wMxtBhgx2UgCKGp6K1Bnc=",
      "https://media.istockphoto.com/id/1390168364/photo/pristine-and-turquoise-blue-green-beach-under-blue-sky-portuguese-island-in-maputo-mozambique.webp?a=1&b=1&s=612x612&w=0&k=20&c=BuIhVQEMx9SrmO1iv9Dmw9wMxtBhgx2UgCKGp6K1Bnc=",
      "https://media.istockphoto.com/id/1390168364/photo/pristine-and-turquoise-blue-green-beach-under-blue-sky-portuguese-island-in-maputo-mozambique.webp?a=1&b=1&s=612x612&w=0&k=20&c=BuIhVQEMx9SrmO1iv9Dmw9wMxtBhgx2UgCKGp6K1Bnc=",
      "https://media.istockphoto.com/id/1390168364/photo/pristine-and-turquoise-blue-green-beach-under-blue-sky-portuguese-island-in-maputo-mozambique.webp?a=1&b=1&s=612x612&w=0&k=20&c=BuIhVQEMx9SrmO1iv9Dmw9wMxtBhgx2UgCKGp6K1Bnc=",
      "https://media.istockphoto.com/id/1390168364/photo/pristine-and-turquoise-blue-green-beach-under-blue-sky-portuguese-island-in-maputo-mozambique.webp?a=1&b=1&s=612x612&w=0&k=20&c=BuIhVQEMx9SrmO1iv9Dmw9wMxtBhgx2UgCKGp6K1Bnc=",
      "https://media.istockphoto.com/id/1390168364/photo/pristine-and-turquoise-blue-green-beach-under-blue-sky-portuguese-island-in-maputo-mozambique.webp?a=1&b=1&s=612x612&w=0&k=20&c=BuIhVQEMx9SrmO1iv9Dmw9wMxtBhgx2UgCKGp6K1Bnc=",
    ],
    duration: "20 minutes by boat",
    rooms: [
      {
        id: 1,
        image:
          "https://media.istockphoto.com/id/1199804796/photo/portrait-of-tourist-woman-raised-her-hands-and-standing-nearly-window-looking-to-beautiful.webp?a=1&b=1&s=612x612&w=0&k=20&c=mSGn9G9SW4_mphJ1xKU_ad-xbLadiDpMH4vjTrpMldY=",
        name: "Deluxe Sea View Room",
        features: [
          "1 King-size bed",
          "Free breakfast",
          "Private balcony",
          "Air conditioning",
        ],
        facilities: [
          "Swimming pool",
          "Free WiFi",
          "Gym access",
          "Beachfront",
          "Restaurant",
        ],
        guests: ["2 adults", "2 children"],
        area: "250 sq. ft.",
        description:
          "A spacious room with a panoramic view of the ocean, perfect for couples or solo travelers seeking comfort and relaxation.",
        price: 4500,
      },
      {
        id: 2,
        image:
          "https://media.istockphoto.com/id/1199804796/photo/portrait-of-tourist-woman-raised-her-hands-and-standing-nearly-window-looking-to-beautiful.webp?a=1&b=1&s=612x612&w=0&k=20&c=mSGn9G9SW4_mphJ1xKU_ad-xbLadiDpMH4vjTrpMldY=",
        name: "Deluxe Sea View Room",
        features: [
          "1 King-size bed",
          "Free breakfast",
          "Private balcony",
          "Air conditioning",
        ],
        facilities: [
          "Swimming pool",
          "Free WiFi",
          "Gym access",
          "Beachfront",
          "Restaurant",
        ],
        guests: ["2 adults", "2 children"],
        area: "250 sq. ft.",
        description:
          "A spacious room with a panoramic view of the ocean, perfect for couples or solo travelers seeking comfort and relaxation.",
        price: 4500,
      },
      {
        id: 3,
        image:
          "https://media.istockphoto.com/id/1199804796/photo/portrait-of-tourist-woman-raised-her-hands-and-standing-nearly-window-looking-to-beautiful.webp?a=1&b=1&s=612x612&w=0&k=20&c=mSGn9G9SW4_mphJ1xKU_ad-xbLadiDpMH4vjTrpMldY=",
        name: "Deluxe Sea View Room",
        features: [
          "1 King-size bed",
          "Free breakfast",
          "Private balcony",
          "Air conditioning",
        ],
        facilities: [
          "Swimming pool",
          "Free WiFi",
          "Gym access",
          "Beachfront",
          "Restaurant",
        ],
        guests: ["2 adults", "2 children"],
        area: "250 sq. ft.",
        description:
          "A spacious room with a panoramic view of the ocean, perfect for couples or solo travelers seeking comfort and relaxation.",
        price: 4500,
      },
      {
        id: 4,
        image:
          "https://media.istockphoto.com/id/1199804796/photo/portrait-of-tourist-woman-raised-her-hands-and-standing-nearly-window-looking-to-beautiful.webp?a=1&b=1&s=612x612&w=0&k=20&c=mSGn9G9SW4_mphJ1xKU_ad-xbLadiDpMH4vjTrpMldY=",
        name: "Deluxe Sea View Room",
        features: [
          "1 King-size bed",
          "Free breakfast",
          "Private balcony",
          "Air conditioning",
        ],
        facilities: [
          "Swimming pool",
          "Free WiFi",
          "Gym access",
          "Beachfront",
          "Restaurant",
        ],
        guests: ["2 adults", "2 children"],
        area: "250 sq. ft.",
        description:
          "A spacious room with a panoramic view of the ocean, perfect for couples or solo travelers seeking comfort and relaxation.",
        price: 4500,
      },
    ],
    rating: 1.6,
  },
  {
    id: 2,
    name: "Ocean Breeze Resort",
    images: [
      "https://media.istockphoto.com/id/1390168364/photo/pristine-and-turquoise-blue-green-beach-under-blue-sky-portuguese-island-in-maputo-mozambique.webp?a=1&b=1&s=612x612&w=0&k=20&c=BuIhVQEMx9SrmO1iv9Dmw9wMxtBhgx2UgCKGp6K1Bnc=",
      "https://media.istockphoto.com/id/1390168364/photo/pristine-and-turquoise-blue-green-beach-under-blue-sky-portuguese-island-in-maputo-mozambique.webp?a=1&b=1&s=612x612&w=0&k=20&c=BuIhVQEMx9SrmO1iv9Dmw9wMxtBhgx2UgCKGp6K1Bnc=",
      "https://media.istockphoto.com/id/1390168364/photo/pristine-and-turquoise-blue-green-beach-under-blue-sky-portuguese-island-in-maputo-mozambique.webp?a=1&b=1&s=612x612&w=0&k=20&c=BuIhVQEMx9SrmO1iv9Dmw9wMxtBhgx2UgCKGp6K1Bnc=",
    ],
    duration: "20 minutes by boat",
    rooms: [
      {
        id: 5,
        image:
          "https://media.istockphoto.com/id/1199804796/photo/portrait-of-tourist-woman-raised-her-hands-and-standing-nearly-window-looking-to-beautiful.webp?a=1&b=1&s=612x612&w=0&k=20&c=mSGn9G9SW4_mphJ1xKU_ad-xbLadiDpMH4vjTrpMldY=",
        name: "Deluxe Sea View Room",
        features: [
          "1 King-size bed",
          "Free breakfast",
          "Private balcony",
          "Air conditioning",
        ],
        facilities: [
          "Swimming pool",
          "Free WiFi",
          "Gym access",
          "Beachfront",
          "Restaurant",
        ],
        guests: ["2 adults", "2 children"],
        area: "250 sq. ft.",
        description:
          "A spacious room with a panoramic view of the ocean, perfect for couples or solo travelers seeking comfort and relaxation.",
        price: 4500,
      },
    ],
    rating: 1.6,
  },
  {
    id: 3,
    name: "Ocean Breeze Resort",
    images: [
      "https://media.istockphoto.com/id/1390168364/photo/pristine-and-turquoise-blue-green-beach-under-blue-sky-portuguese-island-in-maputo-mozambique.webp?a=1&b=1&s=612x612&w=0&k=20&c=BuIhVQEMx9SrmO1iv9Dmw9wMxtBhgx2UgCKGp6K1Bnc=",
      "https://media.istockphoto.com/id/1390168364/photo/pristine-and-turquoise-blue-green-beach-under-blue-sky-portuguese-island-in-maputo-mozambique.webp?a=1&b=1&s=612x612&w=0&k=20&c=BuIhVQEMx9SrmO1iv9Dmw9wMxtBhgx2UgCKGp6K1Bnc=",
      "https://media.istockphoto.com/id/1390168364/photo/pristine-and-turquoise-blue-green-beach-under-blue-sky-portuguese-island-in-maputo-mozambique.webp?a=1&b=1&s=612x612&w=0&k=20&c=BuIhVQEMx9SrmO1iv9Dmw9wMxtBhgx2UgCKGp6K1Bnc=",
    ],
    duration: "20 minutes by boat",
    rooms: [
      {
        id: 6,
        image:
          "https://media.istockphoto.com/id/1199804796/photo/portrait-of-tourist-woman-raised-her-hands-and-standing-nearly-window-looking-to-beautiful.webp?a=1&b=1&s=612x612&w=0&k=20&c=mSGn9G9SW4_mphJ1xKU_ad-xbLadiDpMH4vjTrpMldY=",
        name: "Deluxe Sea View Room",
        features: [
          "1 King-size bed",
          "Free breakfast",
          "Private balcony",
          "Air conditioning",
        ],
        guests: ["2 adults", "2 children"],
        area: "250 sq. ft.",
        facilities: [
          "Swimming pool",
          "Free WiFi",
          "Gym access",
          "Beachfront",
          "Restaurant",
        ],
        description:
          "A spacious room with a panoramic view of the ocean, perfect for couples or solo travelers seeking comfort and relaxation.",
        price: 4500,
      },
    ],
    rating: 1.6,
  },
  {
    id: 4,
    name: "Ocean Breeze Resort",
    images: [
      "https://media.istockphoto.com/id/1390168364/photo/pristine-and-turquoise-blue-green-beach-under-blue-sky-portuguese-island-in-maputo-mozambique.webp?a=1&b=1&s=612x612&w=0&k=20&c=BuIhVQEMx9SrmO1iv9Dmw9wMxtBhgx2UgCKGp6K1Bnc=",
      "https://media.istockphoto.com/id/1390168364/photo/pristine-and-turquoise-blue-green-beach-under-blue-sky-portuguese-island-in-maputo-mozambique.webp?a=1&b=1&s=612x612&w=0&k=20&c=BuIhVQEMx9SrmO1iv9Dmw9wMxtBhgx2UgCKGp6K1Bnc=",
      "https://media.istockphoto.com/id/1390168364/photo/pristine-and-turquoise-blue-green-beach-under-blue-sky-portuguese-island-in-maputo-mozambique.webp?a=1&b=1&s=612x612&w=0&k=20&c=BuIhVQEMx9SrmO1iv9Dmw9wMxtBhgx2UgCKGp6K1Bnc=",
    ],
    duration: "20 minutes by boat",
    rooms: [
      {
        id: 7,
        image:
          "https://media.istockphoto.com/id/1199804796/photo/portrait-of-tourist-woman-raised-her-hands-and-standing-nearly-window-looking-to-beautiful.webp?a=1&b=1&s=612x612&w=0&k=20&c=mSGn9G9SW4_mphJ1xKU_ad-xbLadiDpMH4vjTrpMldY=",
        name: "Deluxe Sea View Room",
        features: [
          "1 King-size bed",
          "Free breakfast",
          "Private balcony",
          "Air conditioning",
        ],
        facilities: [
          "Swimming pool",
          "Free WiFi",
          "Gym access",
          "Beachfront",
          "Restaurant",
        ],
        guests: ["2 adults", "2 children"],
        area: "250 sq. ft.",
        description:
          "A spacious room with a panoramic view of the ocean, perfect for couples or solo travelers seeking comfort and relaxation.",
        price: 4500,
      },
    ],
    rating: 1.6,
  },
];

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id;

  const destination = data.find((item) => item.id === Number(id));

  if (!destination) {
    return { notFound: true };
  }

  return {
    props: {
      destination,
    },
  };
};

export default function ViewDestination({
  destination,
}: {
  destination: destinationsDisplayTypes;
}) {
  const [paginated, setPaginated] = useState<hotelsTypes[]>([]);
  const itemsPerPage = 3;
  const [inputValue, setInputValue] = useState<string>("1");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = Math.ceil(hotels.length / itemsPerPage);

  const handlePagination = (page: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginated(hotels.slice(startIndex, endIndex));
    setCurrentPage(page);
    setInputValue(page.toString());
  };

  useEffect(() => {
    handlePagination(1);
  }, []);

  return (
    <div className="w-full bg-white pt-[50px] flex flex-col">
      {/* Head */}
      <div className=" w-full h-[500px] bg-[url(/images/kalanggaman.jpg)] bg-cover bg-center bg-no-repeat flex flex-col justify-end">
        <div className="w-full px-5 pb-5">
          <Swiper
            slidesPerView="auto"
            spaceBetween={15}
            centeredSlides={false}
            centerInsufficientSlides={true}
          >
            {destination.images.map((image, index) => (
              <SwiperSlide key={index} className="swiper-slide-custom">
                <div className="relative w-full h-[220px] overflow-hidden rounded-lg shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)]">
                  <Image src={image} fill alt="" className="object-cover" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      {/* Body */}
      <div className="w-full bg-white p-[30px] text-[#3C3D37] flex flex-col gap-6">
        <div className="w-full flex flex-col sm:flex-row gap-4">
          <div className="w-full flex flex-col gap-4">
            <div>
              <p className="text-[25px] font-semibold">{destination.name}</p>
              <p className="text-[14px]">{destination.location}</p>
            </div>
            <div>
              <p className="font-semibold text-[17px]">Description</p>
              <p className="text-[15px]">{destination.description}</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <p className="font-semibold">Best time to visit</p>
              <p className="text-[15px]">{destination.bestTimeToVisit}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold">Estimated budget</p>
              <p className="text-[15px]">{destination.budget}</p>
            </div>
            <div className="flex gap-4 p-[10px]">
              <button className="px-4 py-2 rounded-md bg-[#C3B40E] text-white text-nowrap cursor-pointer">
                Favorite
              </button>
              <button className="px-4 py-2 rounded-md bg-[#3C3D37] text-white text-nowrap cursor-pointer">
                Book Now
              </button>
            </div>
          </div>
        </div>
        <div className="bg-[#EEEEEE] rounded-md px-[15px] p-[10px]">
          <p className="text-[17px] font-semibold">
            Things to know before you go
          </p>
          <ul className="list-disc list-inside space-y-1">
            {destination.tips.map((tip, index) => (
              <li key={index} className="text-[15px]">
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full h-fit p-[30px] flex flex-col gap-[40px] items-center 2xl:px-[150px]">
          <div className="w-full flex justify-start">
            <p className="font-semibold text-[17px] p-[30px]">
              Hotels near {destination.name}
            </p>
          </div>

          <div
            key={currentPage}
            className="grid gap-7 max-w-[1450px] w-full
    grid-cols-1 
    md:grid-cols-2
    xl:grid-cols-3
    mx-auto justify-items-center"
          >
            {paginated.map((info, index) => (
              <HotelCard key={index} info={info} />
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
    </div>
  );
}
