import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

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
    </>
  );
}
