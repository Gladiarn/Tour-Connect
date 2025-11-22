import { useRatings } from "@/lib/contexts/RatingsContext";
import React from "react";

export default function StarRating({
  clickable,
  className,
  value,
  reference,
  currentRating,
}: {
  clickable: boolean;
  className?: string;
  value: number;
  reference: string;
  currentRating?: number;
}) {
  const { changeRating } = useRatings();

  const handleClick = () => {
    if (clickable) {
      console.log("Clicked star with value:", value);
      changeRating(reference, value);
    }
  };

  const fillPercentage = Math.max(
    0,
    Math.min(1, currentRating ? currentRating - value + 1 : 0)
  );

  const isFilled = fillPercentage === 1;
  const isHalfFilled = fillPercentage > 0 && fillPercentage < 1;

  return (
    <div
      className={`relative w-7 h-7 ${
        clickable ? "cursor-pointer" : "cursor-auto"
      } ${className}`}
      onClick={handleClick}
    >
      {/* Background stars */}
      <svg
        className="absolute top-0 left-0 w-7 h-7 text-gray-300"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>

      {/* Filled Stars show if filled*/}
      {(isFilled || isHalfFilled) && (
        <svg
          className="absolute top-0 left-0 w-7 h-7 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 24 24"
          style={{
            clipPath: isHalfFilled
              ? `inset(0 ${100 - fillPercentage * 100}% 0 0)`
              : "none",
          }}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )}
    </div>
  );
}
