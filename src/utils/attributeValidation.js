const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    String(value).trim() === ""
  );
};

export const getAttributeScope = (attribute) => {
  if (
    attribute.valuePerLocale &&
    attribute.valuePerChannel
  ) {
    return "channel_locale_specific";
  }

  if (attribute.valuePerChannel) {
    return "channel_specific";
  }

  return "common";
};

export const getAttributeValue = (
  record,
  attribute
) => {
  const { code } = attribute;
  const scope = getAttributeScope(attribute);

  if (scope === "common") {
    return (
      record.attributes?.common?.[code] ?? ""
    );
  }

  if (scope === "channel_specific") {
    return (
      record.attributes
        ?.channel_specific
        ?.default?.[code] ?? ""
    );
  }

  if (scope === "channel_locale_specific") {
    return (
      record.attributes
        ?.channel_locale_specific
        ?.default
        ?.en_US?.[code] ?? ""
    );
  }

  return "";
};

export const setAttributeValue = (
  record,
  attribute,
  value
) => {
  const scope = getAttributeScope(attribute);

  const nextRecord = {
    ...record,
    attributes: {
      ...(record.attributes ?? {}),
    },
  };

  // Dedicated product fields have a flat representation
  // used by the Overview tab.
  const dedicatedFieldMap = {
    short_description: "shortDescription",
    description: "description",
    price: "price",
    cost: "cost",
    sku: "sku",
    name: "name",
  };

  if (scope === "common") {
    nextRecord.attributes.common = {
      ...(nextRecord.attributes.common ?? {}),
      [attribute.code]: value,
    };

    nextRecord[attribute.code] = value;
  }

  if (scope === "channel_specific") {
    nextRecord.attributes.channel_specific = {
      ...(nextRecord.attributes.channel_specific ?? {}),
      default: {
        ...(nextRecord.attributes.channel_specific?.default ?? {}),
        [attribute.code]: value,
      },
    };

    if (dedicatedFieldMap[attribute.code]) {
      nextRecord[dedicatedFieldMap[attribute.code]] =
        value;
    }
  }

  if (scope === "channel_locale_specific") {
    nextRecord.attributes.channel_locale_specific = {
      ...(nextRecord.attributes.channel_locale_specific ?? {}),
      default: {
        ...(nextRecord.attributes.channel_locale_specific?.default ?? {}),
        en_US: {
          ...(nextRecord.attributes.channel_locale_specific?.default?.en_US ?? {}),
          [attribute.code]: value,
        },
      },
    };

    if (dedicatedFieldMap[attribute.code]) {
      nextRecord[dedicatedFieldMap[attribute.code]] =
        value;
    }
  }

  return nextRecord;
};

export const validateAttributeValue = (
  attribute,
  value,
  required = attribute.required === true
) => {
  const label =
    attribute.label || attribute.code;

  if (required && isEmpty(value)) {
    return `${label} is required.`;
  }

  // Optional empty values are valid.
  if (isEmpty(value)) {
    return "";
  }

  if (
    attribute.type === "boolean" &&
    typeof value !== "boolean"
  ) {
    return `${label} must be true or false.`;
  }

  if (
    attribute.type === "price" ||
    attribute.type === "number"
  ) {
    if (!Number.isFinite(Number(value))) {
      return `${label} must be a valid number.`;
    }
  }

  if (
    attribute.validation === "decimal"
  ) {
    if (!/^-?\d+(\.\d+)?$/.test(String(value))) {
      return `${label} must be a valid decimal value.`;
    }
  }

  if (
    attribute.validation === "integer"
  ) {
    if (!/^-?\d+$/.test(String(value))) {
      return `${label} must be a valid integer.`;
    }
  }

  if (
    attribute.type === "select" &&
    Array.isArray(attribute.options) &&
    attribute.options.length > 0
  ) {
    const validOption = attribute.options.some(
      (option) => {
        if (typeof option === "string") {
          return option === value;
        }

        return option.code === value;
      }
    );

    if (!validOption) {
      return `${label} has an invalid option.`;
    }
  }

  if (attribute.regexPattern) {
    try {
      const regex = new RegExp(
        attribute.regexPattern
      );

      if (!regex.test(String(value))) {
        return `${label} has an invalid format.`;
      }
    } catch {
      // Ignore an invalid regex supplied by backend metadata.
    }
  }

  return "";
};

export const validateProductAttributes = (
  record,
  productSchema
) => {
  const errors = {};

  if (!productSchema) {
    return errors;
  }

  const requiredAttributes = new Set(
    productSchema.requiredAttributes ?? []
  );

  for (
    const attribute of productSchema.attributes ?? []
  ) {
    const value = getAttributeValue(
      record,
      attribute
    );

    const required =
      requiredAttributes.has(attribute.code) ||
      attribute.required === true;

    const error = validateAttributeValue(
      attribute,
      value,
      required
    );

    if (error) {
      errors[attribute.code] = error;
    }
  }

  return errors;
};