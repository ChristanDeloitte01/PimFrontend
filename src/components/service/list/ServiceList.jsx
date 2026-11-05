
import Box from "@mui/material/Box";

import ServiceListToolbar from "./ServiceListToolbar";
import ServiceTable from "./ServiceTable";

function ServiceList({
  service,
  serviceId,
  rows,
  filteredRows,
  listFields,
  searchText,
  setSearchText,
  navigate,
}) {
  return (
    <Box>
      <ServiceListToolbar
        service={service}
        searchText={searchText}
        onSearchChange={setSearchText}
        recordCount={filteredRows.length}
      />

      <ServiceTable
        rows={filteredRows}
        fields={listFields}
        service={service}
        serviceId={serviceId}
        navigate={navigate}
      />
    </Box>
  );
}

export default ServiceList;
