
import { Paper, Divider } from "@mui/material";

import ServiceFormHeader from "./ServiceFormHeader";
import ServiceFormTabs from "./ServiceFormTabs";
import ServiceFormActions from "./ServiceFormActions";

function ServiceForm({
  service,
  serviceId,
  id,
  record,
  pageTitle,

  isCreate,
  isEdit,
  isView,
  isReadOnly,

  saving,
  activeTab,
  setActiveTab,

  handleSave,
  backToList,
  handleCancel,
  navigate,

  children,
}) {
  return (
    <Paper
      component="form"
      onSubmit={handleSave}
      elevation={0}
      sx={{
        bgcolor: "#FFFFFF",
        border: "1px solid #E3E7E2",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <ServiceFormHeader
        service={service}
        serviceId={serviceId}
        id={id}
        record={record}
        pageTitle={pageTitle}
        isCreate={isCreate}
        isEdit={isEdit}
        isView={isView}
        isReadOnly={isReadOnly}
        saving={saving}
        onBack={backToList}
        navigate={navigate}
      />

      <ServiceFormTabs
        serviceId={serviceId}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <Divider />

      {/* Active tab content is supplied by ServicePage */}
      {children}

      <ServiceFormActions
        saving={saving}
        isCreate={isCreate}
        isReadOnly={isReadOnly}
        onCancel={handleCancel}
      />
    </Paper>
  );
}

export default ServiceForm;
