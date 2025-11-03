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

// this interface is exported and can therefor be importet be others!
export interface LayerConfig {
  id: string;
  name: string;
  visible: boolean;
}

function App() {
  // ** useState Hooks **

  const [currentView, setCurrentView] = useState<View>("dashboard"); // dashboard is default
  //  for the data
  const [geoJsonData, setGeoJsonData] =
    useState<HistoricalFeatureCollection | null>(null); // initialized as 0

  const [layerConfig, setLayerConfig] = useState<LayerConfig[]>([
    { id: "territories-1", name: "Quarters", visible: true },
  ]);

  // for the timeline

  //when releasing the mouse update:
  const [committedTimeRange, setCommittedTimeRange] = useState<TimeRange>([
    1800, 1900,
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/dummy-data.geojson"); // data can not be in same folder as the app, vite-related problem
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // .json() fetches and parses in one step
        setGeoJsonData(data as HistoricalFeatureCollection);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // The empty dependency array [] means this effect runs only ONCE.

  return (
    // box will occupy the full viewport heigh; flexbox for layout.
    // Stack component is used to arrange items in a single direction (row or column)
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* CssBaseline is an MUI component that normalizes styles across browsers. */}
      <CssBaseline />

      <Header />
      {/* 'sx={{ flexGrow: 1 }}' makes this stack fill all available space. */}
      <Stack direction="row" sx={{ flexGrow: 1 }}>
        {/*sidebar */}
        <Box
          component="aside"
          sx={{ width: 240, borderRight: "1px solid", borderColor: "divider" }}
        >
          <Sidebar
            onNavigateHome={() => setCurrentView("dashboard")}
            layers={layerConfig}
            onLayerChange={handleLayerConfigChange}
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
