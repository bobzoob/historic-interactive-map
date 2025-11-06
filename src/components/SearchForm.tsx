import { useState } from "react";
import { Box, Button, Collapse, Stack, TextField } from "@mui/material";
import type { SearchState } from "../App";

interface SearchFormProps {
  searchState: SearchState;
  onSearchChange: (newSearchState: SearchState) => void;
}

function SearchForm({ searchState, onSearchChange }: SearchFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  // local state: avoid re-rendering the whole app on every key pressed
  const [formState, setFormState] = useState<SearchState>(searchState);

  const handleApply = () => {
    onSearchChange(formState);
  };

  const handleClear = () => {
    const clearedState = { plainText: "", sender: "", recipient: "" };
    setFormState(clearedState);
    onSearchChange(clearedState);
  };

  return (
    <Box sx={{ marginTop: 1 }}>
      <Button size="small" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Hide Search" : "Show Search"}
      </Button>
      <Collapse in={isOpen}>
        <Stack spacing={2} sx={{ padding: 2, borderTop: "1px solid #eee" }}>
          <TextField
            label="Search All Text"
            variant="outlined"
            size="small"
            value={formState.plainText}
            onChange={(e) =>
              setFormState({ ...formState, plainText: e.target.value })
            }
          />
          <TextField
            label="Sender"
            variant="outlined"
            size="small"
            value={formState.sender}
            onChange={(e) =>
              setFormState({ ...formState, sender: e.target.value })
            }
          />
          <TextField
            label="Recipient"
            variant="outlined"
            size="small"
            value={formState.recipient}
            onChange={(e) =>
              setFormState({ ...formState, recipient: e.target.value })
            }
          />
          <Stack direction="row" spacing={1}>
            <Button variant="contained" size="small" onClick={handleApply}>
              Apply
            </Button>
            <Button variant="outlined" size="small" onClick={handleClear}>
              Clear
            </Button>
          </Stack>
        </Stack>
      </Collapse>
    </Box>
  );
}

export default SearchForm;
