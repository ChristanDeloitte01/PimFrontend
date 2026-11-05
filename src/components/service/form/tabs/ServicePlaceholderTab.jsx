import {
  Box,
  Button,
  Typography,
} from "@mui/material";

const TAB_TITLES = {
  media: "Product media",
  categories: "Product categories",
  channels: "Sales channels",
  history: "Change history",
};

function ServicePlaceholderTab({
  activeTab,
  serviceId,
  id,
  isView,
  navigate,
}) {
  return (
    <Box
      sx={{
        p: { xs: 3, md: 5 },
        minHeight: 260,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, mb: 1 }}
      >
        {TAB_TITLES[activeTab]}
      </Typography>

      <Typography
        color="text.secondary"
        variant="body2"
        sx={{ maxWidth: 420 }}
      >
        This section is a placeholder. Its data and actions
        can be connected when the corresponding backend
        functionality is available.
      </Typography>

      {activeTab === "media" &&
        serviceId === "products" &&
        isView && (
          <Button
            variant="contained"
            onClick={() =>
              navigate(`/services/products/${id}/assets`)
            }
            sx={{
              mt: 2,
              bgcolor: "#246B50",
              textTransform: "none",
            }}
          >
            Manage related assets
          </Button>
        )}
    </Box>
  );
}

export default ServicePlaceholderTab;