import React from "react";
import { CiUser } from "react-icons/ci";
import { CiGlobe } from "react-icons/ci";
export default function Navbar() {
  return (
    <div className="flex w-full h-fit bg-white px-[50px] items-center py-[10px] justify-between border-b border-[#E0E0E0]">
      <div className="flex w-fit h-fit gap-[10px] items-center">
        <div className="flex font-semibold text-[#3C3D37] w-fit h-fit text-[28px]">TourConnect</div>
        <div className="flex text-[16px] text-[#3C3D37] w-fit h-fit gap-[15px] px-[23px] font-light ">
          <a href="#">Home</a>
          <a href="#">My Bookings</a>
          <a href="#">About</a>
          <a href="#">Contact Us</a>
        </div>
      </div>
      <div className="flex gap-[20px] w-fit h-full items-center">
        <div className="flex gap-[10px] w-fit h-full px-[10px] ">
          <div className="flex pr-[10px] border-r items-center font-light text-[16px] gap-[10px]">
            <button className="flex bg-[#3c3d37] text-[#ffffff] w-[30px] h-[30px] justify-center rounded-full items-center gap-[10px] items-center"> 
              <CiGlobe className="flex h-[20px] w-[20px] rounded-full" />
            </button>
            <p className="flex text-[#3C3D37]">English</p>
          </div>
          <div className="flex pr-[10px] items-center font-light text-[16px] gap-[10px]">
            <button className="flex bg-[#3c3d37] w-[30px] h-[30px] justify-center rounded-full items-center gap-[10px] items-center">
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
  );
}
