import {
  Box,
  Button,
  Typography,
} from "@mui/material";

import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import ServiceFields from "../ServiceFields";

function ServiceOverviewTab({
  service,
  serviceId,
  id,
  record,
  formFields,
  isReadOnly,
  isView,
  handleFieldChange,
  setRecord,
  navigate,
}) {
  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "300px minmax(0, 1fr)",
        },
        gap: 4,
        alignItems: "start",
      }}
    >
      {/* Product image / asset preview */}
      <Box
        sx={{
          minHeight: 300,
          border: "1px solid #E1E6E0",
          borderRadius: 3,
          bgcolor: "#F8FAF8",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: 3,
            bgcolor: "#E8EFE9",
            color: "#48715B",
            display: "grid",
            placeItems: "center",
            mb: 2,
          }}
        >
          <ImageOutlinedIcon sx={{ fontSize: 34 }} />
        </Box>

        <Typography fontWeight={700} sx={{ color: "#303831" }}>
          Product image
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1, maxWidth: 220 }}
        >
          View the product's primary image and linked assets.
        </Typography>

        {isView && serviceId === "products" && (
          <Button
            variant="outlined"
            onClick={() =>
              navigate(`/services/products/${id}/assets`)
            }
            sx={{
              mt: 2,
              textTransform: "none",
              borderColor: "#B7C9BC",
              color: "#246B50",
            }}
          >
            View related assets
          </Button>
        )}
      </Box>

      {/* Basic information */}
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            color: "#303831",
            mb: 2.5,
            textTransform: "uppercase",
            letterSpacing: 0.6,
            fontSize: 13,
          }}
        >
          Basic information
        </Typography>

        <ServiceFields
          fields={formFields}
          record={record}
          isReadOnly={isReadOnly}
          onFieldChange={handleFieldChange}
          setRecord={setRecord}
        />
      </Box>
    </Box>
  );
}

export default ServiceOverviewTab;