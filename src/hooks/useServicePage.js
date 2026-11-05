
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import apiClient from "../api/client";
import { getServices } from "../api/serviceApi";

import {
  resolveEndpoint,
  getErrorMessage,
} from "../utils/serviceHelpers";

import {
  getFieldsFor,
  makeEmptyRecord,
} from "../utils/serviceFieldHelpers";

import toProductUpdatePayload from "../utils/productupdatePayload";

function useServicePage(mode) {
  const navigate = useNavigate();
  const { serviceId, id } = useParams();

  // ------------------------------------
  // Page state
  // ------------------------------------

  const [service, setService] = useState(null);
  const [record, setRecord] = useState({});
  const [rows, setRows] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const [notification, setNotification] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  // ------------------------------------
  // Page mode
  // ------------------------------------

  const isList = mode === "list";
  const isCreate = mode === "create";
  const isEdit = mode === "edit";
  const isView = mode === "view";
  const isReadOnly = isView;

  const formContext = isCreate
    ? "create"
    : isEdit
      ? "edit"
      : "detail";

  // ------------------------------------
  // Derived data
  // ------------------------------------

  const filteredRows = useMemo(() => {
    return rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(searchText.toLowerCase())
      )
    );
  }, [rows, searchText]);

  const listFields = useMemo(
    () => getFieldsFor(service?.fields, "table"),
    [service]
  );

  const formFields = useMemo(
    () => getFieldsFor(service?.fields, formContext),
    [service, formContext]
  );

  const pageTitle = isList
    ? service?.title
    : isCreate
      ? `Add ${service?.title?.replace(/s$/, "") || "Record"}`
      : isEdit
        ? `Edit ${service?.title?.replace(/s$/, "") || "Record"}`
        : `${service?.title?.replace(/s$/, "") || "Record"} Details`;

  // ------------------------------------
  // Notifications
  // ------------------------------------

  const showNotification = useCallback((severity, message) => {
    setNotification({
      open: true,
      severity,
      message,
    });
  }, []);

  const closeNotification = useCallback(() => {
    setNotification((previous) => ({
      ...previous,
      open: false,
    }));
  }, []);

  // ------------------------------------
  // Load service data
  // ------------------------------------

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

  // Reset workspace tab when navigating between records or modes.
  useEffect(() => {
    setActiveTab("overview");
  }, [serviceId, id, mode]);

  // ------------------------------------
  // Record field changes
  // ------------------------------------

  const handleFieldChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;

    setRecord((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  // ------------------------------------
  // Save record
  // ------------------------------------

  const handleSave = useCallback(async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload =
        serviceId === "products"
          ? toProductUpdatePayload(record)
          : record;

      let response;

      if (isCreate) {
        const endpoint = resolveEndpoint(
          service.endpoints?.create
        );

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
          isCreate
            ? "Unable to create record."
            : "Unable to save record."
        )
      );
    } finally {
      setSaving(false);
    }
  }, [
    serviceId,
    id,
    isCreate,
    service,
    record,
    navigate,
    showNotification,
  ]);

  // ------------------------------------
  // Navigation helpers
  // ------------------------------------

  const backToList = useCallback(() => {
    navigate(`/services/${serviceId}`);
  }, [navigate, serviceId]);

  // ------------------------------------
  // Expose page data and actions
  // ------------------------------------

  return {
    // Route information
    serviceId,
    id,
    navigate,

    // Service data
    service,
    record,
    rows,
    filteredRows,

    // Page state
    loading,
    saving,
    error,
    searchText,
    activeTab,
    notification,

    // Page mode
    isList,
    isCreate,
    isEdit,
    isView,
    isReadOnly,

    // Derived values
    listFields,
    formFields,
    formContext,
    pageTitle,

    // State setters
    setRecord,
    setSearchText,
    setActiveTab,

    // Actions
    loadPage,
    handleFieldChange,
    handleSave,
    showNotification,
    closeNotification,
    backToList,
  };
}

export default useServicePage;
