import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import ProfileCard from "@/components/Card/ProfileCard";
import FavoriteCard from "@/components/Card/FavoriteCard";
import Pagination from "@/components/Pagination/Pagination";
import {
  Booking,
  destinationsDisplayTypes,
  User,
  HotelBooking,
} from "@/components/types";
import HotelBookingCard from "@/components/Card/HotelBookingCard";

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [fetchUser, setFetchUser] = useState<User | null>(null);
  const [ongoingBookings, setOngoingBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [favorites, setFavorites] = useState<destinationsDisplayTypes[]>([]);
  const [hotelBookings, setHotelBookings] = useState<HotelBooking[]>([]);
  const [activeTab, setActiveTab] = useState<
    "ongoing" | "past" | "favorites" | "hotels"
  >("ongoing");

  // Pagination states
  const [paginated, setPaginated] = useState<
    Booking[] | destinationsDisplayTypes[] | HotelBooking[]
  >([]);
  const itemsPerPage = 3;
  const [inputValue, setInputValue] = useState<string>("1");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Get the current data based on active tab
  const getCurrentData = useCallback(() => {
    switch (activeTab) {
      case "ongoing":
        return ongoingBookings;
      case "past":
        return pastBookings;
      case "favorites":
        return favorites;
      case "hotels":
        return hotelBookings;
      default:
        return [];
    }
  }, [activeTab, ongoingBookings, pastBookings, favorites, hotelBookings]);

  // Calculate total pages based on current data
  const totalPages = Math.ceil(getCurrentData().length / itemsPerPage);

  // Handle pagination
  const handlePagination = useCallback(
    (page: number) => {
      const currentData = getCurrentData();
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setPaginated(currentData.slice(startIndex, endIndex));
      setCurrentPage(page);
      setInputValue(page.toString());
    },
    [itemsPerPage, getCurrentData]
  );

  useEffect(() => {
    setCurrentPage(1);
    setInputValue("1");
    handlePagination(1);
  }, [activeTab, handlePagination]);

  useEffect(() => {
    handlePagination(currentPage);
  }, [
    ongoingBookings,
    pastBookings,
    favorites,
    hotelBookings,
    currentPage,
    handlePagination,
  ]);

  useEffect(() => {
    const fetchAllUserData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token || !user) return;

        // Fetch user details
        const userRes = await fetch("http://localhost:5000/api/users/details", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.success) setFetchUser(userData.data);
        }

        // Fetch ongoing bookings
        const ongoingRes = await fetch(
          "http://localhost:5000/api/bookings/ongoing",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (ongoingRes.ok) {
          const ongoingData = await ongoingRes.json();
          if (ongoingData.success) setOngoingBookings(ongoingData.data);
        }

        // Fetch past bookings
        const pastRes = await fetch("http://localhost:5000/api/bookings/past", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (pastRes.ok) {
          const pastData = await pastRes.json();
          if (pastData.success) setPastBookings(pastData.data);
        }

        // Fetch favorites
        const favoritesRes = await fetch(
          "http://localhost:5000/api/bookings/favorites/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (favoritesRes.ok) {
          const favoritesData = await favoritesRes.json();
          if (favoritesData.success) setFavorites(favoritesData.data);
        }

        const hotelsRes = await fetch(
          "http://localhost:5000/api/users/hotel-bookings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (hotelsRes.ok) {
          const hotelsData = await hotelsRes.json();
          console.log('hotels, :', hotelsData.data)
          if (hotelsData.success) setHotelBookings(hotelsData.data);
        }

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (user) fetchAllUserData();
  }, [user]);

  if (!user) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div>Please login to view profile</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#EEEEEE] pt-[60px] min-h-screen">
      {/* Head */}
      <div className="w-full bg-white flex flex-col gap-5 p-[30px] shadow-md">
        <div className="flex flex-col md:flex-row items-center gap-5">
          <div className="relative w-[150px] h-[150px] rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
            <div className="w-full h-full flex items-center justify-center bg-blue-100">
              <span className="text-4xl font-bold text-blue-600">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-[#3C3D37]">
              {fetchUser?.name}
            </h1>
            <p className="text-gray-600 mt-2">{fetchUser?.email}</p>
            <p className="text-gray-500 mt-1">
              User Type: {fetchUser?.userType}
            </p>

            <div className="flex flex-wrap gap-4 mt-4">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <p className="text-sm text-gray-600">Ongoing Bookings</p>
                <p className="text-xl font-bold text-blue-600">
                  {ongoingBookings.length}
                </p>
              </div>
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <p className="text-sm text-gray-600">Past Bookings</p>
                <p className="text-xl font-bold text-green-600">
                  {pastBookings.length}
                </p>
              </div>
              <div className="bg-purple-50 px-4 py-2 rounded-lg">
                <p className="text-sm text-gray-600">Favorites</p>
                <p className="text-xl font-bold text-purple-600">
                  {favorites.length}
                </p>
              </div>
              <div className="bg-yellow-50 px-4 py-2 rounded-lg">
                <p className="text-sm text-gray-600">Hotel Bookings</p>
                <p className="text-xl font-bold text-yellow-600">
                  {hotelBookings.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body - Tabs */}
      <div className="w-full min-h-[600px] bg-white p-[30px] text-[#3C3D37] mt-6">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab("ongoing")}
            className={`px-6 py-3 font-medium text-lg whitespace-nowrap ${
              activeTab === "ongoing"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Ongoing Bookings
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`px-6 py-3 font-medium text-lg whitespace-nowrap ${
              activeTab === "past"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Past Bookings
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`px-6 py-3 font-medium text-lg whitespace-nowrap ${
              activeTab === "favorites"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Favorites
          </button>
          <button
            onClick={() => setActiveTab("hotels")}
            className={`px-6 py-3 font-medium text-lg whitespace-nowrap ${
              activeTab === "hotels"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Hotel Bookings
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {/* Ongoing Bookings */}
          {activeTab === "ongoing" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Ongoing Bookings</h2>
              {ongoingBookings.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">No ongoing bookings found.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(paginated as Booking[]).map((booking: Booking) => (
                      <ProfileCard
                        key={booking._id}
                        booking={booking}
                        type="ongoing"
                      />
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        handlePagination={handlePagination}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Past Bookings */}
          {activeTab === "past" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Past Bookings</h2>
              {pastBookings.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">No past bookings found.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(paginated as Booking[]).map((booking: Booking) => (
                      <ProfileCard
                        key={booking._id}
                        booking={booking}
                        type="past"
                      />
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        handlePagination={handlePagination}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Favorites */}
          {activeTab === "favorites" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">My Favorites</h2>
              {favorites.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">No favorites yet.</p>
                  <button
                    onClick={() => router.push("/destinations")}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Browse Destinations
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(paginated as destinationsDisplayTypes[]).map(
                      (favorite, index) => (
                        <FavoriteCard key={index} favorite={favorite} />
                      )
                    )}
                  </div>
                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        handlePagination={handlePagination}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Hotel Bookings */}
          {activeTab === "hotels" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Hotel Bookings</h2>
              {hotelBookings.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">No hotel bookings found.</p>
                  <button
                    onClick={() => router.push("/hotels")}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Browse Hotels
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(paginated as HotelBooking[]).map((hotel, index) => (
                      <HotelBookingCard key={index} booking={hotel} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        handlePagination={handlePagination}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
