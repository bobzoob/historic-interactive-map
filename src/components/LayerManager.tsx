import type { HistoricalFeatureCollection } from "../types/geojson";
import type { LayerConfig, TimeRange } from "../App";
import GeoJSONLayer from "./GeoJSONLayer";
import PointLayer from "./PointLayer";
import ArrowLayer from "./ArrowLayer";

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

        //fully dynamic key for ALL layer types: guarantees a re-render when the time or tooltip settings change
        const dynamicKey = `${layer.id}-${timeRange.join("-")}-${
          layer.showAllTooltips
        }`;

        switch (layer.type) {
          case "polygon":
            return (
              <GeoJSONLayer
                key={dynamicKey}
                data={data[layer.id]}
                filter={featureFilter}
                showAllTooltips={layer.showAllTooltips}
              />
            );

          case "point":
            // pre-filter data for this component
            const filteredPointData = {
              ...data[layer.id],
              features: data[layer.id].features.filter(featureFilter),
            };
            return (
              <PointLayer
                key={dynamicKey}
                data={filteredPointData}
                showAllTooltips={layer.showAllTooltips}
              />
            );

          case "line":
            const filteredLineData = {
              ...data[layer.id],
              features: data[layer.id].features.filter(featureFilter),
            };
            return (
              <ArrowLayer
                key={dynamicKey}
                data={filteredLineData}
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
