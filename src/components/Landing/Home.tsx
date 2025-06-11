import React, { useEffect, useState } from "react";
const backgroundStorage: string[] = [
  "bg-[url('/images/landing-img.svg')]",
  "bg-[url('/images/OCEAN.jpg')]",
  "bg-[url('/images/nature.jpg')]",
];

export default function Landing() {
  const [counter, setCounter] = useState<number>(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCounter((prevCounter) => (prevCounter + 1) % backgroundStorage.length);
    }, 8000);

    return () => clearInterval(intervalId);
  }, []);

  const backgroundIMG = backgroundStorage[counter];

  return (
    <div
      className={`
        ${backgroundIMG} w-full min-h-[700px]
        bg-no-repeat bg-cover bg-center 
        flex flex-col px-[100px] font-poppins
        transition-opacity duration-500 ease-in-out
      `}
    >
      <div className="
        flex flex-col gap-[20px] 
        backdrop-blur-[5px] border border-white 
        px-[25px] py-[25px] h-fit w-[509px] 
        rounded-[15px] mt-auto mb-auto
      ">
        <div className="flex flex-col w-full h-fit">
          <p className="text-[20px] w-full h-fit text-white font-medium">
            Welcome to TourConnect
          </p>
          <p className="text-[50px] w-full h-fit text-white font-bold">
            Explore Visayas
          </p>
          <p className="text-[15px] w-full h-fit text-white font-medium">
            Explore Eastern Visayas with ease! Discover stunning destinations,
            book tours hassle-free, and experience the region like never
            before. Your next adventure starts here!
          </p>
        </div>
        <div className="flex w-full items-center gap-[25px] justify-end h-fit text-white">
          <div className="flex border-b border-white w-fit h-fit font-bold">
            <a href="#">Learn More</a>
          </div>
          <div className="flex h-fit w-fit items-center">
            <button className="
              flex bg-[#181C14] items-center font-bold text-white 
              px-[20px] py-[5px] rounded-[10px] text-[17px]
            ">
              Sign-Up
            </button>
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="flex justify-center h-fit w-full items-center gap-[10px] px-[10px] py-[20px]">
        {backgroundStorage.map((_, index) => (
          <div
            key={index}
            className={`
              w-[12px] h-[12px] rounded-full 
              ${counter === index ? "bg-white" : "bg-white/50"}
            `}
          />
        ))}
      </div>
    </div>
  );
}
