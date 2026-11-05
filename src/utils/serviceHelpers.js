
export function resolveEndpoint(path, id) {
  if (!path) {
    throw new Error("The required API endpoint is not configured.");
  }

  if (id === undefined || id === null) {
    return path;
  }

  return path.replace("{id}", encodeURIComponent(String(id)));
}

export function getErrorMessage(error, fallback) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
}
