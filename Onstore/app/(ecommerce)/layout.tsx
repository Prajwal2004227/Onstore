import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import React from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="bg-gray-900">
      <Navbar />
      <div className="py-20">{children}</div>
      <Footer />
    </div>
  );
};

export default layout;
