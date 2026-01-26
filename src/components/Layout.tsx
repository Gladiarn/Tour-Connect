import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import HybridChatbot from "./Chatbot/HybridChatbot"; // Import the chatbot
import { useAuthStore } from "@/context/AuthContext";

export default function Layout({
  children,
  hideNavbar,
}: {
  children: React.ReactNode;
  hideNavbar: boolean;
}) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  return (
    <>
      {!hideNavbar && <Navbar />}
      <main>{children}</main>
      <Footer />
      <HybridChatbot />
    </>
  );
}
