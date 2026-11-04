import { Box, Divider, Typography } from "@mui/material";

const renderReadOnlyField = (field, value) => {
  const displayValue =
    value === null || value === undefined || value === ""
      ? "—"
      : field.type === "boolean"
        ? value
          ? "Yes"
          : "No"
        : String(value);

  return (
    <Box key={field.name} sx={{ py: 1.5 }}>
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          mb: 0.5,
          fontWeight: 500,
        }}
      >
        {field.label}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: "text.primary",
          fontWeight: 500,
          overflowWrap: "anywhere",
          whiteSpace: field.type === "textarea" ? "pre-wrap" : "normal",
        }}
      >
        {displayValue}
      </Typography>

      <Divider sx={{ mt: 1.5 }} />
    </Box>
  );
};

export default renderReadOnlyField;