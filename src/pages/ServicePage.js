import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Divider,
  Chip,
  InputAdornment,
  Breadcrumbs,
  Tabs,
  Tab,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../api/client";
import { getServices } from "../api/serviceApi";
import SearchIcon from "@mui/icons-material/Search";
import renderReadOnlyField from "../components/RenderReadOnlyField";
import toProductUpdatePayload from "../utils/productupdatePayload";


function resolveEndpoint(path, id) {
  if (!path) {
    throw new Error("The required API endpoint is not configured.");
  }

  if (id === undefined || id === null) {
    return path;
  }

  return path.replace("{id}", encodeURIComponent(String(id)));
}

function getErrorMessage(error, fallback) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
}

function getFieldsFor(fields, context) {
  return (fields || []).filter((field) => {
    if (field.visibleIn) {
      return field.visibleIn.includes(context);
    }

    // Backward-compatible default if visibleIn is omitted.
    return true;
  });
}

const getAttributeGroups = (attributes = {}) => [
  {
    key: "common",
    title: "Common attributes",
    values: attributes.common || {},
  },
  {
    key: "channel_locale_specific",
    title: "Channel and locale attributes",
    values: attributes.channel_locale_specific || {},
  },
  {
    key: "channel_specific",
    title: "Channel-specific attributes",
    values: attributes.channel_specific || {},
  },
];

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
};

function makeEmptyRecord(fields) {
  return (fields || []).reduce((record, field) => {
    record[field.name] =
      field.type === "boolean" ? false : "";
    return record;
  }, {});
}

