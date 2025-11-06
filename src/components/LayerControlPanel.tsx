import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
} from "@mui/material";
import type { LayerConfig } from "../App";

interface LayerControlPanelProps {
  layers: LayerConfig[];
  onLayerChange: (layerId: string, isVisible: boolean) => void;
  onLayerTooltipChange: (layerId: string, showAll: boolean) => void;
}

function LayerControlPanel({
  layers,
  onLayerChange,
  onLayerTooltipChange,
}: LayerControlPanelProps) {
  return (
    <Box>
      <Typography variant="h6">Layers</Typography>
      {layers.map((layer) => (
        // another Box here: better visual grouping and controls
        <Box
          key={layer.id}
          sx={{
            border: "1px solid #ddd",
            borderRadius: "4px",
            padding: 1,
            marginBottom: 1,
          }}
        >
          {/* for each layer in map: control if layer is checked, then set visible true, display the layers text next to the checkbox */}
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={layer.visible}
                  onChange={(event) =>
                    onLayerChange(layer.id, event.target.checked)
                  }
                />
              }
              label={layer.name}
            />
            {/* check if showAllTooltip is checked*/}
            <FormControlLabel
              sx={{ marginLeft: 1 }} // little idention
              control={
                <Checkbox
                  checked={layer.showAllTooltips}
                  onChange={(event) =>
                    onLayerTooltipChange(layer.id, event.target.checked)
                  }
                />
              }
              label="show all tooltips"
            />
          </FormGroup>
        </Box>
      ))}
    </Box>
  );
}

export default LayerControlPanel;
