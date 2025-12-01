import React, { useCallback, useEffect, useState } from "react";
import { destinationsDisplayTypes, hotelsTypes } from "@/components/types";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";
import Pagination from "@/components/Pagination/Pagination";
import HotelCard from "@/components/Card/HotelCard";
import { useRouter } from "next/router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DestinationModal from "@/components/Modal/DestinationModal";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function ViewDestination() {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  const [destination, setDestination] =
    useState<destinationsDisplayTypes | null>(null);
  const [hotels, setHotels] = useState<hotelsTypes[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDestinationAndHotels = useCallback(async () => {
    try {
      const destinationRes = await fetch(
        `http://localhost:5000/api/destination/${id}`
      );
      const destinationData = await destinationRes.json();
      setDestination(destinationData);

      await fetchNearbyHotels(destinationData.location);
    } catch (error) {
      console.error("Error:", error);
    }
  }, [id]);

  const fetchNearbyHotels = async (location: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/hotels/location?location=${location}`
      );
      const data = await response.json();
      console.log(data);
      setHotels(data || []);
    } catch (error) {
      console.error("Failed to fetch hotels:", error);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDestinationAndHotels();
    }
  }, [id, fetchDestinationAndHotels]);

  const [paginated, setPaginated] = useState<hotelsTypes[]>([]);
  const itemsPerPage = 3;
  const [inputValue, setInputValue] = useState<string>("1");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = Math.ceil(hotels.length / itemsPerPage);

  const handlePagination = useCallback(
    (page: number) => {
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setPaginated(hotels.slice(startIndex, endIndex));
      setCurrentPage(page);
      setInputValue(page.toString());
    },
    [hotels]
  );

  useEffect(() => {
    handlePagination(1);
  }, [hotels, handlePagination]);

  // add to fav
  const addToFavorites = async (destinationReference: string) => {
console.log(destinationReference)
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No access token found");
        router.push("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/bookings/favorites/add",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reference: destinationReference }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add to favorites");
      }

      console.log("✅ Added to favorites:", data);
      return data;
    } catch (error) {
      console.error("❌ Error adding to favorites:", error);
      throw error;
    }
  };

  // remove to fav
  // const removeFromFavorites = async (destinationReference: string) => {
  //   try {
  //     const token = localStorage.getItem("accessToken");
  //     if (!token) {
  //       console.error("No access token found");
  //       router.push("/login");
  //       return;
  //     }

  //     const response = await fetch(
  //       `http://localhost:5000/api/bookings/favorites/remove/${destinationReference}`,
  //       {
  //         method: "DELETE",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.message || "Failed to remove from favorites");
  //     }

  //     console.log("✅ Removed from favorites:", data);
  //     return data;
  //   } catch (error) {
  //     console.error("❌ Error removing from favorites:", error);
  //     throw error;
  //   }
  // };

  return (
    <div className="w-full bg-white pt-[50px] flex flex-col">
      {/* Head */}
      <div
        className={`w-full h-[500px] bg-cover bg-center bg-no-repeat flex flex-col justify-end`}
        style={{
          backgroundImage: `url(${destination?.images[0]})`,
        }}
      >
        <div className="w-full px-5 pb-5">
          <Swiper
            slidesPerView="auto"
            spaceBetween={15}
            centeredSlides={false}
            centerInsufficientSlides={true}
          >
            {destination?.images.map((image, index) => (
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
              <p className="text-[25px] font-semibold">{destination?.name}</p>
              <p className="text-[14px]">{destination?.location}</p>
            </div>
            <div>
              <p className="font-semibold text-[17px]">Description</p>
              <p className="text-[15px]">{destination?.description}</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <p className="font-semibold">Best time to visit</p>
              <p className="text-[15px]">{destination?.bestTimeToVisit}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold">Estimated budget</p>
              <p className="text-[15px]">{destination?.budget}</p>
            </div>
            <div className="flex gap-5 p-[10px]">
              <button
                onClick={() => {
                  addToFavorites(destination?.reference || "")
                }}
                className="px-4 py-2 rounded-md bg-[#C3B40E] text-white text-nowrap cursor-pointer hover:bg-[#C3B40E]/70 "
              >
                Favorite
              </button>

              <Dialog>
                <DialogTrigger>
                  {!user ? (
                    <Link
                      href="/login"
                      className="text-nowrap text-white bg-[#3C3D37] border border-white rounded-md px-4 py-2 cursor-pointer hover:border-[#3C3D37] hover:bg-white hover:text-[#3C3D37] transition-all ease-in-out duration-200"
                    >
                      Book Now
                    </Link>
                  ) : (
                    <p className="text-nowrap text-white bg-[#3C3D37] border border-white rounded-md px-4 py-2 cursor-pointer hover:border-[#3C3D37] hover:bg-white hover:text-[#3C3D37] transition-all ease-in-out duration-200">
                      Book Now
                    </p>
                  )}
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                  <DestinationModal destination={destination} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        <div className="bg-[#EEEEEE] rounded-md px-[15px] p-[10px]">
          <p className="text-[17px] font-semibold">
            Things to know before you go
          </p>
          <ul className="list-disc list-inside space-y-1">
            {destination?.tips.map((tip, index) => (
              <li key={index} className="text-[15px]">
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full h-fit p-[30px] flex flex-col gap-[40px] items-center 2xl:px-[150px]">
          <div className="w-full flex justify-start">
            <p className="font-semibold text-[17px] p-[30px]">
              Hotels near {destination?.name}
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
            {!loading &&
              paginated.map((info, index) => (
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
