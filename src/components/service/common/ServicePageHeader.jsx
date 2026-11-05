
import {
  Box,
  Breadcrumbs,
  Button,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

function ServicePageHeader({
  service,
  serviceId,
  id,
  isList,
  isView,
  pageTitle,
  navigate,
}) {
  return (
    <Box sx={{ mb: 3 }}>
      <Breadcrumbs sx={{ mb: 2, fontSize: 13 }}>
        <Typography color="text.secondary" variant="body2">
          Workspace
        </Typography>

        <Typography color="text.primary" variant="body2">
          {service.title}
        </Typography>

        {!isList && (
          <Typography color="text.primary" variant="body2">
            {pageTitle}
          </Typography>
        )}
      </Breadcrumbs>

      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.5px",
              color: "#202522",
              mb: 0.5,
            }}
          >
            {pageTitle}
          </Typography>

          <Typography color="text.secondary" variant="body2">
            {service.description}
          </Typography>
        </Box>

        {isList && service.capabilities?.create && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate(`/services/${serviceId}/new`)}
          >
            Add {service.title.replace(/s$/, "")}
          </Button>
        )}

        {isView && (
          <Box sx={{ display: "flex", gap: 1 }}>
            {serviceId === "products" && (
              <Button
                variant="outlined"
                onClick={() =>
                  navigate(`/services/${serviceId}/${id}/assets`)
                }
              >
                Related Assets
              </Button>
            )}

            {service.capabilities?.update && (
              <Button
                variant="contained"
                startIcon={<EditOutlinedIcon />}
                onClick={() =>
                  navigate(`/services/${serviceId}/${id}/edit`)
                }
              >
                Edit
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default ServicePageHeader;
