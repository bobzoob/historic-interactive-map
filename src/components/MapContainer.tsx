import { MapContainer as LeafletMapContainer, TileLayer } from "react-leaflet";
import { Box } from "@mui/material";
import type { HistoricalFeatureCollection } from "../types/geojson";
import GeoJSONLayer from "./GeoJSONLayer";
import type { LayerConfig, TimeRange } from "../App";
import TimelineControl from "./TimelineControl";
import { useMemo } from "react"; // this is for performance issues

interface MapContainerProps {
  data: HistoricalFeatureCollection | null;
  layers: LayerConfig[];
  timeRange: TimeRange;
  liveTimeRange: TimeRange;
  // handler for when the drag finishes
  onTimeChangeCommitted: (newRange: TimeRange) => void;
  // handler for during the drag
  onTimeChangeLive: (newRange: TimeRange) => void;
}

function MapContainer({
  data,
  layers,
  timeRange,
  liveTimeRange,
  onTimeChangeCommitted,
  onTimeChangeLive,
}: MapContainerProps) {
  // console.log("MapContainer received data:", data);

  // we must find the layers config, only get data and render, if visible true
  const territoriesLayer = layers.find((layer) => layer.id === "territories-1");
  //
  const filteredData = useMemo(() => {
    if (!data) return null;

    // GeoJSON FeatureCollection
    const newFeatureCollection: HistoricalFeatureCollection = {
      type: "FeatureCollection",
      features: data.features.filter((feature) => {
        // parse correctly for comparison
        const featureStartYear = new Date(
          feature.properties.startDate
        ).getFullYear();
        const featureEndYear = new Date(
          feature.properties.endDate
        ).getFullYear();
        const [selectedStartYear, selectedEndYear] = timeRange;

        // conditions:
        // start must be < slider-end AND end must be > slider-start
        return (
          featureStartYear <= selectedEndYear &&
          featureEndYear >= selectedStartYear
        );
      }),
    };

    return newFeatureCollection;
  }, [data, timeRange]); // dependency array= React (useMemo) will rerender ONLY if data or timeRange change

  return (
    // box wrapper controls size of the map
    // 100% fill all space of its parent container
    <Box sx={{ height: "100%", width: "100%", position: "relative" }}>
      <LeafletMapContainer
        // initial geographical center
        center={[48.2082, 16.3738]}
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
        {territoriesLayer?.visible && filteredData && (
          <GeoJSONLayer data={filteredData} timeRangeKey={timeRange} />
        )}
      </LeafletMapContainer>
      <TimelineControl
        range={liveTimeRange} // UI uses LIVE range
        onTimeChange={onTimeChangeLive} // live drag handler
        onTimeChangeCommitted={onTimeChangeCommitted} // committed handler
      />
    </Box>
  );
}

export default MapContainer;
