
import { Tabs, Tab } from "@mui/material";

const tabs = [
  { value: "overview", label: "Overview" },
  { value: "attributes", label: "Attributes" },
  { value: "media", label: "Media" },
  { value: "categories", label: "Categories" },
  { value: "channels", label: "Channels" },
  { value: "history", label: "History" },
];

function ServiceFormTabs({ activeTab, onChange }) {
  return (
    <Tabs
      value={activeTab}
      onChange={(_, value) => onChange(value)}
      variant="scrollable"
      scrollButtons="auto"
      sx={{
        minHeight: 48,
        "& .MuiTab-root": {
          minHeight: 48,
          textTransform: "none",
          fontWeight: 500,
          color: "#59635C",
        },
        "& .Mui-selected": {
          color: "#246B50 !important",
          fontWeight: 700,
        },
        "& .MuiTabs-indicator": {
          bgcolor: "#246B50",
          height: 3,
        },
      }}
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.value}
          value={tab.value}
          label={tab.label}
        />
      ))}
    </Tabs>
  );
}

export default ServiceFormTabs;
