import React from "react";
import { useRouter } from "next/router";

interface FavoriteCardProps {
  favorite: any;
  index: number;
}

export default function FavoriteCard({ favorite, index }: FavoriteCardProps) {
  const router = useRouter();

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <p className="font-semibold">Favorite Destination</p>
      <p className="text-sm text-gray-600 mt-1">ID: {favorite}</p>
      <button 
        onClick={() => router.push(`/destinations/${favorite}`)}
        className="mt-3 px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200 transition-colors"
      >
        View Details
      </button>
    </div>
  );
}