import React from "react";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  handlePagination,
  inputValue,
  setInputValue,
}: {
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  currentPage: number;
  totalPages: number;
  handlePagination: (page: number) => void;
}) {
  return (
    <div className="w-full flex justify-center items-center gap-4">
      <div className="flex justify-center items-center gap-2">
        <button
          className="text-[#3C3D37] hover:scale-110 transition-all ease-in-out duration-200 disabled:opacity-40 cursor-pointer disabled:cursor-auto"
          onClick={() => handlePagination(1)}
          disabled={currentPage === 1}
        >
          <ChevronFirst />
        </button>

        <button
          className="text-[#3C3D37] hover:scale-110 transition-all ease-in-out duration-200 disabled:opacity-40 cursor-pointer disabled:cursor-auto"
          onClick={() => handlePagination(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft />
        </button>
      </div>

      <div className="flex gap-2 items-center">
        <input
          value={inputValue}
          type="text"
          className="px-1 w-[30px] text-center bg-transparent border border-[#3C3D37] focus:outline-none rounded-sm text-[#3C3D37]"
          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, "");
          }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            setInputValue(val);

            if (val !== "") {
              let page = parseInt(val);
              if (isNaN(page) || page < 1) page = 1;
              if (page > totalPages) page = totalPages;

              handlePagination(page);
            }
          }}
          onBlur={() => {
            if (inputValue === "") {
              handlePagination(1);
            }
          }}
        />

        <p className="text-[#3C3D37]">of {totalPages}</p>
      </div>

      <div className="flex justify-center items-center gap-2">
        <button
          className="text-[#3C3D37] hover:scale-110 transition-all ease-in-out duration-200 disabled:opacity-40 cursor-pointer disabled:cursor-auto"
          onClick={() =>
            handlePagination(Math.min(totalPages, currentPage + 1))
          }
          disabled={currentPage === totalPages}
        >
          <ChevronRight />
        </button>

        <button
          className="text-[#3C3D37] hover:scale-110 transition-all ease-in-out duration-200 disabled:opacity-40 cursor-pointer disabled:cursor-auto"
          onClick={() => handlePagination(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronLast />
        </button>
      </div>
    </div>
  );
}
