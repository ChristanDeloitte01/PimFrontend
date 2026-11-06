const getNestedValue = (object, path) => {
  return path.reduce((current, key) => {
    if (current === undefined || current === null) {
      return undefined;
    }

    return current[key];
  }, object);
};

export const getAttributeValue = (
  product,
  attribute
) => {
  const {
    code,
    scope,
    valuePerChannel,
    valuePerLocale,
  } = attribute;

  const attributes = product?.attributes || {};

  if (scope === "common") {
    return attributes.common?.[code];
  }

  if (scope === "channel_specific") {
    const channel = "default";

    return attributes.channel_specific?.[channel]?.[code];
  }

  if (scope === "channel_locale_specific") {
    const channel = "default";
    const locale = "en_US";

    return attributes.channel_locale_specific?.[channel]?.[locale]?.[code];
  }

  return undefined;
};

export const normalizeProduct = (
  product,
  attributes = []
) => {
  const normalized = {
    sku: product?.sku ?? "",
    name: product?.name ?? "",
    description: product?.description ?? "",
    externalId: product?.externalId ?? "",
    brand: product?.brand ?? "",
    category: product?.category ?? "",
    family: product?.family ?? "",
    type: product?.type ?? "",
    status: product?.status ?? false,
    attributes: {},
  };

  for (const attribute of attributes) {
    normalized.attributes[attribute.code] =
      getAttributeValue(product, attribute);
  }

  return normalized;
};