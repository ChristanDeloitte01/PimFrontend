import {
  Box,
  Paper,
  Typography,
} from "@mui/material";
import { formatValue, getAttributeGroups } from "../../../../utils/serviceFieldHelpers";


function ServiceAttributesTab({ record }) {
  const groups = getAttributeGroups(record.attributes);

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
        Shared, localized, and channel-specific product information.
      </Typography>

      {groups.map((group) => (
        <Paper
          key={group.key}
          variant="outlined"
          sx={{
            mb: 2,
            p: { xs: 2, md: 3 },
            borderRadius: 2,
          }}
        >
          <Typography fontWeight={700} sx={{ mb: 2 }}>
            {group.title}
          </Typography>

          {Object.keys(group.values).length === 0 ? (
            <Typography
              color="text.secondary"
              variant="body2"
            >
              No attributes available.
            </Typography>
          ) : (
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
              {Object.entries(group.values).map(
                ([key, value]) => (
                  <Box
                    key={key}
                    sx={{
                      minWidth: 0,
                      borderBottom: "1px solid #E5E8E3",
                      pb: 1.5,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      {key.replace(/_/g, " ")}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        color: "#202522",
                        fontWeight: 500,
                        whiteSpace: "pre-wrap",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {formatValue(value)}
                    </Typography>
                  </Box>
                )
              )}
            </Box>
          )}
        </Paper>
      ))}
    </Box>
  );
}

export default ServiceAttributesTab;