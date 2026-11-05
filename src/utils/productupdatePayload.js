const toProductUpdatePayload = (record) => {
  const common = record.attributes?.common ?? {};
  const localized =
    record.attributes?.channel_locale_specific?.default?.en_US ?? {};
  const channel =
    record.attributes?.channel_specific?.default ?? {};

  const price = localized.price?.USD;
  const cost = channel.cost?.USD;

  return {
    sku: record.sku,
    family: record.family,
    status: record.status,
    name: record.name ?? localized.name,
    shortDescription:
      localized.short_description ?? record.shortDescription ?? "",
    description: record.description ?? localized.description ?? "",
    price: price == null ? null : Number(price),
    cost: cost == null ? null : Number(cost),
    color: common.color ?? "",
    size: common.size ?? "",
    attributes: {
      meta_title: localized.meta_title ?? "",
    },
  };
};

export default toProductUpdatePayload;