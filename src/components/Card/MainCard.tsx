import Image from "next/image";
import React from "react";
import { destinationsDisplayTypes } from "../types";
import StarRating from "../ui/StarRating";
import Link from "next/link";

export default function MainCard({ info }: { info: destinationsDisplayTypes }) {
  return (
    <div
      className="flex flex-col w-full  overflow-hidden rounded-md
      "
    >
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
          <p className="text-[13px] text-gray-400">{info.location}</p>
        </div>

        <div className="flex justify-between">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarRating
                clickable={false}
                value={star}
                key={star}
                reference={info.reference}
                currentRating={info.rating}
              />
            ))}
          </div>

          <Link
            href={`/ViewDestination/${info.reference}`}
            className="px-4 py-2 text-white border border-white rounded-sm bg-[#3C3D37] hover:bg-white hover:text-[#3C3D37] hover:border-[#3C3D37] cursor-pointer transition-colors ease-in-out duration-200"
          >
            View More
          </Link>
        </div>
      </div>
    </div>
  );
}
