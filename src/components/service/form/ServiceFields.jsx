
import {
  Box,
  MenuItem,
  TextField,
} from "@mui/material";

import renderReadOnlyField from "../../RenderReadOnlyField";

function ServiceFields({
  fields,
  record,
  isReadOnly,
  onFieldChange,
  setRecord,
}) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
        },
        columnGap: 2,
        rowGap: 1.5,
      }}
    >
      {fields.map((field) => {
        const disabled =
          isReadOnly || field.readOnly === true;

        if (isReadOnly) {
          return renderReadOnlyField(
            field,
            record[field.name]
          );
        }

        if (field.type === "select") {
          return (
            <TextField
              key={field.name}
              select
              name={field.name}
              label={field.label}
              value={record[field.name] ?? ""}
              onChange={onFieldChange}
              required={field.required}
              disabled={disabled}
              fullWidth
              size="small"
            >
              {(field.options || []).map((option) => {
                const value =
                  typeof option === "string"
                    ? option
                    : option.value;

                const label =
                  typeof option === "string"
                    ? option
                    : option.label;

                return (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                );
              })}
            </TextField>
          );
        }

        if (field.type === "boolean") {
          return (
            <TextField
              key={field.name}
              select
              name={field.name}
              label={field.label}
              value={String(Boolean(record[field.name]))}
              onChange={(event) =>
                setRecord((previous) => ({
                  ...previous,
                  [field.name]:
                    event.target.value === "true",
                }))
              }
              disabled={disabled}
              fullWidth
              size="small"
            >
              <MenuItem value="true">Yes</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </TextField>
          );
        }

        return (
          <TextField
            key={field.name}
            name={field.name}
            label={field.label}
            type={
              ["number", "date"].includes(field.type)
                ? field.type
                : "text"
            }
            value={record[field.name] ?? ""}
            onChange={onFieldChange}
            required={field.required}
            disabled={disabled}
            multiline={field.type === "textarea"}
            minRows={field.type === "textarea" ? 3 : undefined}
            fullWidth
            size="small"
            sx={
              field.type === "textarea"
                ? { gridColumn: { sm: "1 / -1" } }
                : undefined
            }
            InputLabelProps={
              field.type === "date"
                ? { shrink: true }
                : undefined
            }
          />
        );
      })}
    </Box>
  );
}

export default ServiceFields;
