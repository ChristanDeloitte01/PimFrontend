
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SaveIcon from "@mui/icons-material/Save";

function ServiceFormHeader({
  service,
  serviceId,
  id,
  record,
  pageTitle,
  isCreate,
  isEdit,
  isView,
  isReadOnly,
  saving,
  onSave,
  onBack,
  navigate,
}) {
  return (
    <Box sx={{ px: { xs: 2, md: 3 }, pt: 3 }}>
      <Breadcrumbs sx={{ mb: 2, fontSize: 13 }}>
        <Button
          size="small"
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{
            color: "#68716B",
            textTransform: "none",
            p: 0,
            minWidth: 0,
          }}
        >
          Back to {service.title}
        </Button>

        <Typography variant="body2" color="text.secondary">
          {isCreate
            ? "New record"
            : record.name || record.title || `Record ${id}`}
        </Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#202522",
              letterSpacing: "-0.6px",
            }}
          >
            {isCreate
              ? `Add ${service.title.replace(/s$/, "")}`
              : record.name || record.title || pageTitle}
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "#68716B", mt: 0.5 }}
          >
            {isEdit
              ? "Update product information and save your changes."
              : isCreate
                ? "Enter the information required to create this record."
                : service.description}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {!isCreate && record.status && (
            <Chip
              label={record.status}
              size="small"
              sx={{
                bgcolor: "#E5F2E9",
                color: "#246B50",
                fontWeight: 600,
              }}
            />
          )}

          {!isReadOnly && (
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={saving}
              sx={{
                bgcolor: "#246B50",
                px: 2.5,
                py: 1.1,
                borderRadius: 1.5,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { bgcolor: "#1C563F" },
              }}
            >
              {saving ? "Saving..." : "Save changes"}
            </Button>
          )}

          {isView && service.capabilities?.update && (
            <Button
              variant="outlined"
              startIcon={<EditOutlinedIcon />}
              onClick={() =>
                navigate(`/services/${serviceId}/${id}/edit`)
              }
              sx={{ textTransform: "none" }}
            >
              Edit
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ServiceFormHeader;
