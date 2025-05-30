import React, { useContext, useEffect, useRef, useState } from "react";
import Cards from "../components/Cards";
import Button from "../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCirclePlus,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "../components/Modal";
import Input from "../components/Input";
import TextArea from "../components/TextArea";

import { backendUrl } from "../App";
import axios from "axios";

import Mandatory from "../components/Mandatory";
import Loading from "../components/Loading";
import OtpCustom from "../components/OtpCustom";
import SelectCustom from "../components/SelectCustom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmationModal from "../components/Confirmation";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvent,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ShopContext } from "../context/ShopContext";

const AccountPage = ({ token }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(
    sessionStorage.getItem("activeTab")
  );
  const [currentState, setCurrentState] = useState("");
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);
  let { getChart, getCartCount } = useContext(ShopContext);
  // let url = backendUrl + "/v1/api/";
  let url = backendUrl + "/v1/api/customer/profile";
  const fetchCustomer = async () => {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("sessions")}`,
        },
      });
      setCustomer(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching customer:", error);
    }
  };

  const setSessions = () => {
    sessionStorage.setItem("activeTab", currentState);
  };
  useEffect(() => {
    getChart();
    getCartCount();
    fetchCustomer();
  }, []);
  useEffect(() => {}, [customer]);
  useEffect(() => {
    if (activeTab === "address") {
      setActiveTab("address");
      setCurrentState("address");
    } else {
      setActiveTab("account");
      setCurrentState("account");
    }
  }, []);
  useEffect(() => {
    setSessions();
  }, [currentState, activeTab]);
  useEffect(() => {
    if (!token) {
      sessionStorage.removeItem("activeTab");
      navigate("/");
    }
  }, [token]);
  if (loading) return <Loading />;

  return (
    <div className="min-h-screen mt-[70px]">
      {/* Tabs */}
      <div className="mt-8 mb-8">
        <Cards>
          <div className="flex justify-center">
            <button
              className={`px-4 py-2 font-medium ${
                currentState === "account"
                  ? "text-black border-b-2 border-black"
                  : "text-gray-500"
              }`}
              onClick={() => setCurrentState("account")}
            >
              Account
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                currentState === "address"
                  ? "text-black border-b-2 border-black"
                  : "text-gray-500"
              }`}
              onClick={() => setCurrentState("address")}
            >
              Address
            </button>
          </div>
        </Cards>
      </div>

      {/* Content */}
      <div className="p-4">
        {currentState === "address" && <AddressTab customer={customer} />}
        {currentState === "account" && (
          <AccountTab customer={customer} setCustomer={setCustomer} />
        )}
      </div>
    </div>
  );
};

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Component to sync marker with center of the map

const CenterMarker = ({ coordinates, setCoordinates }) => {
  const map = useMap();

  // Sync map center when coordinates change
  useEffect(() => {
    map.setView([coordinates.lat, coordinates.lng], map.getZoom());
  }, [coordinates, map]);

  useMapEvent("moveend", () => {
    const center = map.getCenter();
    setCoordinates({ lat: center.lat, lng: center.lng });
  });

  return <Marker position={coordinates} icon={customIcon} />;
};

