import apiClient from "./client";

export const getServices = async () => {
  const response = await apiClient.get("/api/services");

  const data = response.data;

  // Validate the top-level metadata contract before rendering it.
  if (
    !data ||
    data.schemaVersion !== 1 ||
    !Array.isArray(data.services)
  ) {
    throw new Error("The service discovery response has an invalid format.");
  }

  return data.services;
};