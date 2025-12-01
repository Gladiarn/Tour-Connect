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
  pricePerHead: number;
  duration: string;
  description: string;
  price: number;
  images: string[];
  packsize: {
    min: number;
    max: number;
  };
  reference: string;
}

export interface destinationsDataTypes {
  province: string;
  activityType: string;
  priceRange: string;
}

export interface destinationsDisplayTypes {
  _id: number;
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
  _id: number;
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
  reference: string;
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
    roomReference: string;
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

export interface roomPageTypes {
    id: number;
    image: string;
    name: string;
    features: string[];
    facilities: string[];
    description: string;
    price: number;
    guests: string[];
    area: string;
    roomReference: string;
}

export interface bookRoomTypes {
  hotelReference: string;
  roomReference: string;
  name: string;
  phoneNumber: string;
  address: string;
  dateRange: { startDate: Date | undefined; endDate: Date | undefined };
  nightCount: number;
  totalPrice: number;
}

export interface Booking {
  _id: string;
  destinationReference: string;
  tourType: string;
  transportation: string[];
  image: string;
  dateBooked: string;
  dateStart: string;
  totalPrice: number;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
}

export interface User {
  _id: string;
  email: string;
  name: string;
  userType: string;
  password: string;
  refreshToken?: string | null;
  favorites: string[];
  bookings: Booking[];
}