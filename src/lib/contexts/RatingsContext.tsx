import { ratingsContextTypes, ratingsTypes } from "@/components/types";
import React, { createContext, useState } from "react";

const RatingsContext = createContext<ratingsContextTypes | null>(null);

export function RatingsProvider({ children }: { children: React.ReactNode }) {
  const [ratings, setRatings] = useState<ratingsTypes[]>([]);

  const addRating = (rating: ratingsTypes) => {
    setRatings((prev) => [...prev, rating]);
  };

  const changeRating = (ratingReference: string, newRating: number) => {
    setRatings((prev) =>
      prev.map((rating) =>
        rating.ratingReference === ratingReference
          ? { ...rating, rating: newRating }
          : rating
      )
    );
  };

  return (
    <RatingsContext.Provider
      value={{ ratings, setRatings, addRating, changeRating }}
    >
      {children}
    </RatingsContext.Provider>
  );
}

export const useRatings = () => {
  const context = React.useContext(RatingsContext);
  if (!context) {
    throw new Error("useRatings must be used within a RatingsProvider");
  }
  return context;
};
