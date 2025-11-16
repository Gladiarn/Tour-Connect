import React, { useEffect, useState } from "react";

const backgroundStorage = [
  "/images/landing-img.svg",
  "/images/OCEAN.jpg",
  "/images/nature.jpg",
];

export default function Landing() {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => (prev + 1) % backgroundStorage.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full min-h-[700px] overflow-hidden">

      <div
        className="flex h-full w-full transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${counter * 100}%)`,
        }}
      >
        {backgroundStorage.map((img, i) => (
          <div
            key={i}
            className="w-full min-h-[700px] bg-cover bg-center flex-shrink-0"
            style={{ backgroundImage: `url(${img})` }}
          ></div>
        ))}
      </div>

      <div className="absolute top-0 left-0 w-full h-full flex flex-col px-[100px] font-poppins">
        <div
          className="
            flex flex-col gap-[20px] 
            backdrop-blur-[5px] border border-white 
            px-[25px] py-[25px] h-fit w-[509px] 
            rounded-[15px] mt-60
          "
        >
          <div className="flex flex-col w-full h-fit">
            <p className="text-[20px] w-full h-fit text-white font-medium">
              Welcome to TourConnect
            </p>
            <p className="text-[50px] w-full h-fit text-white font-bold">
              Explore Visayas
            </p>
            <p className="text-[15px] w-full h-fit text-white font-medium">
              Explore Eastern Visayas with ease! Discover stunning destinations,
              book tours hassle-free, and experience the region like never before.
              Your next adventure starts here!
            </p>
          </div>
          <div className="flex w-full items-center gap-[25px] justify-end h-fit text-white">
            <div className="flex border-b border-white w-fit h-fit font-bold">
              <a href="#">Learn More</a>
            </div>
            <div className="flex h-fit w-fit items-center">
              <button
                className="
                flex bg-[#181C14] items-center font-bold text-white 
                px-[20px] py-[5px] rounded-[10px] text-[17px]
              "
              >
                Sign-Up
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-[10px] absolute bottom-4 left-1/2 -translate-x-1/2">
          {backgroundStorage.map((_, index) => (
            <div
              key={index}
              className={`w-[12px] h-[12px] rounded-full ${
                counter === index ? "bg-white" : "bg-white/50"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
