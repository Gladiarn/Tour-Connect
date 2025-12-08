import { packagesDisplayTypes } from "@/components/types";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { MapPinCheckInside, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import PackageModal from "@/components/Modal/PackageModal";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

export default function ViewPackagePage() {
  const { user } = useAuth();
  const [destination, setDestination] = useState<packagesDisplayTypes | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { reference } = router.query;

  useEffect(() => {
    const fetchPackage = async () => {
      if (!reference) return;

      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/packages/${reference}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch package: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setDestination(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch package");
        }
      } catch (error) {
        console.error("Error fetching package:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [reference]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Loading package...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Error: {error}
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Package not found
      </div>
    );
  }

  return (
    <div className="w-full bg-[#EEEEEE] pt-[80px] flex flex-col">
      {/* Head */}
      <div
        className={`w-full bg-cover bg-center bg-no-repeat flex flex-col gap-5 px-[30px] pb-[30px]`}
      >
        <div className="w-full pb-5">
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

        <div className="w-full text-[#3C3D37] ">
          <p className="text-[24px] font-semibold">{destination.name}</p>
          <span className="flex items-center gap-1">
            <MapPinCheckInside className="" />
            <p className="font-semibold">{destination.location} </p>
          </span>
        </div>
      </div>
      {/* Body */}
      <div className="w-full bg-white p-[30px] text-[#3C3D37] flex md:flex-row flex-col gap-5">
        <div className="w-full flex flex-col gap-5">
          <div className="w-full flex flex-col gap-2">
            <p className="font-semibold">Description</p>
            <p className="text-[15px]">{destination.description}</p>
          </div>
          <div className="w-full flex flex-col gap-1">
            <p className="font-semibold">Good for</p>
            <div className="flex items-center gap-1">
              <Users className="h-[18px] w-[18px]" />
              <p className="text-[15px] after:content-['_people']">
                {destination.packsize.min} - {destination.packsize.max}
              </p>
            </div>
          </div>
          <div className="w-full flex flex-col gap-2">
            <p className="font-semibold">Inclusions</p>
            <ul className="pl-2 text-green-800">
              {destination.inclusions.map((inclusion, index) => (
                <li key={index} className="list-disc list-inside text-[15px]">
                  {inclusion}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-[28px] font-semibold before:content-['₱'] before:font-medium">
            {destination.price.toLocaleString()}
          </p>

          {/* Dialog for Package Booking */}
          <Dialog>
            <DialogTrigger asChild>
              {!user ? (
                <Link
                  href="/login"
                  className="min-w-[250px] text-center text-white bg-[#3C3D37] border border-white rounded-md px-4 py-2 w-full cursor-pointer hover:border-[#3C3D37] hover:bg-white hover:text-[#3C3D37] transition-all ease-in-out duration-200 text-[18px] text-nowrap"
                >
                  Book Now
                </Link>
              ) : (
                <button className="min-w-[250px] text-center text-white bg-[#3C3D37] border border-white rounded-md px-4 py-2 w-full cursor-pointer hover:border-[#3C3D37] hover:bg-white hover:text-[#3C3D37] transition-all ease-in-out duration-200 text-[18px] text-nowrap">
                  Book Now
                </button>
              )}
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Book Package</DialogTitle>
                <DialogDescription>
                  Complete your booking for {destination.name}
                </DialogDescription>
              </DialogHeader>
              <PackageModal packageItem={destination} />
            </DialogContent>
          </Dialog>

          <div className="flex flex-col gap-1">
            <p className="font-semibold">Payment Method</p>
            <p className="before:content-['₱'] after:content-['_per_head'] text-[15px]">
              {destination.pricePerHead}
            </p>
          </div>
          <div className="flex flex-col gap-1 mt-2">
            <p className="font-semibold">Duration</p>
            <p className="text-[15px]">{destination.duration}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
