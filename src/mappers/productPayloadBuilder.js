const setNestedValue = (object, path, value) => {
  let current = object;

  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];

    if (!current[key]) {
      current[key] = {};
    }

    current = current[key];
  }

  current[path[path.length - 1]] = value;
};

const getAttributePath = (attribute) => {
  const {
    code,
    scope,
  } = attribute;

  if (scope === "common") {
    return ["attributes", "common", code];
  }

  if (scope === "channel_specific") {
    return [
      "attributes",
      "channel_specific",
      "default",
      code,
    ];
  }

  if (scope === "channel_locale_specific") {
    return [
      "attributes",
      "channel_locale_specific",
      "default",
      "en_US",
      code,
    ];
  }

  return ["attributes", "common", code];
};

export const buildProductPayload = (
  product,
  attributes = []
) => {
  const payload = {
    sku: product.sku,
    family: product.family || "default",
    type: product.type || "simple",
    status: Boolean(product.status),
    name: product.name,
    description: product.description,
    externalId: product.externalId || null,
    brand: product.brand || null,
    category: product.category || null,
    attributes: {},
  };

  for (const attribute of attributes) {
    const value = product.attributes?.[attribute.code];

    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      continue;
    }

    setNestedValue(
      payload,
      getAttributePath(attribute),
      value
    );
  }

  return payload;
};