import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineStarBorder } from "react-icons/md";
import { MdOutlineStar } from "react-icons/md";

export default function Destinations() {
  return (
    <div className="flex flex-col w-full h-fit bg-white">
      <div
        className="flex flex-col w-full items-center justify-center h-fit gap-[30px] pl-[300px] pt-[130px] pr-[300px] pb-[20px]"
        style={{
          backgroundImage: "url('/images/des.png')",
          backgroundSize: "100%", // or 100%, 90%, etc.
          backgroundPosition: "30% 10%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <p className="flex font-bold text-[64px] text-white">Destinations</p>
        <div className="flex w-full font-black h-fit gap-[30px] px-[10px] items-center justify-center py-[10px]">
          <div className="flex items-center justify-between bg-white py-[10px] px-[10px] rounded-[10px] w-full h-fit font-medium text-[20px]">
            Province
            <button className="flex items-center cursor-pointer">
              <IoIosArrowDown size={25} />
            </button>
          </div>
          <div className="flex items-center justify-between bg-white py-[10px] px-[10px] rounded-[10px] w-full h-fit font-medium text-[20px]">
            Activity Type
            <button className="flex items-center cursor-pointer">
              <IoIosArrowDown size={25} />
            </button>
          </div>
          <div className="flex items-center justify-between bg-white py-[10px] px-[10px] rounded-[10px] w-full h-fit font-medium text-[20px]">
            Price Range
            <button className="flex items-center cursor-pointer">
              <IoIosArrowDown size={25} />
            </button>
          </div>
        </div>
      </div>
      <div className="flex w-full h-fit bg-white gap-[30px] flex-wrap items-center justify-center px-[180px] py-[20px]">
        <div className="flex flex-col w-[525px] h-[307px]">
          <div
            className="flex w-full rounded-t-[10px] h-[173px]"
            style={{
              backgroundImage: "url('/images/kalanggaman.jpg')",
              backgroundSize: "100%", // or 100%, 90%, etc.
              backgroundPosition: "30% 10%",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <div className="flex flex-col w-full px-[10px] py-[10px] ">
            <p className="flex font-medium text-[25px] text-black">Kalanggaman Island</p>
            <p className="flex font-normal text-[20px] text-black">Palompon, Leyte</p>
            <div className="flex w-full h-fit bg-white gap-[250px]">
                <div className="flex w-full h-fit">
                <MdOutlineStarBorder className="flex h-[30px] w-[30px] text-yellow-500" />
                <MdOutlineStarBorder className="flex h-[30px] w-[30px] text-yellow-500" />
                <MdOutlineStarBorder className="flex h-[30px] w-[30px] text-yellow-500" />
                <MdOutlineStarBorder className="flex h-[30px] w-[30px] text-yellow-500" />
                <MdOutlineStarBorder className="flex h-[30px] w-[30px] text-yellow-500" />
              </div>
              
                <button className="flex w-full h-fit cursor-pointer py-[10px] gap-[10px] bg-[#3C3D37] items-center justify-center rounded-[10px] text-white">View More</button>
            </div>
            
          </div>
        </div>
        
        <div className="flex flex-col w-[525px] h-[307px]">
          <div
            className="flex w-full rounded-t-[10px] h-[173px]"
            style={{
              backgroundImage: "url('/images/cave.jpg')",
              backgroundSize: "100%", // or 100%, 90%, etc.
              backgroundPosition: "30% 80%",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <div className="flex flex-col w-full px-[10px] py-[10px] ">
            <p className="flex font-medium text-[25px] text-black">Sohoton Cave</p>
            <p className="flex font-normal text-[20px] text-black">Basey, Samar</p>
            <div className="flex w-full h-fit bg-white gap-[250px]">
                <div className="flex w-full h-fit">
                <MdOutlineStar className="flex h-[30px] w-[30px] text-yellow-500" />
                <MdOutlineStarBorder className="flex h-[30px] w-[30px] text-yellow-500" />
                <MdOutlineStarBorder className="flex h-[30px] w-[30px] text-yellow-500" />
                <MdOutlineStarBorder className="flex h-[30px] w-[30px] text-yellow-500" />
                <MdOutlineStarBorder className="flex h-[30px] w-[30px] text-yellow-500" />
              </div>
              
                <button className="flex w-full h-fit cursor-pointer py-[10px] gap-[10px] bg-[#3C3D37] items-center justify-center rounded-[10px] text-white">View More</button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
