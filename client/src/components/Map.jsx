import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import PropTypes from "prop-types";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaulIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaulIcon;

export default function Map({ address }) {
  const [position, setPosition] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosition = async () => {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search`,
          {
            params: {
              q: address,
              format: "json",
              addressdetails: 1,
              limit: 1,
            },
            headers: {
              "Accept-Language": "en", // Thiết lập ngôn ngữ phản hồi
            },
          }
        );
        const results = response.data;
        if (results && results.length > 0) {
          const { lat, lon } = results[0];
          setPosition([parseFloat(lat), parseFloat(lon)]);
        }
      } catch (error) {
        console.error("Error fetching geocode data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      fetchPosition();
    }
  }, [address]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {address && (
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={true}
          style={{
            height: "40vh",
            width: "100%",
            marginTop: "20px",
            zIndex: 0,
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={DefaulIcon}></Marker>
          {/* <GeoCoderMarker address={address} /> */}
        </MapContainer>
      )}
    </>
  );
}

Map.propTypes = {
  address: PropTypes.string.isRequired,
};
