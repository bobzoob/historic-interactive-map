import { Box, Slider, Typography } from "@mui/material";
import type { TimeRange } from "../App";
import { useState, useEffect } from "react";

interface TimelineControlProps {
  range: TimeRange;
  onTimeChange: (newRange: TimeRange) => void;
}

function TimelineControl({ range, onTimeChange }: TimelineControlProps) {
  const minYear = 1800;
  const maxYear = 1960;

  // the slider-rendering-on-change problem
  // get sliders local state at present, passed down by TimeRange and sync it with the maybe change
  const [localRange, setLocalRange] = useState<TimeRange>(range);
  useEffect(() => {
    setLocalRange(range);
  }, [range]);

  //  debounce logic:
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      // after 200ms of no changes to localRange call the parents onTimeChange function
      onTimeChange(localRange);
    }, 200);
    // clean up function, new timer everytime
    return () => {
      clearTimeout(debounceTimer);
    };
  }, [localRange, onTimeChange]);

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 20, // 20px from the bottom
        left: "50%", // center horizontally
        transform: "translateX(-50%)", // centering
        width: "60%", // it will take up 60% of parents width
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        padding: 2,
        borderRadius: 2,
        boxShadow: 3,
        zIndex: 1000, // very hight up in hirarchy of layers
      }}
    >
      <Typography id="range-slider" gutterBottom>
        Zeitspanne: {range[0]} - {range[1]}
      </Typography>
      <Slider
        // slider value default stting
        value={localRange}
        min={minYear}
        max={maxYear}
        // we can only select whole years
        step={1}
        // tooltip for selected value
        valueLabelDisplay="auto"
        // aria labelled by attribute: all interactiv elements must have a accessible name, here the name can not be retrieved from its tags, like button etc.
        aria-labelledby="range-slider"
        onChangeCommitted={(_event, newValue) => {
          // handler receives the new value from slider
          // then we call the onTimeChange function, which is passed down from App.tsx
          setLocalRange(newValue as TimeRange);
        }}
      />
    </Box>
  );
}

export default TimelineControl;
