import { Box } from "@mui/material";
import type { HistoricalFeatureCollection } from "../types/geojson";
import type { LayerConfig, TimeRange } from "../App";
import TimelineControl from "./TimelineControl";
import MapWrapper from "./MapWrapper";
import LayerManager from "./LayerManager";

interface MapContainerProps {
  data: Record<string, HistoricalFeatureCollection> | null;
  layers: LayerConfig[];
  timeRange: TimeRange;
  liveTimeRange: TimeRange;
  onTimeChangeCommitted: (newRange: TimeRange) => void;
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
  // const featureFilter = (feature: any) => {
  //   const featureStartYear = new Date(
  //     feature.properties.startDate
  //   ).getFullYear();
  //   const featureEndYear = new Date(feature.properties.endDate).getFullYear();
  //   const [selectedStartYear, selectedEndYear] = timeRange;
  //   return (
  //     featureStartYear <= selectedEndYear && featureEndYear >= selectedStartYear
  //   );
  // };

  return (
    <Box sx={{ height: "100%", width: "100%", position: "relative" }}>
      <MapWrapper>
        <LayerManager
          layers={layers}
          data={data}
          timeRange={timeRange}
          // featureFilter={featureFilter}
        />
      </MapWrapper>
      <TimelineControl
        range={liveTimeRange}
        onTimeChange={onTimeChangeLive}
        onTimeChangeCommitted={onTimeChangeCommitted}
      />
    </Box>
  );
}

export default MapContainer;
