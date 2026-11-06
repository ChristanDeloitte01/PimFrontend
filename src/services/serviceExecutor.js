import { executeServiceOperation } from "../api/serviceApi";

export const serviceList = (serviceId, query = {}) =>
  executeServiceOperation(serviceId, "list", {
    query,
  });

export const serviceDetail = (serviceId, params = {}) =>
  executeServiceOperation(serviceId, "detail", {
    params,
  });

export const serviceCreate = (serviceId, data) =>
  executeServiceOperation(serviceId, "create", {
    data,
  });

export const serviceUpdate = (serviceId, params, data) =>
  executeServiceOperation(serviceId, "update", {
    params,
    data,
  });

export const serviceOptions = (serviceId, params = {}) =>
  executeServiceOperation(serviceId, "options", {
    params,
  });