const AddressTab = ({ customer }) => {
  let url = backendUrl + "/v1/api/";
  const navigate = useNavigate();

  const [confirmModal, setConfirmModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const openConfirm = () => setConfirmModal(true);
  const closeConfirm = () => {
    setConfirmModal(false);
    resetModel();
  };

  const [modalHeader, setModalHeader] = useState("Add");
  const [activity, setActivity] = useState(null);

  const toastId = useRef(null);
  const toastIdError = useRef(null);

  const [addressId, setAddressId] = useState(null);

  const [address, setAddress] = useState(customer.addresses);
  const [searchQuery, setSearchQuery] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (activity === "delete") {
      try {
        let response = await axios.delete(
          url + "customer/profile/address?id=" + addressId,

          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("sessions")}`,
            },
          }
        );
        sessionStorage.setItem("toastMessage", "Successfully delete address");
        closeConfirm();
        setLoading(false);
        window.location.reload();
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    }
  };

  const deleteHandler = (index) => {
    let addres = address[index];
    setAddressId(addres.id);
    setActivity("delete");

    openConfirm();
  };

  const searchHandler = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = customer.addresses.filter(
      (addr) =>
        addr.labelAlamat.toLowerCase().includes(query) ||
        addr.penerima.toLowerCase().includes(query) ||
        addr.alamat.toLowerCase().includes(query) ||
        addr.phone.toLowerCase().includes(query)
    );
    setAddress(filtered);
  };
  useEffect(() => {
    const toastMessage = sessionStorage.getItem("toastMessage");
    if (toastMessage) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.success(toastMessage);
      }

      sessionStorage.removeItem("toastMessage");
    }
  }, []);
  const [showEntryAddress, setShowEntryAddress] = useState(false);
  const [noIndex, setNoIndex] = useState(0);
  const addHandler = () => {
    setModalHeader("Add");
    setShowEntryAddress(true);
  };
  const editHandler = (index) => {
    setModalHeader("Edit");
    setShowEntryAddress(true);
    setNoIndex(index);
  };
  const handleBack = () => {
    setShowEntryAddress(false);
  };
  useEffect(() => {}, [addressId]);

  useEffect(() => {}, [address]);
  useEffect(() => {}, [modalHeader, activity]);
  if (loading) return <Loading />;
  else if (showEntryAddress)
    return (
      <EntryAddress
        modalHeader={modalHeader}
        address={address}
        noIndex={noIndex}
        handleBack={handleBack}
      />
    );
  return (
    <div className="space-y-6 px-4 sm:px-8">
      <div className="flex flex-col lg:flex-row items-center justify-between w-full lg:w-3/4 space-y-4 lg:space-y-0">
        <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 flex-grow">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="text-gray-400 mr-3"
          />
          <input
            className="flex-1 outline-none bg-transparent text-sm text-gray-600 placeholder-gray-400"
            type="text"
            placeholder="Tulis Nama Alamat / Kota / Kecamatan tujuan pengiriman"
            onChange={searchHandler}
            value={searchQuery}
          />
        </div>
        <div className="lg:ml-4">
          <Button
            className="py-2 flex justify-center items-center"
            size="md"
            variant="dark"
            outline={true}
            type="button"
            onClick={addHandler}
          >
            <FontAwesomeIcon icon={faCirclePlus} /> &nbsp; Add New Address
          </Button>
        </div>
      </div>

      {/* Address List */}
      <div className="space-y-4">
        {/* Primary Address */}
        {address ? (
          address.map((addres, index) =>
            addres.utama === true ? (
              <div
                className="bg-green-100 border border-green-400 p-4  shadow rounded-lg"
                key={addres.id}
              >
                <div className="flex justify-between">
                  <h3 className="font-semibold">
                    {addres.labelAlamat}
                    <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                      Utama
                    </span>
                  </h3>
                  <span className="text-green-600 font-semibold">✓</span>
                </div>
                <p className="mt-1 font-medium">{addres.penerima}</p>
                <p className="text-gray-600">{addres.phone}</p>
                <p className="text-gray-600">{addres.alamat}</p>
                <div className="mt-2 flex space-x-4 ">
                  <button
                    className="text-green-600"
                    onClick={() => editHandler(index)}
                  >
                    Ubah Alamat
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => deleteHandler(index)}
                  >
                    Hapus Alamat
                  </button>
                </div>
              </div>
            ) : (
              <Cards key={addres.id}>
                <div className="flex justify-between">
                  <h3 className="font-semibold">{addres.labelAlamat}</h3>
                </div>
                <p className="mt-1 font-medium">{addres.penerima}</p>
                <p className="text-gray-600">{addres.phone}</p>
                <p className="text-gray-600">{addres.alamat}</p>
                <div className="mt-2 flex space-x-4 ">
                  <button
                    className="text-green-600"
                    onClick={() => editHandler(index)}
                  >
                    Ubah Alamat
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => deleteHandler(index)}
                  >
                    Hapus Alamat
                  </button>
                </div>
              </Cards>
            )
          )
        ) : (
          <Cards>
            <div className="flex justify-center items-center">
              No data found
            </div>
          </Cards>
        )}
      </div>
      <ConfirmationModal
        isOpen={confirmModal}
        onClose={closeConfirm}
        onSubmit={onSubmitHandler}
      />
    </div>
  );
};
const EntryAddress = ({ modalHeader, address, noIndex, handleBack }) => {
  let url = backendUrl + "/v1/api/";
  const navigate = useNavigate();
  // map punya
  const [coordinates, setCoordinates] = useState({
    lat: -6.2088,
    lng: 106.8456,
  }); // Default: Jakarta
  const [addressSearch, setAddressSearch] = useState("");
  const [searchQueryAddress, setSearchQueryAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  //SAMPE SINI MAP PUNYA
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState(null);
  const toastId = useRef(null);
  const toastIdError = useRef(null);
  const [addressId, setAddressId] = useState(null);
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
  const [zipCode, setZipCode] = useState("");
  const [defaultHome, setDefaultHome] = useState(false);

  const [error, setError] = useState({
    label: "",
    penerima: "",
    alamat: "",
    nomor: "",
    provinsi: "",
    kota: "",
    kecamatan: "",
    kelurahan: "",
    zipCode: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
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
  const resetData = () => {
    setProvinsi(null);
    setKota(null);
    setKecamatan(null);
    setKelurahan(null);
    setListKota(null);
    setListKecamatan(null);
    setListKelurahan(null);
    setAddressId(null);
    setLabelAlamat("");
    setNamaPenerima("");
    setAlamatLengkap("");
    setNomorHp("");
    setCatatan("");
    setDefaultHome(false);
    setZipCode("");
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    let labelError =
      labelAlamat === "" || labelAlamat === null ? "Label must be filled" : "";
    let nameError =
      namaPenerima === "" || namaPenerima === null
        ? "Receiver  must be filled"
        : "";
    let alamatError =
      alamatLengkap === "" || alamatLengkap === null
        ? "Full Address  must be filled"
        : "";
    let phoneError =
      nomorHp === null || nomorHp === "" ? "Phone Number must be filled" : "";
    let provinsiError = provinsi === null ? "Must Choose Province" : "";
    let kotaError = kota === null ? "Must Choose City" : "";
    let kecamatanError = kecamatan === null ? "Must Choose District" : "";
    let kelurahanError = kelurahan === null ? "Must Choose Urban" : "";
    let zipCodeError =
      zipCode === null || zipCode === "" ? "Zip Code Must be Filled" : "";
    let coordinateError =
      coordinates.lat === -6.2088 && coordinates.lng === 106.8456
        ? "Must Maker Map"
        : "";
    if (
      !labelError &&
      !nameError &&
      !alamatError &&
      !provinsiError &&
      !kotaError &&
      !kecamatanError &&
      !kelurahanError &&
      !zipCodeError &&
      !coordinateError
    ) {
      if (activity === "add") {
        let body = {
          id: null,
          labelAlamat: labelAlamat,
          penerima: namaPenerima,
          phone: nomorHp,
          alamat: alamatLengkap,
          provinsi: provinsi.value,
          kota: kota.value,
          kelurahan: kelurahan.value,
          kecamatan: kecamatan.value,
          optional: catatan,
          utama: defaultHome,
          zipCode: zipCode,
          lat: coordinates.lat,
          lon: coordinates.lng,
        };
        try {
          let response = await axios.post(
            url + "customer/profile/address",
            body,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("sessions")}`,
              },
            }
          );
          if (response.data.success) {
            if (!toast.isActive(toastId.current)) {
              toastId.current = toast.success("Successfully saved address");
            }
            backAction();
          } else {
            if (!toast.isActive(toastIdError.current)) {
              toastIdError.current = toast.error(response.data.data);
            }
          }
        } catch (error) {
          if (!toast.isActive(toastIdError.current)) {
            toastIdError.current = toast.error(error);
          }
        } finally {
          setLoading(false);
        }
      } else if (activity === "edit") {
        let body = {
          id: addressId,
          labelAlamat: labelAlamat,
          penerima: namaPenerima,
          phone: nomorHp,
          alamat: alamatLengkap,
          provinsi: provinsi.value,
          kota: kota.value,
          kelurahan: kelurahan.value,
          kecamatan: kecamatan.value,
          optional: catatan,
          utama: defaultHome,
          zipCode: zipCode,
          lat: coordinates.lat,
          lon: coordinates.lng,
        };
        try {
          let response = await axios.put(
            url + "customer/profile/address",
            body,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("sessions")}`,
              },
            }
          );
          if (response.data.success) {
            if (!toast.isActive(toastId.current)) {
              toastId.current = toast.success("Successfully update address");
            }
            backAction();
          } else {
            if (!toast.isActive(toastIdError.current)) {
              toastIdError.current = toast.error(response.data.data);
            }
          }
        } catch (error) {
          if (!toast.isActive(toastIdError.current)) {
            toastIdError.current = toast.error(error);
          }
        } finally {
          setLoading(false);
        }
      }
    } else {
      setError({
        label: labelError,
        penerima: nameError,
        alamat: alamatError,
        nomor: phoneError,
        provinsi: provinsiError,
        kota: kotaError,
        kecamatan: kecamatanError,
        kelurahan: kelurahanError,
        zipCode: zipCodeError,
      });
      if (coordinateError) {
        if (!toast.isActive(toastIdError.current)) {
          toastIdError.current = toast.error(coordinateError);
        }
      }
      setLoading(false);
    }
  };
  const addHandler = () => {
    setActivity("add");
  };
  const editHandler = (index) => {
    let addres = address[index];
    setAddressId(addres.id);
    console.log(addres);
    setActivity("edit");
    setLabelAlamat(addres.labelAlamat);
    setNamaPenerima(addres.penerima);
    setNomorHp(addres.phone);
    setAlamatLengkap(addres.alamat);
    provinsiChange(addres.provinsi);
    kotaChange(addres.kota);
    kecamatanChange(addres.kecamatan);
    kelurahanChange(addres.kelurahan);
    setCatatan(addres.optional);
    setDefaultHome(addres.utama);
    setZipCode(addres.zipCode);
    if (addres.lat != null && addres.lon != null) {
      setCoordinates({ lat: addres.lat, lng: addres.lon });
    }
  };
  useEffect(() => {
    fetchProvinsi();

    if (modalHeader == "Add") {
      addHandler();
    } else if (modalHeader == "Edit") {
      editHandler(noIndex);
    }
    setLoading(false);
  }, []);
  useEffect(() => {}, [listProvinsi, listKota, listKecamatan, listKelurahan]);
  useEffect(() => {}, [
    addressId,
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
    zipCode,
  ]);
  useEffect(() => {}, [address]);
  useEffect(() => {}, [modalHeader, activity]);
  // Get user's current location
  useEffect(() => {
    if ("geolocation" in navigator) {
      if (modalHeader == "Add") {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCoordinates({ lat: latitude, lng: longitude });
          },
          (error) => {
            console.error("Error getting location:", error);
            // alert("Location access denied. Using default location (Jakarta).");
          }
        );
      }
    } else {
      console.log("Geolocation is not supported by this browser.");
      // alert("Geolocation is not supported by this browser.");
    }
  }, []);
  // Reverse Geocode: Get Address from Lat/Lng
  useEffect(() => {
    const fetchAddress = async () => {
      const { lat, lng } = coordinates;
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
      try {
        const response = await axios.get(url);
        setAddressSearch(response.data.display_name);
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };

    fetchAddress();
  }, [coordinates]);

  // Fetch address suggestions (Only in Indonesia) when input has 3+ characters
  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]); // Clear suggestions if input is less than 3 characters
      return;
    }
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=id`;
    try {
      const response = await axios.get(url);
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };
  // Handle input change and fetch suggestions
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQueryAddress(query);
    fetchSuggestions(query);
  };

  // Handle selecting a suggested address
  const handleSelectSuggestion = (selectedLocation) => {
    setCoordinates({
      lat: parseFloat(selectedLocation.lat),
      lng: parseFloat(selectedLocation.lon),
    });
    setSearchQueryAddress(selectedLocation.display_name);
    setSuggestions([]); // Hide suggestions after selection
  };
  const backAction = () => {
    resetData();
    handleBack();
    window.location.reload();
  };
  if (loading) return <Loading />;
  return (
    <div className="space-y-6 px-4 sm:px-8">
      <div>
        <Button variant="secondary" onClick={() => backAction()}>
          <p>
            <FontAwesomeIcon icon={faArrowLeft} /> Back
          </p>
        </Button>
      </div>

      <Cards header={`${modalHeader} Address`}>
        <form
          className="flex flex-col w-full items-start gap-3  "
          onSubmit={onSubmitHandler}
        >
          <div className="w-full">
            <p className="mb-2">
              Label Alamat <Mandatory />
            </p>
            <Input
              className="w-full max-w-[500px] px-3 py-2"
              type="text"
              placeholder="Type here"
              value={labelAlamat}
              error={error.label}
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
              error={error.penerima}
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
              error={error.nomor}
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
              error={error.alamat}
              onChange={(e) => setAlamatLengkap(e.target.value)}
            />
          </div>
          <div className="w-full">
            <p className="mb-2">
              Provinsi <Mandatory />
            </p>
            <SelectCustom
              value={provinsi}
              onChange={provinsiChange}
              option={listProvinsi}
              error={error.provinsi}
            />
          </div>
          {listKota && (
            <div className="w-full">
              <p className="mb-2">
                Kota <Mandatory />
              </p>
              <SelectCustom
                value={kota}
                onChange={kotaChange}
                option={listKota}
                error={error.kota}
              />
            </div>
          )}
          {listKecamatan && (
            <div className="w-full">
              <p className="mb-2">
                Kecamatan <Mandatory />
              </p>
              <SelectCustom
                value={kecamatan}
                onChange={kecamatanChange}
                option={listKecamatan}
                error={error.kecamatan}
              />
            </div>
          )}
          {listKelurahan && (
            <div className="w-full">
              <p className="mb-2">
                Kelurahan <Mandatory />
              </p>
              <SelectCustom
                value={kelurahan}
                onChange={kelurahanChange}
                option={listKelurahan}
                error={error.kelurahan}
              />
            </div>
          )}
          <div className="w-full">
            <p className="mb-2">
              Kode Pos <Mandatory />
            </p>
            <Input
              className="w-full max-w-[500px] px-3 py-2"
              type="number"
              placeholder="Type here"
              value={zipCode}
              error={error.zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </div>
          <div className="w-full">
            <p className="mb-2">
              Pick Location <Mandatory />
            </p>
            {/* Address Search with Dropdown */}

            <div className="relative mb-4">
              <Input
                type="text"
                placeholder="Type here"
                value={searchQueryAddress}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              />
              {/* Dropdown List */}
              {suggestions.length > 0 && (
                <ul className="absolute top-12 left-0 w-full bg-white border shadow-md rounded-md max-h-40 overflow-y-auto z-50">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className="p-2 hover:bg-gray-200 cursor-pointer border-b"
                    >
                      {suggestion.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          {/* Map */}
          <div className="w-full">
            <MapContainer
              center={coordinates}
              zoom={13}
              className="h-96 w-full rounded-lg shadow-lg"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <CenterMarker
                coordinates={coordinates}
                setCoordinates={setCoordinates}
              />
            </MapContainer>
          </div>
          <div className="w-full">
            {/* Results */}

            <p className="text-gray-700">{addressSearch}</p>
          </div>
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
              checked={defaultHome}
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
      </Cards>
    </div>
  );
};
const AccountTab = ({ customer, setCustomer }) => {
  //ini belom selesai ya den
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
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
                    {customer.emailVerified
                      ? "Terverifikasi"
                      : "Belum Terverifikasi"}
                  </span>
                </div>
                <div className="flex justify-center sm:justify-start items-center space-x-2">
                  <Button
                    className="py-2 font-medium sm:items-center w-20"
                    variant="dark"
                    outline={false}
                    type="button"
                    size="sm"
                    onClick={openModal}
                  >
                    Ubah
                  </Button>
                </div>
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
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        maxWidth="max-w-xl"
        closeButton={true}
        closeOnOutsideClick={false}
        autoScroll={false}
      >
        <OtpCustom email={customer.email} />
      </Modal>
      <div className="mb-4">
        <Cards>
          <div className="mt-6 mb-6">
            <div className=" items-center">
              <div className="flex items-center justify-center gap-y-2">
                <Button
                  className="py-2"
                  variant="dark"
                  outline={true}
                  type="button"
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