function ServicePage({ mode }) {
  const navigate = useNavigate();
  const { serviceId, id } = useParams();

  const [service, setService] = useState(null);
  const [record, setRecord] = useState({});
  const [rows, setRows] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
  setActiveTab("overview");
}, [serviceId, id, mode]);

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      String(value ?? "")
        .toLowerCase()
        .includes(searchText.toLowerCase())
    )
  );

  const [notification, setNotification] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const isList = mode === "list";
  const isCreate = mode === "create";
  const isEdit = mode === "edit";
  const isView = mode === "view";
  const isReadOnly = isView;

  const listFields = useMemo(
    () => getFieldsFor(service?.fields, "table"),
    [service]
  );

  const formContext = isCreate
    ? "create"
    : isEdit
      ? "edit"
      : "detail";

  const formFields = useMemo(
    () => getFieldsFor(service?.fields, formContext),
    [service, formContext]
  );

  const showNotification = (severity, message) => {
    setNotification({ open: true, severity, message });
  };

  const loadPage = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const services = await getServices();
      const currentService = services.find(
        (item) => item.id === serviceId
      );

      if (!currentService) {
        throw new Error(`Service "${serviceId}" was not found.`);
      }

      if (currentService.renderer !== "entity") {
        throw new Error(
          `The "${currentService.renderer}" renderer is not implemented yet.`
        );
      }

      setService(currentService);

      if (isList) {
        const endpoint = resolveEndpoint(
          currentService.endpoints?.list
        );
        const response = await apiClient.get(endpoint);

        if (!Array.isArray(response.data)) {
          throw new Error(
            "The list endpoint must return a JSON array."
          );
        }

        setRows(response.data);
      } else if (isCreate) {
        setRecord(makeEmptyRecord(currentService.fields));
      } else {
        const endpoint = resolveEndpoint(
          currentService.endpoints?.detail,
          id
        );
        const response = await apiClient.get(endpoint);
        setRecord(response.data);
      }
    } catch (err) {
      console.error("Unable to load service page:", err);
      setError(
        getErrorMessage(err, "Unable to load this service.")
      );
    } finally {
      setLoading(false);
    }
  }, [serviceId, id, isList, isCreate]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  const handleFieldChange = (event) => {
    const { name, value, type, checked } = event.target;

    setRecord((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

const handleSave = async (event) => {
  event.preventDefault();
  setSaving(true);

  try {
    let response;

    const payload =
      serviceId === "products"
        ? toProductUpdatePayload(record)
        : record;

    if (isCreate) {
      const endpoint = resolveEndpoint(service.endpoints?.create);
      response = await apiClient.post(endpoint, payload);
    } else {
      const endpoint = resolveEndpoint(
        service.endpoints?.update,
        id
      );
      response = await apiClient.put(endpoint, payload);
    }

    const savedRecord = response.data;

    showNotification(
      "success",
      isCreate
        ? `${service.title} created successfully.`
        : `${service.title} saved successfully.`
    );

    if (isCreate && savedRecord?.id !== undefined) {
      navigate(
        `/services/${serviceId}/${encodeURIComponent(savedRecord.id)}`
      );
    } else if (isCreate) {
      navigate(`/services/${serviceId}`);
    } else {
      navigate(`/services/${serviceId}/${id}`);
    }
  } catch (err) {
    console.error("Unable to save record:", err);
    showNotification(
      "error",
      getErrorMessage(
        err,
        isCreate ? "Unable to create record." : "Unable to save record."
      )
    );
  } finally {
    setSaving(false);
  }
};

  const pageTitle = isList
    ? service?.title
    : isCreate
      ? `Add ${service?.title?.replace(/s$/, "") || "Record"}`
      : isEdit
        ? `Edit ${service?.title?.replace(/s$/, "") || "Record"}`
        : `${service?.title?.replace(/s$/, "") || "Record"} Details`;

  if (loading) {
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

  if (error) {
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
            <Button color="inherit" onClick={loadPage}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  if (!service) {
    return null;
  }

  const backToList = () => navigate(`/services/${serviceId}`);

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, md: 2 } }}>
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

    {isList && (
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
      onChange={(event) => setSearchText(event.target.value)}
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
      label={`${filteredRows.length} records`}
      variant="outlined"
      sx={{ bgcolor: "#FFFFFF" }}
    />
  </Box>
)}

      {isList && (
        <TableContainer
  component={Paper}
  sx={{
    borderRadius: 2.5,
    border: "1px solid #E5E8E3",
    boxShadow: "0 2px 8px rgba(20, 30, 20, 0.04)",
    overflowX: "auto",
  }}
>
          <Table
  sx={{
    minWidth: 650,
    "& .MuiTableCell-head": {
      bgcolor: "#202522",
      color: "#FFFFFF",
      fontWeight: 600,
      fontSize: 13,
      py: 1.75,
      whiteSpace: "nowrap",
    },
    "& .MuiTableCell-body": {
      color: "#303630",
      py: 1.75,
      fontSize: 14,
    },
    "& .MuiTableBody-root .MuiTableRow-root:hover": {
      bgcolor: "#F0F5F1",
    },
  }}
>
            <TableHead>
              <TableRow>
                {listFields.map((field) => (
                  <TableCell key={field.name}>
                    {field.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={Math.max(listFields.length, 1)}
                  >
                    No records found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows.map((row, index) => (
                  <TableRow
                    key={row.id ?? index}
                    hover
                    onClick={() => {
                      if (service.capabilities?.view) {
                        navigate(
                          `/services/${serviceId}/${row.sku}`
                        );
                      }
                    }}
                    sx={{
                      cursor: service.capabilities?.view
                        ? "pointer"
                        : "default",
                    }}
                  >
                    {listFields.map((field) => (
                      <TableCell key={field.name}>
                        {row[field.name] === null ||
                        row[field.name] === undefined
                          ? "—"
                          : String(row[field.name])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      
      {!isList && (
        <Paper
          component="form"
          onSubmit={handleSave}
          elevation={0}
          sx={{
            bgcolor: "#FFFFFF",
            border: "1px solid #E3E7E2",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          {/* Breadcrumb and page actions */}
          <Box sx={{ px: { xs: 2, md: 3 }, pt: 3 }}>
            <Breadcrumbs sx={{ mb: 2, fontSize: 13 }}>
              <Button
                size="small"
                startIcon={<ArrowBackIcon />}
                onClick={backToList}
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

            {/* Product workspace tabs */}
            <Tabs
              value={activeTab}
              onChange={(_, value) => setActiveTab(value)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minHeight: 48,
                "& .MuiTab-root": {
                  minHeight: 48,
                  textTransform: "none",
                  fontWeight: 500,
                  color: "#59635C",
                },
                "& .Mui-selected": {
                  color: "#246B50 !important",
                  fontWeight: 700,
                },
                "& .MuiTabs-indicator": {
                  bgcolor: "#246B50",
                  height: 3,
                },
              }}
            >
              <Tab value="overview" label="Overview" />
              <Tab value="attributes" label="Attributes" />
              <Tab value="media" label="Media" />
              <Tab value="categories" label="Categories" />
              <Tab value="channels" label="Channels" />
              <Tab value="history" label="History" />
            </Tabs>
          </Box>

          <Divider />

          {/* Overview tab */}
          {activeTab === "overview" && (
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
              {/* Product image / asset preview placeholder */}
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

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, minmax(0, 1fr))",
                    },
                    columnGap: 2,
                    rowGap: 1.5,
                  }}
                >
                  {formFields.map((field) => {
                    const disabled =
                      isReadOnly || field.readOnly === true;

                    if (isReadOnly) {
                      return renderReadOnlyField(
                        field,
                        record[field.name]
                      );
                    }

                    if (field.type === "select") {
                      return (
                        <TextField
                          key={field.name}
                          select
                          name={field.name}
                          label={field.label}
                          value={record[field.name] ?? ""}
                          onChange={handleFieldChange}
                          required={field.required}
                          disabled={disabled}
                          fullWidth
                          size="small"
                        >
                          {(field.options || []).map((option) => {
                            const value =
                              typeof option === "string"
                                ? option
                                : option.value;
                            const label =
                              typeof option === "string"
                                ? option
                                : option.label;

                            return (
                              <MenuItem key={value} value={value}>
                                {label}
                              </MenuItem>
                            );
                          })}
                        </TextField>
                      );
                    }

                    if (field.type === "boolean") {
                      return (
                        <TextField
                          key={field.name}
                          select
                          name={field.name}
                          label={field.label}
                          value={String(Boolean(record[field.name]))}
                          onChange={(event) =>
                            setRecord((previous) => ({
                              ...previous,
                              [field.name]:
                                event.target.value === "true",
                            }))
                          }
                          disabled={disabled}
                          fullWidth
                          size="small"
                        >
                          <MenuItem value="true">Yes</MenuItem>
                          <MenuItem value="false">No</MenuItem>
                        </TextField>
                      );
                    }

                    return (
                      <TextField
                        key={field.name}
                        name={field.name}
                        label={field.label}
                        type={
                          ["number", "date"].includes(field.type)
                            ? field.type
                            : "text"
                        }
                        value={record[field.name] ?? ""}
                        onChange={handleFieldChange}
                        required={field.required}
                        disabled={disabled}
                        multiline={field.type === "textarea"}
                        minRows={field.type === "textarea" ? 3 : undefined}
                        fullWidth
                        size="small"
                        sx={
                          field.type === "textarea"
                            ? { gridColumn: { sm: "1 / -1" } }
                            : undefined
                        }
                        InputLabelProps={
                          field.type === "date"
                            ? { shrink: true }
                            : undefined
                        }
                      />
                    );
                  })}
                </Box>
              </Box>
            </Box>
          )}

          
          {activeTab === "attributes" && (
            <Box sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                Product attributes
              </Typography>

              <Typography color="text.secondary" variant="body2" sx={{ mb: 3 }}>
                Shared, localized, and channel-specific product information.
              </Typography>

              {getAttributeGroups(record.attributes).map((group) => (
                <Paper
                  key={group.key}
                  variant="outlined"
                  sx={{ mb: 2, p: { xs: 2, md: 3 }, borderRadius: 2 }}
                >
                  <Typography fontWeight={700} sx={{ mb: 2 }}>
                    {group.title}
                  </Typography>

                  {Object.keys(group.values).length === 0 ? (
                    <Typography color="text.secondary" variant="body2">
                      No attributes available.
                    </Typography>
                  ) : (
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "repeat(2, minmax(0, 1fr))",
                        },
                        gap: 2,
                      }}
                    >
                      {Object.entries(group.values).map(([key, value]) => (
                        <Box
                          key={key}
                          sx={{
                            minWidth: 0,
                            borderBottom: "1px solid #E5E8E3",
                            pb: 1.5,
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            {key.replace(/_/g, " ")}
                          </Typography>

                          <Typography
                            variant="body1"
                            sx={{
                              color: "#202522",
                              fontWeight: 500,
                              whiteSpace: "pre-wrap",
                              overflowWrap: "anywhere",
                            }}
                          >
                            {formatValue(value)}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Paper>
              ))}
            </Box>
          )}
          {/* Other tabs: placeholders until their data models are implemented */}
          {activeTab !== "overview" && activeTab !== "attributes" && (
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
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {({
                  attributes: "Product attributes",
                  media: "Product media",
                  categories: "Product categories",
                  channels: "Sales channels",
                  history: "Change history",
                })[activeTab]}
              </Typography>

              <Typography
                color="text.secondary"
                variant="body2"
                sx={{ maxWidth: 420 }}
              >
                This section is a placeholder. Its data and actions can be
                connected when the corresponding backend functionality is
                available.
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
          )}

          {/* Bottom actions for longer forms */}
          {!isReadOnly && (
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
                  onClick={() =>
                    isCreate
                      ? backToList()
                      : navigate(`/services/${serviceId}/${id}`)
                  }
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
          )}
        </Paper>
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() =>
          setNotification((previous) => ({
            ...previous,
            open: false,
          }))
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={notification.severity}
          variant="filled"
          onClose={() =>
            setNotification((previous) => ({
              ...previous,
              open: false,
            }))
          }
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ServicePage;