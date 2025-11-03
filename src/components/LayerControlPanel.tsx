import {
  Box,
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
} from "@mui/material";
import type { LayerConfig } from "../App";

interface LayerControlPanelProps {
  layers: LayerConfig[];
  onLayerChange: (layerId: string, isVisible: boolean) => void;
}

function LayerControlPanel({ layers, onLayerChange }: LayerControlPanelProps) {
  return (
    <Box>
      <Typography variant="h6">Layers</Typography>
      <FormGroup>
        {/* for each layer in map: control if layer is checked, then set visible true, display the layers text next to the checkbox */}
        {layers.map((layer) => (
          <FormControlLabel
            key={layer.id}
            control={
              <Switch
                checked={layer.visible}
                onChange={(event) => {
                  onLayerChange(layer.id, event.target.checked);
                }}
              />
            }
            label={layer.name}
          />
        ))}
      </FormGroup>
    </Box>
  );
}

export default LayerControlPanel;
