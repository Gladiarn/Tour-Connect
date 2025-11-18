import React from "react";
import InfoCards from "./InfoCards";
import { infoCardTypes } from "../types";
import { Album, Bot, HandCoins, Telescope } from "lucide-react";

export default function First() {
  const informations: infoCardTypes[] = [
    {
      title: "Affordable",
      body: "Experience great pleasure with very little cost — explore top destinations without breaking the bank.",
      background: "rounded-[30%_70%_37%_63%_/_30%_30%_70%_70%]",
      color: "bg-[#C2E2CB]",
      icon: <HandCoins className="h-10 w-10"/>,
    },
    {
      title: "Easy Booking",
      body: " Reserve your dream tour in just a few clicks — fast, hassle-free, and always available.",
      background: "rounded-[30%_70%_77%_23%_/_30%_71%_29%_70%]",
      color: "bg-[#EFD9DF]",
      icon: <Album className="h-10 w-10"/>,
    },
    {
      title: "Local Discovery",
      body: "Unlock hidden gems in Eastern Visayas — connect with culture, nature, and the warmth of local hospitality.",
      background: "rounded-[85%_15%_28%_72%_/_66%_21%_79%_34%]",
      color: "bg-[#F5E9CC]",
      icon: <Telescope className="h-10 w-10"/>,
    },
    {
      title: "Smart Assistance",
      body: " Get instant help anytime — our AI chatbot is ready to guide you through every step of your journey.",
      background: "rounded-[30%_70%_31%_69%_/_30%_85%_15%_70%]",
      color: "bg-[#CDE0EE]",
      icon: <Bot className="h-10 w-10"/>,
    },
  ];
  return (
    <div className="w-full bg-gray-100 py-10 pb-15 px-6 text-center flex flex-col text-[#3C3D37] gap-8">
      <div>
        <p className="text-2xl md:text-4xl font-bold mb-4 text-[#3C3D37]">
          Discover Eastern Visayas Like Never Before
        </p>
        <p className="text-[13px] md:text-lg text-[#3C3D37]">
          Explore breathtaking destinations, book guided tours, and experience
          the culture of the region — all in one smart platform.
        </p>
      </div>
      <div className="flex w-full px-[100px] justify-around min-h-[150px]">
        {informations.map((info, index) => (
          <InfoCards key={index} info={info} />
        ))}
      </div>
    </div>
  );
}
