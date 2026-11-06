import { executeServiceOperation } from "../api/serviceApi";

export const getAttributes = (query = {}) =>
  executeServiceOperation("attributes", "list", {
    query,
  });

export const getAttribute = (code) =>
  executeServiceOperation("attributes", "detail", {
    params: { code },
  });

export const getAttributeOptions = (code) =>
  executeServiceOperation("attributes", "options", {
    params: { code },
  });

export const createAttribute = (data) =>
  executeServiceOperation("attributes", "create", {
    data,
  });

export const updateAttribute = (code, data) =>
  executeServiceOperation("attributes", "update", {
    params: { code },
    data,
  });