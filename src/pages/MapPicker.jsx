import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvent,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import Cards from "../components/Cards";

// Custom Leaflet Marker Icon
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

const MapPicker = () => {
  const [coordinates, setCoordinates] = useState({
    lat: -6.2088,
    lng: 106.8456,
  }); // Default: Jakarta
  const [address, setAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Get user's current location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Location access denied. Using default location (Jakarta).");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, []);

  // Reverse Geocode: Get Address from Lat/Lng
  useEffect(() => {
    const fetchAddress = async () => {
      const { lat, lng } = coordinates;
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
      try {
        const response = await axios.get(url);

        setAddress(response.data.display_name);
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
    setSearchQuery(query);
    fetchSuggestions(query);
  };

  // Handle selecting a suggested address
  const handleSelectSuggestion = (selectedLocation) => {
    setCoordinates({
      lat: parseFloat(selectedLocation.lat),
      lng: parseFloat(selectedLocation.lon),
    });
    setSearchQuery(selectedLocation.display_name);
    setSuggestions([]); // Hide suggestions after selection
  };

  return (
    <Cards>
      <div className="p-4">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita
          dignissimos, ratione excepturi odio nam dolore corrupti in incidunt
          nesciunt dolorum a asperiores non unde quisquam amet accusantium,
          saepe hic. Maiores.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita
          dignissimos, ratione excepturi odio nam dolore corrupti in incidunt
          nesciunt dolorum a asperiores non unde quisquam amet accusantium,
          saepe hic. Maiores.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita
          dignissimos, ratione excepturi odio nam dolore corrupti in incidunt
          nesciunt dolorum a asperiores non unde quisquam amet accusantium,
          saepe hic. Maiores.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita
          dignissimos, ratione excepturi odio nam dolore corrupti in incidunt
          nesciunt dolorum a asperiores non unde quisquam amet accusantium,
          saepe hic. Maiores.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita
          dignissimos, ratione excepturi odio nam dolore corrupti in incidunt
          nesciunt dolorum a asperiores non unde quisquam amet accusantium,
          saepe hic. Maiores.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita
          dignissimos, ratione excepturi odio nam dolore corrupti in incidunt
          nesciunt dolorum a asperiores non unde quisquam amet accusantium,
          saepe hic. Maiores.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita
          dignissimos, ratione excepturi odio nam dolore corrupti in incidunt
          nesciunt dolorum a asperiores non unde quisquam amet accusantium,
          saepe hic. Maiores.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita
          dignissimos, ratione excepturi odio nam dolore corrupti in incidunt
          nesciunt dolorum a asperiores non unde quisquam amet accusantium,
          saepe hic. Maiores.
        </p>
        <h3 className="text-lg font-semibold mb-3">
          Pilih Lokasi atau Cari Alamat (Hanya Indonesia)
        </h3>

        {/* Address Search with Dropdown */}
        <div className="relative mb-4 z-50">
          <input
            type="text"
            placeholder="Ketik minimal 3 huruf untuk mencari..."
            value={searchQuery}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          />
          {/* Dropdown List */}
          {suggestions.length > 0 && (
            <ul className="absolute top-12 left-0 w-full bg-white border shadow-md rounded-md max-h-40 overflow-y-auto z-[9999]">
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

        {/* Map */}
        <div className="relative">
          <MapContainer
            center={coordinates}
            zoom={13}
            className="h-96 w-full rounded-lg shadow-lg "
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <CenterMarker
              coordinates={coordinates}
              setCoordinates={setCoordinates}
            />
          </MapContainer>

          {/* Static Marker Icon (for visual clarity) */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full z-50 pointer-events-none">
            <img
              src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png"
              alt="marker"
              className="w-6 h-9"
            />
          </div>
        </div>

        {/* Results */}
        <p className="mt-3 text-gray-700">
          <strong>Koordinat:</strong> {coordinates.lat}, {coordinates.lng}
        </p>
        <p className="text-gray-700">
          <strong>Alamat:</strong> {address}
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita
          dignissimos, ratione excepturi odio nam dolore corrupti in incidunt
          nesciunt dolorum a asperiores non unde quisquam amet accusantium,
          saepe hic. Maiores.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita
          dignissimos, ratione excepturi odio nam dolore corrupti in incidunt
          nesciunt dolorum a asperiores non unde quisquam amet accusantium,
          saepe hic. Maiores.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita
          dignissimos, ratione excepturi odio nam dolore corrupti in incidunt
          nesciunt dolorum a asperiores non unde quisquam amet accusantium,
          saepe hic. Maiores.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita
          dignissimos, ratione excepturi odio nam dolore corrupti in incidunt
          nesciunt dolorum a asperiores non unde quisquam amet accusantium,
          saepe hic. Maiores.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita
          dignissimos, ratione excepturi odio nam dolore corrupti in incidunt
          nesciunt dolorum a asperiores non unde quisquam amet accusantium,
          saepe hic. Maiores.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita
          dignissimos, ratione excepturi odio nam dolore corrupti in incidunt
          nesciunt dolorum a asperiores non unde quisquam amet accusantium,
          saepe hic. Maiores.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita
          dignissimos, ratione excepturi odio nam dolore corrupti in incidunt
          nesciunt dolorum a asperiores non unde quisquam amet accusantium,
          saepe hic. Maiores.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita
          dignissimos, ratione excepturi odio nam dolore corrupti in incidunt
          nesciunt dolorum a asperiores non unde quisquam amet accusantium,
          saepe hic. Maiores.
        </p>
      </div>
    </Cards>
  );
};

export default MapPicker;
