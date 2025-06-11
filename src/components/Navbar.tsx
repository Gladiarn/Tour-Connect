import React, { useState } from "react";
import { CiUser } from "react-icons/ci";
import { CiGlobe } from "react-icons/ci";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
export default function Navbar() {
  const [language, setLanguage] = useState("English");
  return (
    <div className="flex flex-col w-full h-fit">
      <div className="flex w-full h-fit bg-white px-[100px] items-center py-[10px] justify-between border-b border-[#E0E0E0]">
        <div className="flex w-fit h-fit gap-[10px] items-center">
          <div className="flex font-semibold text-[#3C3D37] w-fit h-fit text-[28px]">
            TourConnect
          </div>
          <div className="flex text-[16px] text-[#3C3D37] w-fit h-fit gap-[15px] px-[23px] font-light ">
            <a
              href="#"
              className="relative before:content-[''] before:absolute before:bottom-0 before:left-[50%] before:translate-x-[-50%] before:h-[2px] before:w-0 hover:before:w-full before:bg-[#3C3D37] before:transition-all ease-in-out"
            >
              Home
            </a>
            <a
              href="#"
              className="relative before:content-[''] before:absolute before:bottom-0 before:left-[50%] before:translate-x-[-50%] before:h-[2px] before:w-0 hover:before:w-full before:bg-[#3C3D37] before:transition-all ease-in-out"
            >
              My Bookings
            </a>
            <a
              href="#"
              className="relative before:content-[''] before:absolute before:bottom-0 before:left-[50%] before:translate-x-[-50%] before:h-[2px] before:w-0 hover:before:w-full before:bg-[#3C3D37] before:transition-all ease-in-out"
            >
              About
            </a>
            <a
              href="#"
              className="relative before:content-[''] before:absolute before:bottom-0 before:left-[50%] before:translate-x-[-50%] before:h-[2px] before:w-0 hover:before:w-full before:bg-[#3C3D37] before:transition-all ease-in-out"
            >
              Contact Us
            </a>
          </div>
        </div>
        <div className="flex gap-[20px] w-fit h-full items-center">
          <div className="flex gap-[10px] w-fit h-full px-[10px] ">
            <div className="flex pr-[10px] border-r items-center font-light text-[16px] gap-[10px]">
              <div className="flex bg-[#3c3d37] text-[#ffffff] w-[30px] h-[30px] justify-center rounded-full gap-[10px] items-center">
                <CiGlobe className="flex h-[20px] w-[20px] rounded-full" />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex-grow focus:outline-0 cursor-pointer flex items-center justify-between">
                    <p className="flex text-[#3C3D37] cursor-pointer">
                      {language}
                    </p>
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  sideOffset={8}
                  alignOffset={-50}
                  style={{ width: 120 }}
                  className="p-4"
                >
                  <div className="flex flex-col gap-1">
                    <p
                      className="cursor-pointer hover:text-blue-500"
                      onClick={() => setLanguage("Filipino")}
                    >
                      🇵🇭 Filipino
                    </p>
                    <p
                      className=" cursor-pointer hover:text-blue-500"
                      onClick={() => setLanguage("English")}
                    >
                      🇺🇸 English
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex pr-[10px] items-center font-light text-[16px] gap-[10px]">
              <button className="flex bg-[#3c3d37] w-[30px] h-[30px] justify-center rounded-full gap-[10px] items-center">
                <CiUser className="text-[#ffffff] h-[20px] w-[20px] rounded-full" />
              </button>
              <p className="flex text-[#3C3D37]">User</p>
            </div>
          </div>
          <div className="flex bg-[#3c3d37] text-white rounded-full w-fit h-fit px-[20px] py-[5px] items-center">
            <p>Log-In</p>
          </div>
        </div>
      </div>

      <div className="w-full py-[5px] bg-white text-[#3C3D37]">
        <div className="flex gap-[10px] justify-center items-center">
          <a href="#" className="relative before:content-[''] before:absolute before:bottom-0 before:left-[50%] before:translate-x-[-50%] before:h-[2px] before:w-0 hover:before:w-full before:bg-[#3C3D37] before:transition-all ease-in-out">Popular Destinations</a>
          <a href="#" className="relative before:content-[''] before:absolute before:bottom-0 before:left-[50%] before:translate-x-[-50%] before:h-[2px] before:w-0 hover:before:w-full before:bg-[#3C3D37] before:transition-all ease-in-out">Destinations</a>
          <a href="#" className="relative before:content-[''] before:absolute before:bottom-0 before:left-[50%] before:translate-x-[-50%] before:h-[2px] before:w-0 hover:before:w-full before:bg-[#3C3D37] before:transition-all ease-in-out">Packages</a>
        </div>
      </div>
    </div>
  );
}
