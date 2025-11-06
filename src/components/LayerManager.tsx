import type { HistoricalFeatureCollection } from "../types/geojson";
import type { LayerConfig, TimeRange } from "../App";
import GeoJSONLayer from "./GeoJSONLayer";
import PointLayer from "./PointLayer";
import ArrowLayer from "./ArrowLayer";
import { applyFilters } from "../utils/filterUtils";

interface LayerManagerProps {
  layers: LayerConfig[];
  data: Record<string, HistoricalFeatureCollection> | null;
  timeRange: TimeRange;
  featureFilter: (feature: any) => boolean;
}

function LayerManager({
  layers,
  data,
  timeRange,
  featureFilter,
}: LayerManagerProps) {
  if (!data) return null;

  return (
    <>
      {layers.map((layer) => {
        if (!layer.visible) {
          return null;
        }

        const layerData = data[layer.id];
        if (!layerData) return null;

        //serach filter
        const filteredFeatures = layerData.features.filter((feature) =>
          applyFilters(feature, timeRange, layer.search)
        );

        const filteredData = {
          ...layerData,
          features: filteredFeatures,
        };

        //fully dynamic key for ALL layer types: guarantees a re-render when the time or tooltip settings change
        const dynamicKey = `${layer.id}-${timeRange.join("-")}-${
          layer.showAllTooltips
        }`;

        //** add new layer type here: **
        switch (layer.type) {
          case "polygon":
            return (
              <GeoJSONLayer
                key={dynamicKey}
                data={filteredData}
                showAllTooltips={layer.showAllTooltips}
              />
            );

          case "point":
            return (
              <PointLayer
                key={dynamicKey}
                data={filteredData}
                showAllTooltips={layer.showAllTooltips}
              />
            );

          case "line":
            return (
              <ArrowLayer
                key={dynamicKey}
                data={filteredData}
                showAllTooltips={layer.showAllTooltips}
              />
            );

          default:
            return null;
        }
      })}
    </>
  );
}

export default LayerManager;
