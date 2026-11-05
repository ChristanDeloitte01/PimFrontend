
import { Box, CircularProgress, Typography } from "@mui/material";

function ServiceLoading() {
  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <CircularProgress size={24} />
        <Typography color="text.secondary">
          Loading...
        </Typography>
      </Box>
    </Box>
  );
}

export default ServiceLoading;
