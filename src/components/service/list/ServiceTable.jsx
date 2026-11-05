
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
                    navigate(
                      `/services/${serviceId}/${row.sku}`
                    );
                  }
                }}
                sx={{
                  cursor: service.capabilities?.view
                    ? "pointer"
                    : "default",
                }}
              >
                {fields.map((field) => (
                  <TableCell key={field.name}>
                    {row[field.name] === null ||
                    row[field.name] === undefined
                      ? "—"
                      : String(row[field.name])}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ServiceTable;
