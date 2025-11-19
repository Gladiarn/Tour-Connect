import React from "react";
import { packagesDisplayTypes } from "../types";
import Image from "next/image";

export default function PackageCard({
  packages,
}: {
  packages: packagesDisplayTypes;
}) {
  return (
    <div className="w-full flex flex-col sm:flex-row sm:gap-[30px]">
      <div className="sm:max-w-[500px] flex-1 h-[250px] sm:h-[350px] flex flex-col gap-2 sm:order-1 order-2 rounded-md overflow-hidden">
        <div className="relative w-full h-[125px] sm:h-[175px]">
          <Image
            src={packages.images[0]}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px"
            className="object-cover object-center"
            alt={packages.name}
          />
        </div>
        <div className="flex gap-2 w-full h-[125px] sm:h-[175px]">
          {packages.images.slice(1, 3).map((img, index) => (
            <div className="relative w-1/2 h-full" key={index}>
              <Image
                src={img}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 250px"
                className="object-cover object-center"
                alt={packages.name}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="text-[#3C3D37] sm:order-2 order-1 flex-1 w-full flex flex-col justify-between p-[20px] sm:mt-0">
        <div className="flex gap-[15px] flex-col">
          <p className="text-[20px] font-semibold">{packages.name}</p>
          <div className="flex flex-col gap-1">
            <p>{packages.location}</p>
            <div className="flex">
              <span className="mr-1">Good for: </span>
              <p className="after:content-['-']">{packages.packsize.min}</p>
              <p>{packages.packsize.max}</p>
            </div>
            <div className="flex">
              <span className="mr-1">Inclusions:</span>
              <p className="text-[13px] text-[#619750] leading-6">
                {packages.inclusions.join(", ")}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full sm:mt-0 mt-5 flex items-center justify-between">
          <p className="before:content-['₱_'] text-[20px] font-semibold before:font-medium">
            {packages.price.toLocaleString()}
          </p>

          <button className="group px-[20px] py-[10px] bg-[#3C3D37] rounded-sm cursor-pointer border border-white hover:bg-white hover:border-[#3C3D37] transition-all duration-200 ease-in-out">
            <p className="text-white group-hover:text-[#3C3D37] transition-colors duration-200 ease-in-out">
              View Details
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
