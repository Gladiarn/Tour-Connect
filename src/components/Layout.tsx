import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import HybridChatbot from "./Chatbot/HybridChatbot"; // Import the chatbot

export default function Layout({
  children,
  hideNavbar,
}: {
  children: React.ReactNode;
  hideNavbar: boolean;
}) {
  return (
    <>
      {!hideNavbar && <Navbar />}
      <main>{children}</main>
      <Footer />
      <HybridChatbot />
    </>
  );
}
