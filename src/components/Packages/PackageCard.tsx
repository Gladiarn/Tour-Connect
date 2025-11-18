import React from "react";
import { packagesDisplayTypes } from "../types";
import Image from "next/image";

export default function PackageCard({
  packages,
}: {
  packages: packagesDisplayTypes;
}) {
  return (
    <div className="w-fit">
      <div className="w-[500px] h-[350px] flex flex-col gap-2">
        <div className="w-full h-[175px]">
          <Image
            src={
              packages.images[0]
            }
            width={500}
            height={175}
            className="object-cover object-center w-full h-full"
            alt={packages.name}
          />
        </div>
        <div className="flex gap-2 w-full h-[175px]">
          <div className="w-1/2 h-full">
            <Image
              src={
                packages.images[0]
              }
              width={250}
              height={175}
              className="object-cover object-center w-full h-full"
              alt={packages.name}
            />
          </div>
          <div className="w-1/2 h-full">
            <Image
              src={
                packages.images[0]
              }
              width={250}
              height={175}
              className="object-cover object-center w-full h-full"
              alt={packages.name}
            />
          </div>
        </div>
      </div>

      <div></div>
    </div>
  );
}
