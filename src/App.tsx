import { Box, CssBaseline, Stack } from "@mui/material";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MapContainer from "./components/MapContainer";
import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import type { HistoricalFeatureCollection } from "./types/geojson";

// types
export type TimeRange = [number, number]; // export= makes is accessible, somewhat like protected in java
// views, the application can be in
type View = "dashboard" | "map";

export interface SearchState {
  plainText: string;
  sender: string;
  recipient: string;
}

export interface LayerConfig {
  id: string;
  name: string;
  visible: boolean;
  type: "polygon" | "point" | "line"; // ** add new data types here **
  source: string; // the path of the data, aka: /my-data.geojson
  showAllTooltips: boolean;
  search?: SearchState;
}

function App() {
  // ** useState Hooks **

  const [currentView, setCurrentView] = useState<View>("dashboard"); // dashboard is default
  //  for the data
  // i had a very troubling error here, because i added a linebreak after the = while this is not alloud in js. took me a while to get there
  const [geoJsonData, setGeoJsonData] = useState<Record<
    string,
    HistoricalFeatureCollection
  > | null>(null);

  const [layerConfig, setLayerConfig] = useState<LayerConfig[]>([
    // ** add path here **
    {
      id: "territories-1",
      name: "some historical territories",
      visible: true,
      type: "polygon",
      source: "/territories-data.geojson",
      showAllTooltips: false,
    },
    {
      id: "event-1",
      name: "important Event",
      visible: true,
      type: "point",
      source: "/events-data.geojson",
      showAllTooltips: false,
    },

    {
      id: "letters-1",
      name: "Kelsen letters",
      visible: true,
      type: "line",
      source: "/letters-data.geojson",
      showAllTooltips: false,

      search: {
        plainText: "",
        sender: "",
        recipient: "",
      },
    },
  ]);

  //for the search
  const handleLayerSearchChange = (
    layerId: string,
    newSearchState: SearchState
  ) => {
    setLayerConfig((prevConfig) =>
      prevConfig.map((layer) => {
        if (layer.id === layerId) {
          return { ...layer, search: newSearchState };
        }
        return layer;
      })
    );
  };

  // for the timeline

  //when releasing the mouse update:
  const [committedTimeRange, setCommittedTimeRange] = useState<TimeRange>([
    1800, 1930,
  ]);

  //update with every mouse movement
  const [liveTimeRange, setLiveTimeRange] = useState<TimeRange>([1800, 1960]);

  // update both when drag if finished
  const handleTimeChangeCommitted = (newRange: TimeRange) => {
    setCommittedTimeRange(newRange);
    setLiveTimeRange(newRange);
  };

  // update oly live ui, during drag
  const handleTimeChangeLive = (newRange: TimeRange) => {
    setLiveTimeRange(newRange);
  };

  // handel status of layers
  // this is a 3 part arrow function:
  // 1: we tell setLayerConfig to set our changes
  // 2: we map a new array out of the old one -> very important to React, it must kep track of changes, therefor we never change something directly
  // 3: if it is the layer, we are looking for
  // 4: we set it visible
  const handleLayerConfigChange = (layerId: string, isVisible: boolean) => {
    setLayerConfig((prevConfig) =>
      prevConfig.map((layer) => {
        if (layer.id === layerId) {
          return { ...layer, visible: isVisible };
        }
        return layer;
      })
    );
  };

  // track status of showAllTooltip
  const handleLayerTooltipChange = (layerId: string, showAll: boolean) => {
    setLayerConfig((prevConfig) =>
      prevConfig.map((layer) => {
        if (layer.id === layerId) {
          return { ...layer, showAllTooltips: showAll };
        }
        return layer;
      })
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // we create an array of fetch promises based on the layer config
        const promises = layerConfig.map((layer) =>
          fetch(layer.source).then((res) => res.json())
        );
        const responses = await Promise.all(promises);

        // then build the data map dynamically
        const dataMap: Record<string, HistoricalFeatureCollection> = {};
        layerConfig.forEach((layer, index) => {
          dataMap[layer.id] = responses[index] as HistoricalFeatureCollection;
        });

        setGeoJsonData(dataMap);
      } catch (error) {
        console.error("Error fetching GeoJSON data:", error);
      }
    };
    fetchData();
  }, []); // empty dependency array [] means this effect runs only ONCE and needs updating, when layerConfig changes

  return (
    // box will occupy the full viewport heigh; flexbox for layout.
    // stack component is used to arrange items in a single direction (row or column)
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* CssBaseline: normalizes styles across browsers */}
      <CssBaseline />

      <Header />
      {/* sx={{ flexGrow: 1 }} makes this stack fill all available space. */}
      <Stack direction="row" sx={{ flexGrow: 1 }}>
        {/*sidebar */}
        <Box
          component="aside"
          sx={{ width: 240, borderRight: "1px solid", borderColor: "divider" }}
        >
          <Sidebar
            currentView={currentView}
            onNavigateHome={() => setCurrentView("dashboard")}
            layers={layerConfig}
            onLayerChange={handleLayerConfigChange}
            onLayerTooltipChange={handleLayerTooltipChange}
            onLayerSearchChange={handleLayerSearchChange}
          />
        </Box>

        {/* main content */}
        <Box component="main" sx={{ flexGrow: 1, overflow: "auto" }}>
          {currentView === "dashboard" ? (
            // if currentView is dashboard, we render dashbort but we'll set onSelectMap prop that changes the state to "map" once it is clicked, it wll than show map
            <Dashboard
              isDataLoaded={geoJsonData !== null}
              onSelectMap={() => setCurrentView("map")}
            />
          ) : (
            // otherwise we show the MapContainer component
            <MapContainer
              data={geoJsonData}
              layers={layerConfig}
              timeRange={committedTimeRange}
              liveTimeRange={liveTimeRange} // live range
              // handlers
              onTimeChangeCommitted={handleTimeChangeCommitted}
              onTimeChangeLive={handleTimeChangeLive}
            />
          )}
        </Box>
      </Stack>
    </Box>
  );
}

export default App;
