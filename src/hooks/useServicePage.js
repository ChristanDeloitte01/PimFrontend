
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { extractListItems } from "../utils/serviceResponseHelpers";
import {
  getServices,
  executeServiceOperation,
} from "../api/serviceApi";

import {
  getErrorMessage,
} from "../utils/serviceHelpers";

import {
  getFieldsFor,
  makeEmptyRecord,
} from "../utils/serviceFieldHelpers";

import toProductUpdatePayload from "../utils/productupdatePayload";
import normalizeProductRecord from "../utils/productRecordMapper";
import { validateProductAttributes } from "../utils/attributeValidation";

function useServicePage(mode) {
  const navigate = useNavigate();
  const { serviceId, id } = useParams();

  // ------------------------------------
  // Page state
  // ------------------------------------

  const [service, setService] = useState(null);
  const [record, setRecord] = useState({});
  const [attributeDefinitions, setAttributeDefinitions] = useState([]);
  const [rows, setRows] = useState([]);
  const [productSchema, setProductSchema] = useState(null);

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
      throw new Error(
        `Service "${serviceId}" was not found.`
      );
    }

    if (currentService.renderer !== "entity") {
      throw new Error(
        `The "${currentService.renderer}" renderer is not implemented yet.`
      );
    }

    setService(currentService);

    /*
     * Product attributes are owned by UnoPim.
     *
     * SQLite only provides service/UI configuration.
     */
    if (serviceId === "products") {
      try {
        const attributeResponse =
          await executeServiceOperation(
            "attributes",
            "list",
            {
              query: {
                page: 1,
                limit: 50,
                includeOptions: true,
              },
            }
          );

        const definitions =
          Array.isArray(attributeResponse)
            ? attributeResponse
            : attributeResponse?.items ||
              attributeResponse?.data ||
              [];

        setAttributeDefinitions(
          definitions
        );
      } catch (attributeError) {
        console.error(
          "Unable to load product attributes:",
          attributeError
        );

        /*
         * Don't prevent the product page from
         * loading if attribute metadata fails.
         */
        setAttributeDefinitions([]);
      }
    } else {
      setAttributeDefinitions([]);
    }

    if (isList) {
  const response = await executeServiceOperation(
    serviceId,
    "list"
  );

  setRows(extractListItems(response));
} else if (isCreate) {
  setRecord(makeEmptyRecord(currentService.fields));
} else {
  const response = await executeServiceOperation(
          serviceId,
          "detail",
          {
            params: { id },
          }
        );

        setRecord(
          serviceId === "products"
            ? normalizeProductRecord(response)
            : response
        );

        if (serviceId === "products") {
            const schemaResponse = await executeServiceOperation(
              "products",
              "schema",
              {
                query: {
                  family: response.family || "default",
                },
              }
            );
            setProductSchema(schemaResponse);
            console.log("PRODUCT SCHEMA:", schemaResponse);
          }
    }
  } catch (err) {
    console.error(
      "Unable to load service page:",
      err
    );

    setError(
      getErrorMessage(
        err,
        "Unable to load this service."
      )
    );
  } finally {
    setLoading(false);
  }
}, [
  serviceId,
  id,
  isList,
  isCreate,
]);

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

      if (serviceId === "products") {
        const validationErrors =
          validateProductAttributes(
            record,
            productSchema
          );

        if (
          Object.keys(validationErrors).length > 0
        ) {
          console.error(
            "Product validation errors:",
            validationErrors
          );

          const firstError =
            Object.entries(validationErrors)[0];

          showNotification(
            "error",
            firstError
              ? `${firstError[0]}: ${firstError[1]}`
              : "Please correct the invalid product attributes before saving."
          );

          return;
        }
      }

      setSaving(true);

      try {
        const payload =
          serviceId === "products"
            ? toProductUpdatePayload(
                record,
                productSchema
              )
            : record;

        let savedRecord;

        if (isCreate) {
          savedRecord =
            await executeServiceOperation(
              serviceId,
              "create",
              {
                data: payload,
              }
            );
        } else {
          savedRecord =
            await executeServiceOperation(
              serviceId,
              "update",
              {
                params: { id },
                data: payload,
              }
            );
        }

        showNotification(
          "success",
          isCreate
            ? `${service.title} created successfully.`
            : `${service.title} saved successfully.`
        );

        if (
          isCreate &&
          savedRecord?.id !== undefined
        ) {
          navigate(
            `/services/${serviceId}/${encodeURIComponent(
              savedRecord.id
            )}`
          );
        } else if (isCreate) {
          navigate(`/services/${serviceId}`);
        } else {
          navigate(
            `/services/${serviceId}/${id}`
          );
        }
      } catch (err) {
        console.error(
          "Unable to save record:",
          err
        );

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
      productSchema,
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
    serviceId,
    id,
    navigate,
    productSchema,
    service,
    record,
    attributeDefinitions,
    rows,
    filteredRows,

    loading,
    saving,
    error,
    searchText,
    activeTab,
    notification,

    isList,
    isCreate,
    isEdit,
    isView,
    isReadOnly,

    listFields,
    formFields,
    formContext,
    pageTitle,

    setRecord,
    setSearchText,
    setActiveTab,

    loadPage,
    handleFieldChange,
    handleSave,
    showNotification,
    closeNotification,
    backToList,
  };
}

export default useServicePage;
