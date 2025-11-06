import { MapContainer as LeafletMapContainer, TileLayer } from "react-leaflet";
import type { ReactNode } from "react";

interface MapWrapperProps {
  children: ReactNode;
}

function MapWrapper({ children }: MapWrapperProps) {
  return (
    <LeafletMapContainer
      center={[48.2082, 16.3738]}
      zoom={9}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </LeafletMapContainer>
  );
}

export default MapWrapper;
