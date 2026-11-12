
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

function ServiceTable({
  rows,
  fields,
  service,
  serviceId,
  navigate,
}) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 2.5,
        border: "1px solid #E5E8E3",
        boxShadow: "0 2px 8px rgba(20, 30, 20, 0.04)",
        overflowX: "auto",
      }}
    >
      <Table
        sx={{
          minWidth: 650,
          "& .MuiTableCell-head": {
            bgcolor: "#202522",
            color: "#FFFFFF",
            fontWeight: 600,
            fontSize: 13,
            py: 1.75,
            whiteSpace: "nowrap",
          },
          "& .MuiTableCell-body": {
            color: "#303630",
            py: 1.75,
            fontSize: 14,
          },
          "& .MuiTableBody-root .MuiTableRow-root:hover": {
            bgcolor: "#F0F5F1",
          },
        }}
      >
        <TableHead>
          <TableRow>
            {fields.map((field) => (
              <TableCell key={field.name}>
                {field.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={Math.max(fields.length, 1)}>
                No records found.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, index) => (
              <TableRow
                key={row.id ?? index}
                hover
                onClick={() => {
                  if (service.capabilities?.view) {
                    const recordId =
                      serviceId === "attributes"
                        ? row.code
                        : row.sku;

                    navigate(
                      `/services/${serviceId}/${recordId}`
                    );
                  }
                }}
                sx={{
                  cursor: service.capabilities?.view
                    ? "pointer"
                    : "default",
                }}
              >
                {fields.map((field) => {
                      const fieldValue =
                        serviceId === "products"
                          ? row[field.name] ??
                            row.attributes?.common?.[field.name]
                          : row[field.name];

                      return (
                        <TableCell key={field.name}>
                          {fieldValue === null ||
                          fieldValue === undefined
                            ? "—"
                            : String(fieldValue)}
                        </TableCell>
                      );
                    })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ServiceTable;
