import {
  Box,
  Button,
  Paper,
  Typography,
} from "@mui/material";

import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import {
  getAttributeGroups,
  formatValue,
} from "../utils/serviceFieldHelpers";
import useServicePage from "../hooks/useServicePage";
import ServiceLoading from "../components/service/common/ServiceLoading";
import ServiceError from "../components/service/common/ServiceError";
import ServicePageHeader from "../components/service/common/ServicePageHeader";
import ServiceNotification from "../components/service/common/ServiceNotification";
import ServiceList from "../components/service/list/ServiceList";
import ServiceForm from "../components/service/form/ServiceForm";
import ServiceFields from "../components/service/form/ServiceFields";
import ServiceAttributesTab from "../components/service/form/tabs/ServiceAttributesTab";
import ServicePlaceholderTab from "../components/service/form/tabs/ServicePlaceholderTab";
import ServiceOverviewTab from "../components/service/form/tabs/ServiceOverviewTab";

function ServicePage({ mode }) {
  const {
  serviceId,
  id,
  navigate,
  service,
  record,
  attributeDefinitions,
  rows,
  filteredRows,
  loading,
  saving,
  error,
  searchText,
  activeTab,
  notification,
  isList,
  isCreate,
  isEdit,
  isView,
  isReadOnly,
  listFields,
  formFields,
  pageTitle,
  setRecord,
  setSearchText,
  setActiveTab,
  loadPage,
  handleFieldChange,
  handleSave,
  closeNotification,
  backToList,
  productSchema
} = useServicePage(mode);
// Show loading state while service data is being fetched
if (loading) {
  return <ServiceLoading />;
}

// Show error state if loading fails
if (error) {
  return (
    <ServiceError
      error={error}
      onRetry={loadPage}
      navigate={navigate}
    />
  );
}

// Prevent rendering before service configuration is available
if (!service) {
  return null;
}

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, md: 2 } }}>
      <ServicePageHeader
          service={service}
          serviceId={serviceId}
          id={id}
          isList={isList}
          isView={isView}
          pageTitle={pageTitle}
          navigate={navigate}
        />

      {isList && (
        <ServiceList
          service={service}
          serviceId={serviceId}
          rows={rows}
          filteredRows={filteredRows}
          listFields={listFields}
          searchText={searchText}
          setSearchText={setSearchText}
          navigate={navigate}
        />
      )}

      
      {!isList && (
        <ServiceForm
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
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleSave={handleSave}
            backToList={backToList}
            handleCancel={() =>
              isCreate
                ? backToList()
                : navigate(`/services/${serviceId}/${id}`)
            }
            navigate={navigate}
          >

         {activeTab === "overview" && (
          <ServiceOverviewTab
            service={service}
            serviceId={serviceId}
            id={id}
            record={record}
            formFields={formFields}
            isReadOnly={isReadOnly}
            isView={isView}
            handleFieldChange={handleFieldChange}
            setRecord={setRecord}
            navigate={navigate}
          />
        )}

        {activeTab === "attributes" && (
          <ServiceAttributesTab
            record={record}
            attributeDefinitions={attributeDefinitions}
            isReadOnly={isReadOnly}
            setRecord={setRecord}
            productSchema={productSchema}
          />
        )}

        {activeTab !== "overview" &&
          activeTab !== "attributes" && (
            <ServicePlaceholderTab
              activeTab={activeTab}
              serviceId={serviceId}
              id={id}
              isView={isView}
              navigate={navigate}
            />
          )}
        </ServiceForm>
      )}

      <ServiceNotification
        notification={notification}
        onClose={closeNotification}
      />
    </Box>
  );
}

export default ServicePage;