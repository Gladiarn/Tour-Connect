import Image from "next/image";
import React from "react";
import { hotelsTypes } from "../types";
import StarRating from "../ui/StarRating";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Swiper, SwiperSlide } from "swiper/react";

// Import required Swiper modules and styles
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import Link from "next/link";

export default function HotelCard({ info}: { info: hotelsTypes }) {
  return (
    <div className="flex flex-col w-full overflow-hidden rounded-md">
      <div className="relative overflow-hidden aspect-[16/7] sm:h-[200px] rounded-b-none">
        <Image
          src={info.images[0]}
          fill
          className="object-cover object-center"
          alt={info.name}
        />
      </div>
      <div className="p-[10px] text-[#3C3D37] flex flex-col gap-5">
        <div className="flex flex-col">
          <p className="text-[20px] font-semibold">{info.name}</p>
          <p className="text-[13px] text-gray-400">{info.duration}</p>
        </div>

        <div className="flex gap-2 sm:justify-between flex-col sm:flex-row">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarRating
                clickable={false}
                value={star}
                key={star}
                currentRating={info.rating}
              />
            ))}
          </div>

          <Dialog>
            <DialogTrigger>
              <button className="text-nowrap px-4 py-2 text-white border border-white rounded-sm bg-[#3C3D37] hover:bg-white hover:text-[#3C3D37] hover:border-[#3C3D37] cursor-pointer transition-colors ease-in-out duration-200">
                View More
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <div className="w-full h-full flex flex-col gap-5 items-center text-[#3C3D37] overflow-x-hidden">
                <p className="text-[18px] font-semibold">{info.name}</p>
                <div className="w-full">
                  <Swiper
                    modules={[FreeMode]}
                    slidesPerView={1.2}
                    spaceBetween={15}
                    freeMode={true}
                    breakpoints={{
                      640: {
                        slidesPerView: 2.2,
                        spaceBetween: 15,
                      },
                      768: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                      },
                      1024: {
                        slidesPerView: 3,
                        spaceBetween: 25,
                      },
                    }}
                  >
                    {info.images.map((image, index) => (
                      <SwiperSlide key={index}>
                        <div className="relative w-full h-[220px] overflow-hidden rounded-lg shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)]">
                          <Image
                            src={image}
                            fill
                            alt={`${info.name} image ${index + 1}`}
                            className="object-cover"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                <div className="w-full flex flex-col gap-3">
                  <p className="text-[18px] font-semibold">Room Types</p>
                  <div className="w-full">
                    <Swiper
                      modules={[FreeMode]}
                      slidesPerView={1.2}
                      spaceBetween={15}
                      freeMode={true}
                      breakpoints={{
                        640: {
                          slidesPerView: 2.2,
                          spaceBetween: 15,
                        },
                        768: {
                          slidesPerView: 3,
                          spaceBetween: 20,
                        },
                        1024: {
                          slidesPerView: 3,
                          spaceBetween: 25,
                        },
                      }}
                    >
                      {info.rooms.map((room, index) => (
                        <SwiperSlide key={index}>
                          <div className="relative w-full h-[150px] overflow-hidden rounded-lg shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)]">
                            <Image
                              src={room.image}
                              fill
                              alt={`${info.name} image ${index + 1}`}
                              className="object-cover"
                            />
                          </div>
                          <div className="p-1 flex flex-col">
                            <p className="font-semibold">{room.name}</p>
                            <ul className="list-disc list-inside space-y-1 p-2">
                              {room.features
                                .slice(0, 3)
                                .map((feature, index) => (
                                  <li key={index} className="text-[15px]">
                                    {feature}
                                  </li>
                                ))}
                            </ul>
                            <Link
                              href={`${info.reference}/ViewRoom/${room.roomReference}`}
                              className="text-center text-white bg-[#3C3D37] border border-white rounded-md px-4 py-2 w-full cursor-pointer hover:border-[#3C3D37] hover:bg-white hover:text-[#3C3D37] transition-all ease-in-out duration-200"
                            >
                              View Room
                            </Link>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
