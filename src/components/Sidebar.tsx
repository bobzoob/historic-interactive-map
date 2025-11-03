import { Box, Button, Typography } from "@mui/material";
import LayerControlPanel from "./LayerControlPanel";
import type { LayerConfig } from "../App";

interface SidebarProps {
  onNavigateHome: () => void;
  layers: LayerConfig[]; // array of different layers
  onLayerChange: (layerId: string, isVisible: boolean) => void;
}

function Sidebar({ onNavigateHome, layers, onLayerChange }: SidebarProps) {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">Menu</Typography>
      <Button variant="text" onClick={onNavigateHome}>
        Home
      </Button>
      <Box mt={4}>
        {/* we render layers here */}
        <LayerControlPanel layers={layers} onLayerChange={onLayerChange} />
      </Box>
    </Box>
  );
}

export default Sidebar;
