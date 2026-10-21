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
  Divider
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate, useParams } from "react-router-dom";

import apiClient from "../api/client";
import { getServices } from "../api/serviceApi";

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

      if (isCreate) {
        const endpoint = resolveEndpoint(
          service.endpoints?.create
        );
        response = await apiClient.post(endpoint, record);
      } else {
        const endpoint = resolveEndpoint(
          service.endpoints?.update,
          id
        );
        response = await apiClient.put(endpoint, record);
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
        setRecord(savedRecord || record);
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
    <Box sx={{ maxWidth: 1400, mx: "auto", p: { xs: 2, md: 4 } }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={isList ? () => navigate("/") : backToList}
        sx={{ mb: 2 }}
      >
        {isList ? "Back to Home" : `Back to ${service.title}`}
      </Button>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4">{pageTitle}</Typography>
          <Typography color="text.secondary">
            {service.description}
          </Typography>
        </Box>

        {isList && service.capabilities?.create && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() =>
              navigate(`/services/${serviceId}/new`)
            }
          >
            Add {service.title.replace(/s$/, "")}
          </Button>
        )}

        {isView && service.capabilities?.update && (
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

      {isList && (
        <TableContainer component={Paper}>
          <Table>
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
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={Math.max(listFields.length, 1)}
                  >
                    No records found.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, index) => (
                  <TableRow
                    key={row.id ?? index}
                    hover
                    onClick={() => {
                      if (service.capabilities?.view) {
                        navigate(
                          `/services/${serviceId}/${row.id}`
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
          sx={{ p: { xs: 2, md: 3 } }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
              },
              gap: 3,
            }}
          >
            {formFields.map((field) => {
              const disabled =
                isReadOnly || field.readOnly === true;
              
                if (isReadOnly) {
                  return renderReadOnlyField(field,record[field.name]);
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
                        [field.name]: event.target.value === "true",
                      }))
                    }
                    disabled={disabled}
                    fullWidth
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
                  InputLabelProps={
                    field.type === "date"
                      ? { shrink: true }
                      : undefined
                  }
                />
              );
            })}
          </Box>

          {!isReadOnly && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 4,
              }}
            >
              <Button
                onClick={isCreate ? backToList : () => navigate(
                  `/services/${serviceId}/${id}`
                )}
                disabled={saving}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </Box>
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

const renderReadOnlyField = (field, value) => {
  const displayValue =
    value === null || value === undefined || value === ""
      ? "—"
      : field.type === "boolean"
        ? value
          ? "Yes"
          : "No"
        : String(value);

  return (
    <Box key={field.name} sx={{ py: 1.5 }}>
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          mb: 0.5,
          fontWeight: 500,
        }}
      >
        {field.label}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: "text.primary",
          fontWeight: 500,
          overflowWrap: "anywhere",
          whiteSpace: field.type === "textarea" ? "pre-wrap" : "normal",
        }}
      >
        {displayValue}
      </Typography>

      <Divider sx={{ mt: 1.5 }} />
    </Box>
  );
};

export default ServicePage;