import React, { useEffect, useState } from "react";

const AnnounchmentBar = ({ isVisible }) => {
  //   const [isVisible, setIsVisible] = useState(true);

  //   const handleScroll = () => {
  //     if (window.scrollY > 50) {
  //       setIsVisible(false);
  //     } else {
  //       setIsVisible(true);
  //     }
  //   };

  //   useEffect(() => {
  //     window.addEventListener("scroll", handleScroll);
  //     return () => window.removeEventListener("scroll", handleScroll);
  //   }, []);

  return (
    <div
      className={`top-0 w-full p-4 bg-blue-500 text-white text-center transition-transform duration-300 ${
        isVisible ? "transform translate-y-0" : "transform -translate-y-full"
      }`}
    >
      Dapatkan potongan Ongkir Rp 15.000 minimum pembelian Rp. 250.000 ke
      seluruh Indonesia
    </div>
  );
};

export default AnnounchmentBar;
