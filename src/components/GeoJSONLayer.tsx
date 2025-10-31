import { GeoJSON } from "react-leaflet";
import type {
  HistoricalFeature,
  HistoricalFeatureCollection,
} from "../types/geojson";
import type { Layer } from "leaflet";

interface GeoJSONLayerProps {
  data: HistoricalFeatureCollection;
}

function GeoJSONLayer({ data }: GeoJSONLayerProps) {
  // onEachFeature is a hook function by leaflet. it wil run once for every single feature in the GeoJSON data
  const onEachFeature = (feature: HistoricalFeature, layer: Layer) => {
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
      key={new Date().toString()}
      data={data}
      onEachFeature={onEachFeature}
    />
  );
}

export default GeoJSONLayer;
