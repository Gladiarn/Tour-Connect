
import { FaFacebook } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { FaInstagram } from "react-icons/fa";
import { IoIosArrowUp } from "react-icons/io";
import { Binoculars } from "lucide-react";
// import { footerMenuTypes } from "./types";

export default function Footer() {

    const footerMenu:string[] = ["Contacts", "Personality", "Cities", "Careers", "Security", "Cookies", "FAQs"];

  return (
    <div className="gap-[20px] flex flex-col w-full bg-surface text-white p-[40px] bg-[#3c3d37]">
        <div className="w-full flex lg:flex-row flex-col justify-between">
            <p className="text-[30px] lg:text-[40px] font-bold flex gap-[5px] items-center"><Binoculars className="h-[30px] w-[30px] lg:h-[40px] lg:w-[40px]"/>TourConnect</p>
            <ul className="flex gap-[10px] flex-wrap">
                {
                    footerMenu.map((menu, index)=>(
                        <li key={index} className="cursor-pointer h-fit hover:text-blue-500 transition-all ease-in-out"> <p className="lg:text-[16px] text-[14px]">{menu}</p></li>
                    ))
                }
            </ul>

        </div>

        <div className="w-full flex lg:flex-row flex-col gap-3">
            <div className="w-full flex gap-[20px] justify-start">
            <FaFacebook className="text-[20px] hover:scale-[.95] scale-100 transition-all ease-in-out cursor-pointer hover:text-gray-300"/>
            <BsTwitterX className="text-[20px] hover:scale-[.95] scale-100 transition-all ease-in-out cursor-pointer hover:text-gray-300 "/>
            <FaInstagram className="text-[20px] hover:scale-[.95] scale-100 transition-all ease-in-out cursor-pointer hover:text-gray-300 "/>
            </div>

            <div className="w-full text-center">
                <p className="whitespace-nowrap">© 2025 All Rights Reserved.</p>
            </div>

            <div className="w-full flex justify-end">
                <button onClick={()=>{window.scrollTo({top:0, behavior: "smooth"})}} className="transition-all ease-in-out cursor-pointer hover:border-blue-500 hover:text-blue-500 py-[5px] px-[20px] border border-white rounded-[25px] flex items-center gap-[5px]">Back to top <IoIosArrowUp /></button>
            </div>

        </div>
    </div>
  )
}
