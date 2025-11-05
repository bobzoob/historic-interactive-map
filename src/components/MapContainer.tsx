import { MapContainer as LeafletMapContainer, TileLayer } from "react-leaflet";
import { Box } from "@mui/material";
import type { HistoricalFeatureCollection } from "../types/geojson";
import GeoJSONLayer from "./GeoJSONLayer";
import type { LayerConfig, TimeRange } from "../App";
import TimelineControl from "./TimelineControl";
import { useMemo } from "react"; // this is for performance issues
import PointLayer from "./PointLayer";
import ArrowLayer from "./ArrowLayer";

interface MapContainerProps {
  data: Record<string, HistoricalFeatureCollection> | null;
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
  // const territoriesLayer = layers.find((layer) => layer.id === "territories-1");
  //
  const filteredData = useMemo(() => {
    if (!data) return null;

    const newFilteredData: Record<string, HistoricalFeatureCollection> = {};

    // here we loop over each entry in the layer data ("territories-1", "events-1", etc.)
    for (const layerId in data) {
      const featureCollection = data[layerId];
      newFilteredData[layerId] = {
        type: "FeatureCollection",
        features: featureCollection.features.filter((feature) => {
          const featureStartYear = new Date(
            feature.properties.startDate
          ).getFullYear();
          const featureEndYear = new Date(
            feature.properties.endDate
          ).getFullYear();
          const [selectedStartYear, selectedEndYear] = timeRange;
          return (
            featureStartYear <= selectedEndYear &&
            featureEndYear >= selectedStartYear
          );
        }),
      };
    }
    return newFilteredData;
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
        {filteredData &&
          layers.map((layer) => {
            if (!layer.visible) {
              return null;
            }
            // key is on the component itself
            switch (layer.type) {
              // ** add new component here **
              // case "battle":
              //   return <BattleLayer key={layer.id} data={filteredData[layer.id]} />;
              case "polygon":
                return (
                  <GeoJSONLayer
                    key={layer.id} // key is essential for React rendering
                    data={filteredData[layer.id]}
                    timeRangeKey={timeRange}
                  />
                );
              case "point":
                return (
                  <PointLayer key={layer.id} data={filteredData[layer.id]} />
                );
              case "line":
                return (
                  <ArrowLayer key={layer.id} data={filteredData[layer.id]} />
                );

              default:
                // handle unknown types
                console.warn("received unknown layer type: ${layer.type}");
                return null;
            }
          })}
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
