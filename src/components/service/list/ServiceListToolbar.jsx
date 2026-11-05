
import {
  Box,
  Chip,
  InputAdornment,
  TextField,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

function ServiceListToolbar({
  service,
  searchText,
  onSearchChange,
  recordCount,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        flexWrap: "wrap",
        mb: 2,
      }}
    >
      <TextField
        size="small"
        placeholder={`Search ${service.title.toLowerCase()}...`}
        value={searchText}
        onChange={(event) => onSearchChange(event.target.value)}
        sx={{
          width: { xs: "100%", sm: 360 },
          "& .MuiOutlinedInput-root": {
            bgcolor: "#FFFFFF",
            borderRadius: 2,
          },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />

      <Chip
        label={`${recordCount} records`}
        variant="outlined"
        sx={{ bgcolor: "#FFFFFF" }}
      />
    </Box>
  );
}

export default ServiceListToolbar;
