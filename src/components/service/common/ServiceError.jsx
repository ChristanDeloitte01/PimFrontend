
import { Alert, Box, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function ServiceError({ error, onRetry, navigate }) {
  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/")}
        sx={{ mb: 2 }}
      >
        Back to Home
      </Button>

      <Alert
        severity="error"
        action={
          <Button color="inherit" onClick={onRetry}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    </Box>
  );
}

export default ServiceError;
