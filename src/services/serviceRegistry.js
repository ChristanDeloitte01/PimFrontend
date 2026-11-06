import {
  getServices,
  getService,
  clearServicesCache,
} from "../api/serviceApi";

export const loadServiceRegistry = async () => {
  return getServices();
};

export const getRegisteredService = async (serviceId) => {
  return getService(serviceId);
};

export const refreshServiceRegistry = async () => {
  clearServicesCache();
  return getServices();
};