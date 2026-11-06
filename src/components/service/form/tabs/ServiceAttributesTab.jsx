import { useMemo, useState } from "react";

import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import {
  getAttributeScope,
  getAttributeValue,
  setAttributeValue,
  validateAttributeValue,
} from "../../../../utils/attributeValidation";

function ServiceAttributesTab({
  record,
  productSchema,
  isReadOnly,
  setRecord,
}) {
  const [errors, setErrors] = useState({});

  const attributes = useMemo(
    () => productSchema?.attributes ?? [],
    [productSchema]
  );

  const requiredAttributes = useMemo(
    () =>
      new Set(
        productSchema?.requiredAttributes ?? []
      ),
    [productSchema]
  );

  const groupedAttributes = useMemo(() => {
    const groups = {};

    for (const attribute of attributes) {
      const groupName =
        attribute.group || "General";

      if (!groups[groupName]) {
        groups[groupName] = [];
      }

      groups[groupName].push(attribute);
    }

    return groups;
  }, [attributes]);

  const handleChange = (
    attribute,
    value
  ) => {
    const required =
      requiredAttributes.has(attribute.code) ||
      attribute.required === true;

    const error = validateAttributeValue(
      attribute,
      value,
      required
    );

    setErrors((previous) => ({
      ...previous,
      [attribute.code]: error,
    }));

    setRecord((previous) =>
      setAttributeValue(
        previous,
        attribute,
        value
      )
    );
  };

  const renderField = (attribute) => {
    const value = getAttributeValue(
      record,
      attribute
    );

    const error =
      errors[attribute.code] || "";

    const required =
      requiredAttributes.has(attribute.code) ||
      attribute.required === true;

    const label =
      attribute.label || attribute.code;

    const type = (
      attribute.type || "text"
    ).toLowerCase();

    if (type === "boolean") {
      return (
        <Box
          key={attribute.code}
          sx={{
            display: "flex",
            alignItems: "center",
            minHeight: 56,
          }}
        >
          <Switch
            checked={Boolean(value)}
            disabled={isReadOnly}
            onChange={(event) =>
              handleChange(
                attribute,
                event.target.checked
              )
            }
          />

          <Typography>
            {label}
            {required ? " *" : ""}
          </Typography>

          {error && (
            <Typography
              color="error"
              variant="caption"
              sx={{ ml: 2 }}
            >
              {error}
            </Typography>
          )}
        </Box>
      );
    }

    if (type === "select") {
      return (
        <FormControl
          key={attribute.code}
          fullWidth
          error={Boolean(error)}
          required={required}
        >
          <InputLabel>
            {label}
          </InputLabel>

          <Select
            value={value ?? ""}
            label={label}
            disabled={isReadOnly}
            onChange={(event) =>
              handleChange(
                attribute,
                event.target.value
              )
            }
          >
            {!required && (
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
            )}

            {(attribute.options ?? []).map(
              (option) => {
                const optionCode =
                  typeof option === "string"
                    ? option
                    : option.code;

                const optionLabel =
                  typeof option === "string"
                    ? option
                    : option.label ||
                      option.labels?.en_US ||
                      option.code;

                return (
                  <MenuItem
                    key={optionCode}
                    value={optionCode}
                  >
                    {optionLabel}
                  </MenuItem>
                );
              }
            )}
          </Select>

          {error && (
            <FormHelperText>
              {error}
            </FormHelperText>
          )}
        </FormControl>
      );
    }

    const isTextarea =
      type === "textarea";

    const isNumeric =
      type === "number" ||
      type === "price";

    return (
      <TextField
        key={attribute.code}
        fullWidth
        label={label}
        required={required}
        value={value ?? ""}
        disabled={isReadOnly}
        error={Boolean(error)}
        helperText={error || ""}
        multiline={isTextarea}
        minRows={isTextarea ? 4 : undefined}
        type={
          isNumeric ? "number" : "text"
        }
        inputProps={
          isNumeric
            ? {
                step:
                  type === "price"
                    ? "0.01"
                    : "any",
              }
            : undefined
        }
        onChange={(event) =>
          handleChange(
            attribute,
            event.target.value
          )
        }
      />
    );
  };

  if (!productSchema) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="text.secondary">
          Loading product schema...
        </Typography>
      </Box>
    );
  }

  if (attributes.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="text.secondary">
          No product attributes are available
          for this product family.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ mb: 1 }}
      >
        Product attributes
      </Typography>

      <Typography
        color="text.secondary"
        variant="body2"
        sx={{ mb: 3 }}
      >
        Edit attributes defined by the product
        family schema.
      </Typography>

      {Object.entries(
        groupedAttributes
      ).map(([groupName, groupAttributes]) => (
        <Paper
          key={groupName}
          variant="outlined"
          sx={{
            mb: 2,
            p: { xs: 2, md: 3 },
            borderRadius: 2,
          }}
        >
          <Typography
            fontWeight={700}
            sx={{ mb: 2 }}
          >
            {groupName}
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            {groupAttributes.map(
              renderField
            )}
          </Box>
        </Paper>
      ))}
    </Box>
  );
}

export default ServiceAttributesTab;