import React, { useEffect, useState } from "react";
import Cards from "../components/Cards";
import Button from "../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "../components/Modal";
import Input from "../components/Input";
import TextArea from "../components/TextArea";

import { backendUrl } from "../App";
import axios from "axios";
import Select from "../components/SelectCustom";
import Mandatory from "../components/Mandatory";
import Loading from "../components/Loading";

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <div className="min-h-screen">
      {/* Tabs */}
      <div className="mt-8 mb-8">
        <Cards>
          <div className="flex justify-center">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "account"
                  ? "text-black border-b-2 border-black"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("account")}
            >
              Account
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "address"
                  ? "text-black border-b-2 border-black"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("address")}
            >
              Address
            </button>
          </div>
        </Cards>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === "address" && <AddressTab />}
        {activeTab === "account" && <AccountTab />}
      </div>
    </div>
  );
};

const AddressTab = () => {
  let url = backendUrl + "/v1/api/";
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const [modalHeader, setModalHeader] = useState("Add ");

  const [provinsi, setProvinsi] = useState(null);
  const [kota, setKota] = useState(null);
  const [kecamatan, setKecamatan] = useState(null);
  const [kelurahan, setKelurahan] = useState(null);

  const [listProvinsi, setListProvinsi] = useState(null);
  const [listKota, setListKota] = useState(null);
  const [listKecamatan, setListKecamatan] = useState(null);
  const [listKelurahan, setListKelurahan] = useState(null);

  const [labelAlamat, setLabelAlamat] = useState("");
  const [namaPenerima, setNamaPenerima] = useState("");
  const [alamatLengkap, setAlamatLengkap] = useState("");
  const [nomorHp, setNomorHp] = useState("");
  const [catatan, setCatatan] = useState("");
  const [defaultHome, setDefaultHome] = useState(false);

  const fetchProvinsi = async () => {
    let response = await axios.get(url + "address/provinsi");
    let data = response.data.data;
    setListProvinsi(data);
  };

  const fetchKota = async (value) => {
    let response = await axios.get(url + "address/provinsi/" + value);
    let data = response.data.data;
    setListKota(data);
  };
  const fetchKecamatan = async (value) => {
    let response = await axios.get(url + "address/kota/" + value);
    let data = response.data.data;
    setListKecamatan(data);
  };

  const fetchKelurahan = async (value) => {
    let response = await axios.get(url + "address/kecamatan/" + value);
    let data = response.data.data;
    setListKelurahan(data);
  };
  const provinsiChange = (option) => {
    setProvinsi(option || []);
    setListKota(null);
    setKota(null);
    setKecamatan(null);
    setListKecamatan(null);
    setKelurahan(null);
    setListKelurahan(null);
    fetchKota(option.value);
  };
  const kotaChange = (option) => {
    setKota(option || []);
    setKecamatan(null);
    setListKecamatan(null);
    setKelurahan(null);
    setListKelurahan(null);
    fetchKecamatan(option.value);
  };

  const kecamatanChange = (option) => {
    setKecamatan(option || []);
    setKelurahan(null);
    setListKelurahan(null);
    fetchKelurahan(option.value);
  };

  const kelurahanChange = (option) => {
    setKelurahan(option || []);
  };
  useEffect(() => {
    fetchProvinsi();
  }, []);

  useEffect(() => {}, [listProvinsi, listKota, listKecamatan, listKelurahan]);
  useEffect(() => {}, [
    alamatLengkap,
    namaPenerima,
    labelAlamat,
    kota,
    provinsi,
    kecamatan,
    kelurahan,
    nomorHp,
    defaultHome,
    catatan,
  ]);
  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 w-3/4 sm:w-1/2">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="text-gray-400 mr-3"
          />
          <input
            className="flex-1 outline-none bg-transparent text-sm text-gray-600 placeholder-gray-400"
            type="text"
            placeholder="Tulis Nama Alamat / Kota / Kecamatan tujuan pengiriman"
          />
        </div>
        <Button
          className="py-2"
          size="lg"
          variant="dark"
          outline={true}
          type="button"
          onClick={openModal}
        >
          <FontAwesomeIcon icon={faCirclePlus} /> &nbsp; Add New Address
        </Button>
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          header={`${modalHeader} Address`}
          maxWidth="max-w-xl"
          closeButton={true}
          closeOnOutsideClick={false}
          autoScroll={false}
        >
          <form className="flex flex-col w-full items-start gap-3 max-h-[450px]">
            <div className="w-full">
              <p className="mb-2">
                Label Alamat <Mandatory />
              </p>
              <Input
                className="w-full max-w-[500px] px-3 py-2"
                type="text"
                placeholder="Type here"
                value={labelAlamat}
                onChange={(e) => setLabelAlamat(e.target.value)}
              />
            </div>
            <div className="w-full">
              <p className="mb-2">
                Nama Penerima <Mandatory />
              </p>
              <Input
                className="w-full max-w-[500px] px-3 py-2"
                type="text"
                placeholder="Type here"
                value={namaPenerima}
                onChange={(e) => setNamaPenerima(e.target.value)}
              />
            </div>
            <div className="w-full">
              <p className="mb-2">
                Nomor Telephone <Mandatory />
              </p>
              <Input
                className="w-full max-w-[500px] px-3 py-2"
                type="number"
                placeholder="Type here"
                value={nomorHp}
                onChange={(e) => setNomorHp(e.target.value)}
              />
            </div>
            <div className="w-full">
              <p className="mb-2">
                Alamat Lengkap <Mandatory />
              </p>
              <TextArea
                className="w-full max-w-[500px] px-3 py-2"
                placeholder="Type here"
                value={alamatLengkap}
                onChange={(e) => setAlamatLengkap(e.target.value)}
              />
            </div>
            <div className="w-full">
              <p className="mb-2">
                Provinsi <Mandatory />
              </p>
              <Select
                value={provinsi}
                onChange={provinsiChange}
                option={listProvinsi}
              />
            </div>
            {listKota && (
              <div className="w-full">
                <p className="mb-2">
                  Kota <Mandatory />
                </p>
                <Select value={kota} onChange={kotaChange} option={listKota} />
              </div>
            )}
            {listKecamatan && (
              <div className="w-full">
                <p className="mb-2">
                  Kecamatan <Mandatory />
                </p>
                <Select
                  value={kecamatan}
                  onChange={kecamatanChange}
                  option={listKecamatan}
                />
              </div>
            )}
            {listKelurahan && (
              <div className="w-full">
                <p className="mb-2">
                  Kelurahan <Mandatory />
                </p>
                <Select
                  value={kelurahan}
                  onChange={kelurahanChange}
                  option={listKelurahan}
                />
              </div>
            )}
            <div className="w-full">
              <p className="mb-2">Catatan untuk kurir</p>
              <Input
                className="w-full max-w-[500px] px-3 py-2"
                type="text"
                placeholder="Warna rumah, patokan, pesan khusus, dll."
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
              />
            </div>
            <div className="flex gap-2 mt-2">
              <input
                type="checkbox"
                id="defaultHome"
                onChange={(e) => setDefaultHome(e.target.checked)}
              />
              <label className="cursor-pointer" htmlFor="defaultHome">
                Jadikan Alamat Utama
              </label>
            </div>
            <Button
              className="py-2 w-full"
              size="lg"
              variant="dark"
              outline={true}
              type="submit"
            >
              Save
            </Button>
          </form>
        </Modal>
      </div>

      {/* Address List */}
      <div className="space-y-4">
        {/* Primary Address */}
        <div className="bg-green-100 border border-green-400 p-4 rounded shadow">
          <div className="flex justify-between">
            <h3 className="font-semibold">
              Alamat Rumah
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                Utama
              </span>
            </h3>
            <span className="text-green-600 font-semibold">✓</span>
          </div>
          <p className="mt-1 font-medium">Dendy Tiawan Putra</p>
          <p className="text-gray-600">087887693187</p>
          <p className="text-gray-600">Jalan Tebet Barat VI B nomor 2</p>
          <div className="mt-2 flex space-x-4 text-green-600">
            <button>Ubah Alamat</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AccountTab = () => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  let url = backendUrl + "/v1/api/customer/profile";
  const fetchCustomer = async () => {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCustomer(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching customer:", error);
    }
  };
  useEffect(() => {
    fetchCustomer();
  }, []);
  useEffect(() => {
    console.log(customer);
  }, [customer]);
  if (loading) return <Loading />;
  return (
    <div>
      <div className="mb-4">
        <Cards header={"Biodata Diri"}>
          <div className="pt-4">
            <p className="text-gray-600">Isi informasi akun Anda di sini.</p>
          </div>
          <div className="mt-6 ">
            {/* Use grid layout for alignment */}
            <div className="grid gap-4 items-center">
              {/* Name */}
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-y-2">
                <p className="text-gray-700 text-center sm:text-center">Nama</p>
                <p className="text-gray-900 font-medium text-center sm:text-left">
                  {customer.name}
                </p>
                <button className="text-green-600 font-medium text-center sm:text-left">
                  Ubah
                </button>
              </div>

              {/* Email */}
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-y-2">
                <p className="text-gray-700 text-center sm:text-center">
                  Email
                </p>
                <div className="flex justify-center sm:justify-start items-center space-x-2">
                  <p className="text-gray-900 font-medium">{customer.email}</p>

                  <span
                    className={`bg-green-100 ${
                      customer.emailVerified ? "text-green-600" : "text-red-600"
                    }  text-xs px-2 py-1 rounded`}
                  >
                    Terverifikasi
                  </span>
                </div>
                <button className="text-green-600 font-medium text-center sm:text-left">
                  Ubah
                </button>
              </div>

              {/* Phone Number */}

              {/* <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-y-2">
              <p className="text-gray-700 text-center sm:text-center">
                Phone Number
              </p>
              <div className="flex justify-center sm:justify-start items-center space-x-2">
                <p className="text-gray-900 font-medium">123456789</p>
                <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded">
                  Terverifikasi
                </span>
              </div>
              <div className="flex justify-center sm:justify-start items-center space-x-2">
                <button className="text-green-600 font-medium text-center sm:text-left">
                  Ubah
                </button>
                <button>Verifikasi</button>
              </div>
            </div> */}
            </div>
          </div>
        </Cards>
      </div>
      <div className="mb-4">
        <Cards>
          <div className="mt-6 mb-6">
            <div className=" items-center">
              <div className="flex items-center justify-center gap-y-2">
                <Button
                  className="py-2"
                  variant="dark"
                  outline={true}
                  type="submit"
                >
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        </Cards>
      </div>
    </div>
  );
};

export default AccountPage;
