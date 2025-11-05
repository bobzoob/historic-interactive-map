import { GeoJSON } from "react-leaflet";
import type { HistoricalFeatureCollection } from "../types/geojson";
import type { Layer } from "leaflet";
import type { TimeRange } from "../App";

interface GeoJSONLayerProps {
  data: HistoricalFeatureCollection;
  timeRangeKey: TimeRange;
}

function GeoJSONLayer({ data, timeRangeKey }: GeoJSONLayerProps) {
  // onEachFeature is a hook function by leaflet. it wil run once for every single feature in the GeoJSON data
  const onEachFeature = (feature: any, layer: Layer) => {
    // if all es rendered correctly
    if (feature.properties && feature.properties.name) {
      // attach popup to the layer (polygon)
      layer.bindPopup(
        `<strong>${feature.properties.name}</strong><p>${feature.properties.description}</p>` // html code possible
      );
    }
  };

  return (
    <GeoJSON
      // key= to update the layer
      key={timeRangeKey.join("-")}
      data={data}
      onEachFeature={onEachFeature}
    />
  );
}

export default GeoJSONLayer;
