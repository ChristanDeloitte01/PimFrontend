
import { Box, Button, Divider } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

function ServiceFormActions({
  saving,
  isCreate,
  isReadOnly,
  onCancel,
}) {
  if (isReadOnly) {
    return null;
  }

  return (
    <>
      <Divider />

      <Box
        sx={{
          px: { xs: 2, md: 3 },
          py: 2,
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          bgcolor: "#FAFBFA",
        }}
      >
        <Button
          onClick={onCancel}
          disabled={saving}
          sx={{
            color: "#4F5952",
            textTransform: "none",
          }}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={saving}
          sx={{
            bgcolor: "#246B50",
            textTransform: "none",
            "&:hover": { bgcolor: "#1C563F" },
          }}
        >
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </Box>
    </>
  );
}

export default ServiceFormActions;
