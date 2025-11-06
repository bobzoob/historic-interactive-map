import { Box, Button, Typography } from "@mui/material";
import LayerControlPanel from "./LayerControlPanel";
import type { LayerConfig, SearchState } from "../App";

type View = "dashboard" | "map";

interface SidebarProps {
  currentView: View;
  onNavigateHome: () => void;
  layers: LayerConfig[]; // array of different layers
  onLayerChange: (layerId: string, isVisible: boolean) => void;
  onLayerTooltipChange: (layerId: string, showAll: boolean) => void;
  onLayerSearchChange: (layerId: string, newSearchState: SearchState) => void;
}

function Sidebar({
  currentView,
  onNavigateHome,
  layers,
  onLayerChange,
  onLayerTooltipChange,
  onLayerSearchChange,
}: SidebarProps) {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">Menu</Typography>
      <Button variant="text" onClick={onNavigateHome}>
        Home
      </Button>
      {currentView === "map" && (
        <Box mt={4}>
          {/* we render layers here */}
          <LayerControlPanel
            layers={layers}
            onLayerChange={onLayerChange}
            onLayerTooltipChange={onLayerTooltipChange}
            onLayerSearchChange={onLayerSearchChange}
          />
        </Box>
      )}
    </Box>
  );
}

export default Sidebar;
