
export function getFieldsFor(fields, context) {
  return (fields || []).filter((field) => {
    if (field.visibleIn) {
      return field.visibleIn.includes(context);
    }

    // Backward-compatible default if visibleIn is omitted.
    return true;
  });
}

export function getAttributeGroups(attributes = {}) {
  return [
    {
      key: "common",
      title: "Common attributes",
      values: attributes.common || {},
    },
    {
      key: "channel_locale_specific",
      title: "Channel and locale attributes",
      values: attributes.channel_locale_specific || {},
    },
    {
      key: "channel_specific",
      title: "Channel-specific attributes",
      values: attributes.channel_specific || {},
    },
  ];
}

export function formatValue(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

export function makeEmptyRecord(fields) {
  return (fields || []).reduce((record, field) => {
    record[field.name] =
      field.type === "boolean" ? false : "";

    return record;
  }, {});
}
