import { JSX } from "react";

export interface packagesDataTypes {
  tourType: string;
  dateRange: { startDate: Date | undefined; endDate: Date | undefined };
  priceRange: string;
}

export interface infoCardTypes {
  title: string;
  body: string;
  background: string;
  color: string;
  icon: JSX.Element;
}

export interface packagesDisplayTypes {
  name: string;
  location: string;
  inclusions: string[];
  price: number;
  images: string[];
  packsize: {
    min: number;
    max: number;
  };
}

export interface destinationsDataTypes {
  province: string;
  activityType: string;
  priceRange: string;
}

export interface destinationsDisplayTypes {
  id: number;
  name: string;
  activityType: string;
  rating: number;
  images: string[];
  description: string;
  budget: number;
  location: string;
  bestTimeToVisit: string;
  tips: string[];
  reference: string;
}

export interface ratingsTypes {
  ratingReference: string;
  rating: number;
}

export interface ratingsContextTypes {
  ratings: ratingsTypes[];
  setRatings: React.Dispatch<React.SetStateAction<ratingsTypes[]>>;
  addRating: (rating: ratingsTypes) => void;
  changeRating: (ratingReference: string, newRating: number) => void;
}

export interface popularDestinationsDisplayTypes {
  id: number;
  name: string;
  activityType: string;
  rating: number;
  images: string[];
  description: string;
  budget: number;
  location: string;
  bestTimeToVisit: string;
  tips: string[];
  reference: string;
}

export interface hotelsTypes {
  id: number;
  name: string;
  images: string[];
  duration: string;
  rooms: {
    id: number;
    image: string;
    name: string;
    features: string[];
    facilities: string[];
    description: string;
    price: number;
    guests: string[];
    area: string;
  }[];
  rating: number;
}

export type CombinedDestination = popularDestinationsDisplayTypes & hotelsTypes;

export interface ViewRoomPageProps {
  destination: CombinedDestination;
  room: {
    id: number;
    image: string;
    name: string;
    features: string[];
    facilities: string[];
    description: string;
    price: number;
    guests: string[];
    area: string;
  };
}

export interface bookRoomTypes {
  hotelId: number;
  roomId: number;
  name: string;
  phoneNumber: string;
  address: string;
  dateRange: { startDate: Date | undefined; endDate: Date | undefined };
  nightCount: number;
  totalPrice: number;
}
