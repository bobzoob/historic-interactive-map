import { Box, Button, Typography } from "@mui/material";
import LayerControlPanel from "./LayerControlPanel";
import type { LayerConfig } from "../App";

type View = "dashboard" | "map";

interface SidebarProps {
  currentView: View;
  onNavigateHome: () => void;
  layers: LayerConfig[]; // array of different layers
  onLayerChange: (layerId: string, isVisible: boolean) => void;
  onLayerTooltipChange: (layerId: string, showAll: boolean) => void;
}

function Sidebar({
  currentView,
  onNavigateHome,
  layers,
  onLayerChange,
  onLayerTooltipChange,
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
          />
        </Box>
      )}
    </Box>
  );
}

export default Sidebar;
