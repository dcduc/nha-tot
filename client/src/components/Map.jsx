import { MapContainer, TileLayer } from "react-leaflet";
import GeoCoderMarker from "./GeoCoderMarker";

import PropTypes from "prop-types";

export default function Map({ address }) {
  return (
    <>
      {address && (
        <MapContainer
          center={[53.35, 18.8]}
          zoom={1}
          scrollWheelZoom={false}
          style={{
            height: "40vh",
            width: "100%",
            marginTop: "20px",
            zIndex: 0,
          }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <GeoCoderMarker address={address} />
        </MapContainer>
      )}
    </>
  );
}

Map.propTypes = {
  address: PropTypes.string.isRequired,
};
