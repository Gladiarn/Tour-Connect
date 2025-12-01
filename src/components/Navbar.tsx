import React, { useState } from "react";
import { CiUser } from "react-icons/ci";
import { CiGlobe } from "react-icons/ci";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSection } from "@/context/SectionContext";
import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [language, setLanguage] = useState("English");
  const { setActiveSection } = useSection();

  const handleLogout = async () => {
    try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (refreshToken) {
      const response = await fetch("http://localhost:5000/api/users/logout", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        console.warn("Backend logout failed, but clearing frontend anyway");
      }

      await logout();
    }
    
  } catch (error) {
    console.error("Logout error:", error);

  }
  }

  const handleProfile = () => {
    if (!user){
      router.push('/login');
      return;
    }
    router.push('/Profile');
    return;
  }
  return (
    <div className="flex flex-col w-full h-fit fixed top-0 left-0 z-50">
      {/* Menu container */}
      <div className="flex w-full h-fit bg-white xl:px-[150px] px-[30px] items-center py-[10px] justify-between border-b border-[#E0E0E0]">
        <div className="flex w-fit h-fit gap-[10px] items-center">
          <div className="flex font-semibold text-[#3C3D37] w-fit h-fit text-[28px]">
            TourConnect
          </div>
          {/* Menu */}
          <div className="hidden lg:flex text-[16px] text-[#3C3D37] w-fit h-fit gap-[15px] px-[23px] font-light ">
            <Link href={'/'} className="cursor-pointer relative before:content-[''] before:absolute before:bottom-0 before:left-[50%] before:translate-x-[-50%] before:h-[1px] before:w-0 hover:before:w-full before:bg-[#3C3D37] before:transition-all ease-in-out">
              Home
            </Link>
            <p onClick={handleProfile} className="cursor-pointer relative before:content-[''] before:absolute before:bottom-0 before:left-[50%] before:translate-x-[-50%] before:h-[1px] before:w-0 hover:before:w-full before:bg-[#3C3D37] before:transition-all ease-in-out">
              My Bookings
            </p>
            <p className="cursor-pointer relative before:content-[''] before:absolute before:bottom-0 before:left-[50%] before:translate-x-[-50%] before:h-[1px] before:w-0 hover:before:w-full before:bg-[#3C3D37] before:transition-all ease-in-out">
              About
            </p>
            <p
              onClick={() => {
                window.scrollTo({
                  top: document.body.scrollHeight,
                  behavior: "smooth",
                });
              }}
              className="cursor-pointer relative before:content-[''] before:absolute before:bottom-0 before:left-[50%] before:translate-x-[-50%] before:h-[1px] before:w-0 hover:before:w-full before:bg-[#3C3D37] before:transition-all ease-in-out"
            >
              Contact Us
            </p>
          </div>
        </div>
        <div className="gap-[20px] w-fit h-full items-center hidden lg:flex">
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
              <p className="flex text-[#3C3D37]">
                {user ? user.name : "Guest"}
              </p>
            </div>
          </div>

          {user ? (
            <button onClick={handleLogout} className="hover:text-[#3c3d37] hover:bg-white hover:border-[#3c3d37] border transition-all ease-in-out cursor-pointer flex bg-[#3c3d37] text-white rounded-full w-fit h-fit px-[20px] py-[5px] items-center">
              Log-Out
            </button>
          ) : (
            <Link
              href="/login"
              className="hover:text-[#3c3d37] hover:bg-white hover:border-[#3c3d37] border transition-all ease-in-out cursor-pointer flex bg-[#3c3d37] text-white rounded-full w-fit h-fit px-[20px] py-[5px] items-center"
            >
              Log-In
            </Link>
          )}
        </div>

        <div className="flex lg:hidden">
          <Menu className="text-black" />
        </div>
      </div>

      {isHome && (
        <div className="w-full py-[5px] bg-white text-[#3C3D37]">
          <div className="flex gap-[10px] justify-center items-center text-[14px] lg:text-[16px] ">
            <p
              onClick={() => {
                setActiveSection("popular");
              }}
              className="cursor-pointer relative before:content-[''] before:absolute before:bottom-0 before:left-[50%] before:translate-x-[-50%] before:h-[1px] before:w-0 hover:before:w-full before:bg-[#3C3D37] before:transition-all ease-in-out"
            >
              Popular Destinations
            </p>
            <p
              onClick={() => {
                setActiveSection("destinations");
              }}
              className="cursor-pointer relative before:content-[''] before:absolute before:bottom-0 before:left-[50%] before:translate-x-[-50%] before:h-[1px] before:w-0 hover:before:w-full before:bg-[#3C3D37] before:transition-all ease-in-out"
            >
              Destinations
            </p>
            <p
              onClick={() => {
                setActiveSection("packages");
              }}
              className="cursor-pointer relative before:content-[''] before:absolute before:bottom-0 before:left-[50%] before:translate-x-[-50%] before:h-[1px] before:w-0 hover:before:w-full before:bg-[#3C3D37] before:transition-all ease-in-out"
            >
              Packages
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
