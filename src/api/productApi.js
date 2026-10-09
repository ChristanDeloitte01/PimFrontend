import apiClient from "./client";

export const getProducts = async () => {
  const response = await apiClient.get("/api/products");
  return response.data;
};

export const getProduct = async (id) => {
  const response = await apiClient.get(`/api/products/${id}`);
  return response.data;
};

export const createProduct = async (product) => {
  const response = await apiClient.post("/api/products", product);
  return response.data;
};

export const updateProduct = async (id, product) => {
  const response = await apiClient.put(`/api/products/${id}`, product);
  return response.data;
};