import { executeServiceOperation } from "../api/serviceApi";

export const getProducts = (query = {}) =>
  executeServiceOperation("products", "list", {
    query,
  });

export const getProduct = (id) =>
  executeServiceOperation("products", "detail", {
    params: { id },
  });

export const createProduct = (data) =>
  executeServiceOperation("products", "create", {
    data,
  });

export const updateProduct = (id, data) =>
  executeServiceOperation("products", "update", {
    params: { id },
    data,
  });