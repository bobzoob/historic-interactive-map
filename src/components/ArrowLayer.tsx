import DecoratedPolyline from "./DecoratedPolyline";
import { Tooltip, Polyline } from "react-leaflet"; // We still need Polyline for the tooltip
import type { HistoricalFeatureCollection } from "../types/geojson";
import L from "leaflet";

interface ArrowLayerProps {
  data: HistoricalFeatureCollection;
}

function ArrowLayer({ data }: ArrowLayerProps) {
  return (
    <>
      {data.features.map((feature, index) => {
        if (feature.geometry.type === "LineString") {
          const positions = feature.geometry.coordinates.map(
            (coord) => [coord[1], coord[0]] as L.LatLngTuple
          );

          // We render TWO things for each feature:
          // 1. The invisible Polyline with the Tooltip
          // 2. The DecoratedPolyline which draws the visible line and arrowhead
          return (
            <div key={index}>
              <Polyline positions={positions} color="transparent">
                <Tooltip>
                  <strong>{feature.properties.name}</strong>
                  <p>{feature.properties.description}</p>
                </Tooltip>
              </Polyline>
              <DecoratedPolyline positions={positions} />
            </div>
          );
        }
        return null;
      })}
    </>
  );
}

export default ArrowLayer;
