const DEDICATED_FIELDS = new Set([
  "sku",
  "name",
  "short_description",
  "description",
  "price",
  "cost",
]);

const getRecordAttributeValue = (
  record,
  code
) => {
  /*
   * First check the frontend's flat attribute
   * representation.
   */
  if (
    record.attributes &&
    Object.prototype.hasOwnProperty.call(
      record.attributes,
      code
    )
  ) {
    return record.attributes[code];
  }

  /*
   * Then check the scoped representation that
   * may exist in records loaded from UnoPim.
   */
  if (
    record.attributes?.common &&
    Object.prototype.hasOwnProperty.call(
      record.attributes.common,
      code
    )
  ) {
    return record.attributes.common[code];
  }

  if (
    record.attributes?.channel_specific?.default &&
    Object.prototype.hasOwnProperty.call(
      record.attributes.channel_specific.default,
      code
    )
  ) {
    return record.attributes.channel_specific
      .default[code];
  }

  if (
    record.attributes?.channel_locale_specific
      ?.default?.en_US &&
    Object.prototype.hasOwnProperty.call(
      record.attributes.channel_locale_specific
        .default.en_US,
      code
    )
  ) {
    return record.attributes.channel_locale_specific
      .default.en_US[code];
  }

  return "";
};

const toNumberOrNull = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
};

const toProductUpdatePayload = (
  record,
  productSchema
) => {
  const payload = {
    sku: record.sku ?? "",
    family: record.family ?? "default",
    status: record.status ?? true,

    name: record.name ?? "",
    shortDescription:
      record.shortDescription ?? "",
    description:
      record.description ?? "",
    price: toNumberOrNull(record.price),
    cost: toNumberOrNull(record.cost),

    attributes: {},
  };

  for (
    const attribute of
      productSchema?.attributes ?? []
  ) {
    const code = attribute.code;

    /*
     * These are handled by dedicated wrapper
     * fields and must NOT be duplicated inside
     * attributes.
     */
    if (DEDICATED_FIELDS.has(code)) {
      continue;
    }

    const value =
      getRecordAttributeValue(
        record,
        code
      );

    payload.attributes[code] =
      value ?? "";
  }

  return payload;
};

export default toProductUpdatePayload;