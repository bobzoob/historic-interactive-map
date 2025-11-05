import { useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet-polylinedecorator";
import type { Polyline as PolylineType } from "leaflet";

interface DecoratedPolylineProps {
  positions: L.LatLngTuple[];
}

function DecoratedPolyline({ positions }: DecoratedPolylineProps) {
  const map = useMap();
  // Use a ref to hold the polyline instance
  const polylineRef = useRef<PolylineType>(null);

  useEffect(() => {
    // This effect runs when the component mounts and adds the decorator
    if (!map || !polylineRef.current) {
      return;
    }

    const decorator = L.polylineDecorator(polylineRef.current, {
      // Use the ref here
      patterns: [
        {
          offset: "100%",
          repeat: 0,
          symbol: L.Symbol.arrowHead({
            pixelSize: 15,
            polygon: false,
            pathOptions: {
              stroke: true,
              color: "#3388ff",
              fillOpacity: 1,
              weight: 2,
            },
          }),
        },
      ],
    }).addTo(map);

    // Cleanup function to remove the decorator when the component unmounts
    return () => {
      map.removeLayer(decorator);
    };
  }, [map]); // Only depends on the map instance

  // We need to manually create the Polyline and add it to the map
  // so we can get a reference to it.
  useEffect(() => {
    if (map) {
      const polyline = L.polyline(positions).addTo(map);
      // @ts-ignore
      polylineRef.current = polyline;

      // Cleanup
      return () => {
        map.removeLayer(polyline);
      };
    }
  }, [map, positions]);

  // This component doesn't render any JSX itself, it just adds layers to the map.
  return null;
}

export default DecoratedPolyline;
