// we use a slihtly different name for our container to avoid collision
import { MapContainer as LeafletMapContainer, TileLayer } from "react-leaflet";
import { Box } from "@mui/material";
import type { HistoricalFeatureCollection } from "../types/geojson";
import GeoJSONLayer from "./GeoJSONLayer";
import type { LayerConfig } from "../App";

interface MapContainerProps {
  data: HistoricalFeatureCollection | null;
  layers: LayerConfig[];
}

function MapContainer({ data, layers }: MapContainerProps) {
  // console.log("MapContainer received data:", data);

  // we must find the layers config, only get data and render, if visible true
  const territoriesLayer = layers.find((layer) => layer.id === "territories-1");

  return (
    // box wrapper controls size of the map
    // "100%"' fill all space of its parent container
    <Box sx={{ height: "100%", width: "100%" }}>
      <LeafletMapContainer
        // 'center' initial geographical center
        center={[51.505, -0.09]}
        zoom={11}
        // to let map fill up container 100%
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          // attribution displays license information
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* this is called conditional rendering: only when all true, its redered */}
        {data && territoriesLayer && territoriesLayer.visible && (
          <GeoJSONLayer data={data} />
        )}
      </LeafletMapContainer>
    </Box>
  );
}

export default MapContainer;
