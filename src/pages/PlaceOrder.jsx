import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { ShopContext } from "../context/ShopContext";
import Cards from "../components/Cards";

const PlaceOrder = ({ token }) => {
  // text yang ada belom responsive dan belom ke warp
  const { navigate } = useContext(ShopContext);
  const { address, setAddress } = useState("");
  return (
    <div className="bg-gray-200 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Pengiriman</h1>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section: Shipping Address */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              ALAMAT PENGIRIMAN
            </h2>
            <p className="text-green-600 font-semibold mb-2">
              📍 alamat rumah • Dendy Tiawan Putra
            </p>
            <p className="text-gray-600 text-sm">
              jalan tebet barat VI B nomor 2, Tebet, Jakarta Selatan, DKI
              Jakarta, 087887693187
            </p>
            <div className="flex gap-4 mt-4">
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded">
                Ganti Alamat
              </button>
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded">
                Kirim ke Beberapa Alamat
              </button>
            </div>
          </div>

          {/* Middle Section: Cart Items */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Golden Cakery
            </h2>

            {/* Product List */}
            <div className="space-y-4">
              {/* Item 1 */}
              <div className="flex items-center gap-4">
                <img
                  src="https://via.placeholder.com/80"
                  alt="Product"
                  className="w-16 h-16 rounded"
                />
                <div>
                  <h3 className="text-gray-700 font-semibold text-sm">
                    MAKARONI SPIRAL / MACARONI SPIRAL/ RASA JAGUNG BAKAR 250
                    GRAM
                  </h3>
                  <p className="text-gray-500 text-sm">1 x Rp20.688</p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-center gap-4">
                <img
                  src="https://via.placeholder.com/80"
                  alt="Product"
                  className="w-16 h-16 rounded"
                />
                <div>
                  <h3 className="text-gray-700 font-semibold text-sm">
                    SUMPIA SUMPIAH UDANG PEDAS CHILI SPRING ROLL 250GRAM
                  </h3>
                  <p className="text-gray-500 text-sm">1 x Rp27.930</p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-center gap-4">
                <img
                  src="https://via.placeholder.com/80"
                  alt="Product"
                  className="w-16 h-16 rounded"
                />
                <div>
                  <h3 className="text-gray-700 font-semibold text-sm">
                    Kacang Telur Medan Spesial - 500 Gram
                  </h3>
                  <p className="text-gray-500 text-sm">1 x Rp37.240</p>
                </div>
              </div>
            </div>

            {/* Notes Input */}
          </div>

          {/* Right Section: Pilih Pengiriman */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Pengiriman</h2>
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded w-full">
              Pilih Pengiriman
            </button>
            <div className="mt-6">
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Catatan untuk Toko (Opsional)
              </label>
              <input
                type="text"
                id="notes"
                placeholder="Tambahkan catatan, misalnya: Jangan terlalu pedas"
                className="w-full p-2 border rounded text-gray-700"
              />
            </div>
          </div>

          {/* Order Summary: Full Width */}
          <div className="bg-white p-6 rounded-lg shadow lg:col-span-3">
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Ringkasan belanja
            </h2>
            <div className="text-gray-700">
              {/* Price Details */}
              <div className="flex justify-between mb-2">
                <span>Total Harga (3 Barang)</span>
                <span>Rp85.858</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Total Belanja</span>
                <span>-</span>
              </div>
            </div>

            {/* Donation Checkbox */}
            <div className="mt-4">
              <div className="flex items-center mb-4">
                <input type="checkbox" id="donation" className="mr-2" />
                <label htmlFor="donation" className="text-gray-600 text-sm">
                  Top Donasi Sembako untuk Masyarakat Prasejahtera (Rp5.000)
                </label>
              </div>

              {/* Promo Button */}
              <button className="bg-yellow-100 text-yellow-600 px-4 py-2 rounded mb-4 w-full">
                Makin hemat pakai promo
              </button>

              {/* Payment Button */}
              <button className="bg-green-600 text-white px-4 py-2 rounded w-full">
                Pilih Pembayaran
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    //     <div className="px-8 flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
    //       {/* left side */}
    //       <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
    //         <Cards
    //           header={
    //             <div className="text-xl sm:text-2xl my-3">
    //               <Title text1={"DELIVERY"} text2={"INFORMATION"} />
    //             </div>
    //           }
    //         >
    //           <div className="flex gap-3">
    //             <input
    //               className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
    //               type="text"
    //               placeholder="First name"
    //             />
    //             <input
    //               className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
    //               type="text"
    //               placeholder="Last name"
    //             />
    //           </div>
    //           <input
    //             className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
    //             type="email"
    //             placeholder="Email address"
    //           />
    //           <input
    //             className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
    //             type="text"
    //             placeholder="Address"
    //           />
    //           <div className="flex gap-3">
    //             <input
    //               className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
    //               type="text"
    //               placeholder="City"
    //             />
    //             <input
    //               className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
    //               type="text"
    //               placeholder="State"
    //             />
    //           </div>
    //           <div className="flex gap-3">
    //             <input
    //               className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
    //               type="number"
    //               placeholder="ZipCode"
    //             />
    //             <input
    //               className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
    //               type="text"
    //               placeholder="Country"
    //             />
    //           </div>
    //           <input
    //             className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
    //             type="number"
    //             placeholder="Phone"
    //           />
    //         </Cards>
    //       </div>
    //       {/* right side */}
    //       <div className="mt-8">
    //         <div className="mt-8 min-w-80">
    //           <CartTotal />
    //         </div>
    //         {/* payment method */}
    //         <div className="mt-12">
    //           {/* <Title text1={'PAYMENT'} text2={'METHOD'} />

    //           <div className="flex gap-3 flex-col lg:flex-row">

    //           </div> */}

    //           <div className="w-full text-end mt-8">
    //             <button
    //               onClick={() => navigate("/orders")}
    //               className="bg-black text-white px-16 py-3 text-sm"
    //             >
    //               CHECKOUT
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
  );
};

export default PlaceOrder;
