import React from "react";
import { MdOutlineStarBorder } from "react-icons/md";
import { MdOutlineStar } from "react-icons/md";

export default function index() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-fit">
      <div
        className="flex flex-col w-full h-[551px] items-start justify-end gap-[10px] px-[100px] py-[50px] bg-[url(/images/top.jpg)] bg-cover"
        style={{ backgroundPosition: "30% 20%" }}
      >
        <p className="flex text-white text-[54px] font-bold">
          Popular Destination
        </p>
        <p className="flex text-white text-[32px] font-normal ">
          Discover the beauty of Eastern Visayas – from pristine beaches to
          hidden gems in the mountains.
        </p>
        <div className="flex w-full h-fit">
          <div className="flex w-full h-fit">
            <input
              type="text"
              placeholder="Search destinations"
              className="w-full h-fit text-[25px] bg-white placeholder-[#3C3D37] font-normal text-[#3C3D37] rounded-l-[10px] px-[20px] py-[10px] outline-none"
            />
          </div>
          <div>
            <button className="bg-[#3C3D37] w-[119px] text-white font-normal cursor-pointer text-[26px] h-full px-[13px] py-[10px] rounded-r-[10px]">
              Explore
            </button>
          </div>
        </div>
      </div>

      <div className="flex bg-white gap-[10px] w-full h-fit px-[100px] py-[10px] flex-wrap items-center justify-center">
        <div className="flex flex-col w-[302.5px] h-fit">
          <div
            className="flex bg-[url(/images/kalanggaman.jpg)] rounded-t-[10px] w-full bg-cover bg-no-repeat h-[143px] "
            style={{ backgroundPosition: "25% 1%" }}
          ></div>
          <div className="flex flex-col w-full h-fit px-[10px] py-[10px]">
            <p className="flex text-black font-medium text-[25px]">
              Kalanggaman Island
            </p>
            <p className="flex text-black font-normal text-[20px]">
              Palompon, Leyte
            </p>
            <div className="flex h-[55px] w-full gap-[50px] items-center">
              <div className="flex w-full h-fit">
                <MdOutlineStarBorder className="flex h-[25px] w-[25px] text-yellow-500" />
                <MdOutlineStarBorder className="flex h-[25px] w-[25px] text-yellow-500" />
                <MdOutlineStarBorder className="flex h-[25px] w-[25px] text-yellow-500" />
                <MdOutlineStarBorder className="flex h-[25px] w-[25px] text-yellow-500" />
                <MdOutlineStarBorder className="flex h-[25px] w-[25px] text-yellow-500" />
              </div>
              <button className="flex bg-[#3C3D37] cursor-pointer w-full h-fit font-normal items-center text-[17px] justify-center rounded-[6px] text-white px-[10px] py-[10px]">
                {" "}
                View More
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-[302.5px] h-fit">
          <div
            className="flex bg-[url(/images/cambugahay.jpg)] rounded-t-[10px] w-full bg-cover bg-no-repeat h-[143px] "
            style={{ backgroundPosition: "25% 25%" }}
          ></div>
          <div className="flex flex-col w-full h-fit px-[10px] py-[10px]">
            <p className="flex text-black font-medium text-[25px]">
              Cambugahay Falls
            </p>
            <p className="flex text-black font-normal text-[20px]">
              Siquijor Island
            </p>
            <div className="flex h-[55px] w-full gap-[50px] items-center">
              <div className="flex w-full h-fit">
                <MdOutlineStar className="flex h-[25px] w-[25px] text-yellow-500" />
                <MdOutlineStar className="flex h-[25px] w-[25px] text-yellow-500" />
                <MdOutlineStar className="flex h-[25px] w-[25px] text-yellow-500" />
                <MdOutlineStarBorder className="flex h-[25px] w-[25px] text-yellow-500" />
                <MdOutlineStarBorder className="flex h-[25px] w-[25px] text-yellow-500" />
              </div>
              <button className="flex bg-[#3C3D37] cursor-pointer w-full h-fit font-normal items-center text-[17px] justify-center rounded-[6px] text-white px-[10px] py-[10px]">
                {" "}
                View More
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-[302.5px] h-fit">
          <div
            className="flex bg-[url(/images/cave.jpg)] rounded-t-[10px] w-full bg-cover bg-no-repeat h-[143px] "
            style={{ backgroundPosition: "25% 90%" }}
          ></div>
          <div className="flex flex-col w-full h-fit px-[10px] py-[10px]">
            <p className="flex text-black font-medium text-[25px]">
              Sohoton Cave
            </p>
            <p className="flex text-black font-normal text-[20px]">
              Basey, Samar
            </p>
            <div className="flex h-[55px] w-full gap-[50px] items-center">
              <div className="flex w-full h-fit">
                <MdOutlineStarBorder className="flex h-[25px] w-[25px] text-yellow-500" />
                <MdOutlineStarBorder className="flex h-[25px] w-[25px] text-yellow-500" />
                <MdOutlineStarBorder className="flex h-[25px] w-[25px] text-yellow-500" />
                <MdOutlineStarBorder className="flex h-[25px] w-[25px] text-yellow-500" />
                <MdOutlineStarBorder className="flex h-[25px] w-[25px] text-yellow-500" />
              </div>
              <button className="flex bg-[#3C3D37] cursor-pointer w-full h-fit font-normal items-center text-[17px] justify-center rounded-[6px] text-white px-[10px] py-[10px]">
                {" "}
                View More
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-[302.5px] h-fit">
          <div
            className="flex bg-[url(/images/chocolate.jpg)] rounded-t-[10px] w-full bg-cover bg-no-repeat h-[143px] "
            style={{ backgroundPosition: "25% 100%" }}
          ></div>
          <div className="flex flex-col w-full h-fit px-[10px] py-[10px]">
            <p className="flex text-black font-medium text-[25px]">
              Chocolate Hills
            </p>
            <p className="flex text-black font-normal text-[20px]">
              Bohol, Eastern Visayas
            </p>
            <div className="flex h-[55px] w-full gap-[50px] items-center">
              <div className="flex w-full h-fit">
                <MdOutlineStar className="flex h-[25px] w-[25px] text-yellow-500" />
                <MdOutlineStar className="flex h-[25px] w-[25px] text-yellow-500" />
                <MdOutlineStarBorder className="flex h-[25px] w-[25px] text-yellow-500" />
                <MdOutlineStarBorder className="flex h-[25px] w-[25px] text-yellow-500" />
                <MdOutlineStarBorder className="flex h-[25px] w-[25px] text-yellow-500" />
              </div>
              <button className="flex bg-[#3C3D37] cursor-pointer w-full h-fit font-normal items-center text-[17px] justify-center rounded-[6px] text-white px-[10px] py-[10px]">
                {" "}
                View More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
