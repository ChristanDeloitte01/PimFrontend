const getNestedAttributeValue = (record, code) => {
  const common = record.attributes?.common ?? {};

  const channel =
    record.attributes?.channel_specific?.default ?? {};

  const localized =
    record.attributes?.channel_locale_specific?.default?.en_US ?? {};

  if (common[code] !== undefined) {
    return common[code];
  }

  if (channel[code] !== undefined) {
    return channel[code];
  }

  if (localized[code] !== undefined) {
    return localized[code];
  }

  return undefined;
};

const normalizeProductRecord = (record = {}) => {
  const localized =
    record.attributes?.channel_locale_specific?.default?.en_US ?? {};

  const channel =
    record.attributes?.channel_specific?.default ?? {};

  const common =
    record.attributes?.common ?? {};

  const price = localized.price?.USD;
  const cost = channel.cost?.USD;

  return {
    ...record,

    sku:
      record.sku ??
      common.sku ??
      "",

    name:
      record.name ??
      localized.name ??
      "",

    shortDescription:
      record.shortDescription ??
      localized.short_description ??
      "",

    description:
      record.description ??
      localized.description ??
      "",

    price:
      record.price ??
      (price != null ? Number(price) : ""),

    cost:
      record.cost ??
      (cost != null ? Number(cost) : ""),

    brand:
      record.brand ??
      common.brand ??
      "",

    category:
      record.category ??
      "",

    ...Object.fromEntries(
      Object.keys(common).map((code) => [
        code,
        record[code] ?? common[code],
      ])
    ),
  };
};

export default normalizeProductRecord;