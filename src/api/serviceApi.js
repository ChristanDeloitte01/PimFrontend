import apiClient from "./client";

let servicesCache = null;

export const getServices = async () => {
  const response = await apiClient.get("/api/services");

  const data = response.data;

  if (
    !data ||
    data.schemaVersion !== 1 ||
    !Array.isArray(data.services)
  ) {
    throw new Error("The service discovery response has an invalid format.");
  }

  servicesCache = data.services;

  return servicesCache;
};

export const getService = async (serviceId) => {
  const services = servicesCache || (await getServices());

  const service = services.find((item) => item.id === serviceId);

  if (!service) {
    throw new Error(`Service "${serviceId}" was not found.`);
  }

  return service;
};

const resolveEndpoint = (template, params = {}) => {
  if (!template) {
    throw new Error(
      "The service operation does not have an endpoint configured."
    );
  }

  return template.replace(/\{([^}]+)\}/g, (_, key) => {
    const value = params[key];

    if (value === undefined || value === null) {
      throw new Error(
        `Missing required endpoint parameter: "${key}".`
      );
    }

    return encodeURIComponent(value);
  });
};

const operationCapabilityMap = {
  list: "list",
  detail: "view",
  options: "view",
  schema: "view",
  create: "create",
  update: "update",
  delete: "delete",
};

const methodMap = {
  list: "get",
  detail: "get",
  options: "get",
  schema: "get",
  create: "post",
  update: "put",
  delete: "delete",
};

export const executeServiceOperation = async (
  serviceId,
  operation,
  {
    params = {},
    query = {},
    data = undefined,
    config = {},
  } = {}
) => {
  const service = await getService(serviceId);

  const capability = operationCapabilityMap[operation];

  if (!capability) {
    throw new Error(
      `Unsupported service operation: "${operation}".`
    );
  }

  if (service.capabilities?.[capability] !== true) {
    throw new Error(
      `Operation "${operation}" is not enabled for service "${serviceId}".`
    );
  }

  const endpointTemplate = service.endpoints?.[operation];

  if (!endpointTemplate) {
    throw new Error(
      `Operation "${operation}" is not configured for service "${serviceId}".`
    );
  }

  const url = resolveEndpoint(endpointTemplate, params);
  const method = methodMap[operation];

  try {
    let response;

    if (
      method === "get" ||
      method === "delete"
    ) {
      response = await apiClient[method](
        url,
        {
          params: query,
          ...config,
        }
      );
    } else {
      response = await apiClient[method](
        url,
        data,
        {
          params: query,
          ...config,
        }
      );
    }

    return response.data;
  } catch (error) {
    const responseData =
      error.response?.data;

    if (responseData) {
      const normalizedError = new Error(
        responseData.message ||
          "The service request failed."
      );

      normalizedError.error =
        responseData.error;

      normalizedError.details =
        responseData.details;

      normalizedError.status =
        error.response?.status;

      throw normalizedError;
    }

    throw error;
  }
};

export const clearServicesCache = () => {
  servicesCache = null;
};