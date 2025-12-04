import DestinationsTable from "@/components/admin/DestinationsTable";
import HotelsTable from "@/components/admin/HotelsTable";
import PackagesTable from "@/components/admin/PackagesTable";
import UsersTable from "@/components/admin/UsersTable";
import StatsCard from "@/components/Card/StatsCard";
import {
  destinationsDisplayTypes,
  hotelsTypes,
  IUser,
  packagesDisplayTypes,
} from "@/components/types";
import { useAuth } from "@/context/AuthContext";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Pagination from "@/components/Pagination/Pagination";
import { useRouter } from "next/router";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);


  useEffect(() => {

    if (!isLoading) {

      setAuthChecked(true);

      if (!user) {

        router.push("/login");
        return;
      }

      if (!user.userType || user.userType !== "admin") {

        router.push("/");
        return;
      }
    }
  }, [user, isLoading, router]);

  // Tab state
  const [activeTab, setActiveTab] = useState<
    "destinations" | "hotels" | "packages" | "users"
  >("destinations");

  // Data states
  const [destinations, setDestinations] = useState<destinationsDisplayTypes[]>(
    []
  );
  const [hotels, setHotels] = useState<hotelsTypes[]>([]);
  const [packages, setPackages] = useState<packagesDisplayTypes[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);

  // Pagination state
  const [paginated, setPaginated] = useState<
    | destinationsDisplayTypes[]
    | hotelsTypes[]
    | IUser[]
    | packagesDisplayTypes[]
  >([]);
  const itemsPerPage = 5;
  const [inputValue, setInputValue] = useState<string>("1");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Get current data based on active tab
  const getCurrentData = useCallback(() => {
    switch (activeTab) {
      case "destinations":
        return destinations;
      case "hotels":
        return hotels;
      case "packages":
        return packages;
      case "users":
        return users;
      default:
        return [];
    }
  }, [activeTab, destinations, hotels, packages, users]);

  // Handle pagination
  const handlePagination = useCallback(
    (page: number) => {
      const currentData = getCurrentData();
      const total = Math.ceil(currentData.length / itemsPerPage);
      setTotalPages(total);

      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setPaginated(currentData.slice(startIndex, endIndex));
      setCurrentPage(page);
    },
    [getCurrentData, itemsPerPage]
  );

  // Fetch destinations
  const fetchDestinations = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/destination/all");

      if (!res.ok) {
        throw new Error(`Failed to fetch destinations: ${res.status}`);
      }

      const result = await res.json();

      if (result) {
        setDestinations(result || []);
      } else {
        setDestinations([]);
      }
    } catch (error) {
      console.error("Failed to fetch destinations:", error);
      setDestinations([]);
    }
  };

  // Fetch hotels
  const fetchHotels = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/hotels/all");

      if (!res.ok) {
        throw new Error(`Failed to fetch hotels: ${res.status}`);
      }

      const result = await res.json();

      if (result) {
        setHotels(result);
      } else {
        setHotels([]);
      }
    } catch (error) {
      console.error("Failed to fetch hotels:", error);
      setHotels([]);
    }
  };

  // Fetch packages
  const fetchPackages = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/packages/all");

      if (!res.ok) {
        throw new Error(`Failed to fetch packages: ${res.status}`);
      }

      const result = await res.json();

      if (result.success) {
        setPackages(result.data || []);
      } else {
        setPackages([]);
      }
    } catch (error) {
      console.error("Failed to fetch packages:", error);
      setPackages([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        alert("No access token found please login");
      }

      const res = await fetch("http://localhost:5000/api/users/all", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(
          `Failed to fetch users: ${res.status} ${res.statusText}`
        );
      }

      const result = await res.json();

      if (result.success) {
        setUsers(result.data || []);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    }
  };

  // Fetch data when component mounts (only if user is admin)
  useEffect(() => {
    // Only fetch data if user is confirmed to be admin
    if (authChecked && user && user.userType === "admin") {
      const fetchData = async () => {
        await fetchDestinations();
        await fetchHotels();
        await fetchPackages();
        await fetchUsers();
      };

      fetchData();
    }
  }, [user, authChecked]);

  // Update pagination when data changes or tab changes
  useEffect(() => {
    const currentData = getCurrentData();
    if (currentData.length > 0) {
      handlePagination(1);
    } else {
      setPaginated([]);
      setCurrentPage(1);
      setTotalPages(1);
    }
  }, [
    destinations,
    hotels,
    packages,
    users,
    activeTab,
    getCurrentData,
    handlePagination,
  ]);

  // Handle tab change
  const handleTabChange = (
    tab: "destinations" | "hotels" | "packages" | "users"
  ) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        const response = await fetch("http://localhost:5000/api/users/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          console.warn("Backend logout failed, but clearing frontend anyway");
        }

        await logout();
        router.push("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Show loading while auth is being checked
  if (isLoading || !authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading admin dashboard...</div>
      </div>
    );
  }

  // If no user or not admin (should have redirected by now), show nothing
  if (!user || user.userType !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Access denied. Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#EEEEEE] w-full min-h-screen p-[30px] py-[60px] flex flex-col gap-5 relative text-[#3C3D37]">
      <div className="w-full py-[5px] px-[30px] bg-white fixed top-0 left-0 z-10 flex justify-between items-center">
        <p className="">
          Hello <b>{user?.name}</b> Welcome
        </p>
        {user ? (
          <button
            onClick={handleLogout}
            className="hover:text-[#3c3d37] hover:bg-white hover:border-[#3c3d37] border transition-all ease-in-out cursor-pointer flex bg-[#3c3d37] text-white rounded-full w-fit h-fit px-[20px] py-[5px] items-center"
          >
            Log-Out
          </button>
        ) : (
          <Link
            href="/login"
            className="hover:text-[#3c3d37] hover:bg-white hover:border-[#3c3d37] border transition-all ease-in-out cursor-pointer flex bg-[#3c3d37] text-white rounded-full w-fit h-fit px-[20px] py-[5px] items-center"
          >
            Log-In
          </Link>
        )}
      </div>
      <div className="flex flex-wrap gap-5 w-full">
        {[
          { title: "Destinations" as const, value: destinations.length },
          { title: "Hotels" as const, value: hotels.length },
          { title: "Packages" as const, value: packages.length },
          { title: "Users" as const, value: users.length },
        ].map((stat) => (
          <StatsCard key={stat.title} title={stat.title} value={stat.value} />
        ))}
      </div>

      <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Tab Header */}
        <div className="border-b flex justify-between items-center pr-6 border-gray-200">
          <div className="flex px-6 py-4 gap-4">
            <button
              onClick={() => handleTabChange("destinations")}
              className={`px-2 py-3 font-medium text-lg transition-all relative ${
                activeTab === "destinations"
                  ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Destinations
            </button>
            <button
              onClick={() => handleTabChange("hotels")}
              className={`px-2 py-3 font-medium text-lg transition-all relative ${
                activeTab === "hotels"
                  ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Hotels
            </button>
            <button
              onClick={() => handleTabChange("packages")}
              className={`px-2 py-3 font-medium text-lg transition-all relative ${
                activeTab === "packages"
                  ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Packages
            </button>
            <button
              onClick={() => handleTabChange("users")}
              className={`px-2 py-3 font-medium text-lg transition-all relative ${
                activeTab === "users"
                  ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Users
            </button>
          </div>
          <button className="px-3 py-2 bg-blue-600 text-white rounded-md w-fit h-fit hover:bg-blue-700 transition-colors ease-in-out duration-200">
            Add Record
          </button>
        </div>

        {/* Empty Body */}
        <div className="p-6">
          {activeTab === "destinations" && (
            <DestinationsTable data={paginated as destinationsDisplayTypes[]} />
          )}
          {activeTab === "hotels" && (
            <HotelsTable data={paginated as hotelsTypes[]} />
          )}
          {activeTab === "packages" && (
            <PackagesTable data={paginated as packagesDisplayTypes[]} />
          )}
          {activeTab === "users" && <UsersTable data={paginated as IUser[]} />}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePagination={handlePagination}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
        </div>
      </div>
    </div>
  );
}
