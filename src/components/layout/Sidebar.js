import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import Inventory2OutlinedIcon from
  "@mui/icons-material/Inventory2Outlined";
import CategoryOutlinedIcon from
  "@mui/icons-material/CategoryOutlined";
import BrandingWatermarkOutlinedIcon from
  "@mui/icons-material/BrandingWatermarkOutlined";
import CollectionsBookmarkOutlinedIcon from
  "@mui/icons-material/CollectionsBookmarkOutlined";
import ExtensionOutlinedIcon from
  "@mui/icons-material/ExtensionOutlined";
import AutoAwesomeOutlinedIcon from
  "@mui/icons-material/AutoAwesomeOutlined";
import DashboardOutlinedIcon from
  "@mui/icons-material/DashboardOutlined";

import { NavLink } from "react-router-dom";

const serviceIcons = {
  inventory: Inventory2OutlinedIcon,
  category: CategoryOutlinedIcon,
  brand: BrandingWatermarkOutlinedIcon,
  catalog: CollectionsBookmarkOutlinedIcon,
  custom: ExtensionOutlinedIcon,
  ai: AutoAwesomeOutlinedIcon,
};

export default function Sidebar({ services = [] }) {
  return (
    <Box
      component="aside"
      sx={{
        width: { xs: 210, md: 255 },
        flexShrink: 0,
        bgcolor: "#17191D",
        color: "#FFFFFF",
        minHeight: "100vh",
        px: 2,
        py: 3,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ px: 1.5, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              bgcolor: "#285D4B",
              borderRadius: 1.5,
            }}
          />

          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            PIMForge
          </Typography>
        </Box>

        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 1.5,
            ml: 0.5,
            color: "#A8B0AA",
            letterSpacing: 1,
          }}
        >
          PRODUCT WORKSPACE
        </Typography>
      </Box>

      <List disablePadding>
        <ListItemButton
          component={NavLink}
          to="/"
          end
          sx={navItemStyles}
        >
          <ListItemIcon sx={navIconStyles}>
            <DashboardOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
      </List>

      <Typography
        variant="overline"
        sx={{
          color: "#818A83",
          px: 1.5,
          mt: 3,
          mb: 1,
          letterSpacing: 1.2,
        }}
      >
        Services
      </Typography>

      <List disablePadding sx={{ display: "grid", gap: 0.5 }}>
        {services.map((service) => {
          const Icon =
            serviceIcons[service.icon] || ExtensionOutlinedIcon;

          return (
            <ListItemButton
              key={service.id}
              component={NavLink}
              to={`/services/${service.id}`}
              sx={navItemStyles}
            >
              <ListItemIcon sx={navIconStyles}>
                <Icon />
              </ListItemIcon>

              <ListItemText
                primary={service.title}
                primaryTypographyProps={{
                  noWrap: true,
                  fontSize: 14,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ borderColor: "#34383D", my: 2 }} />

      <Typography
        variant="caption"
        sx={{ color: "#818A83", px: 1.5 }}
      >
        Custom PIM · Development
      </Typography>
    </Box>
  );
}

const navItemStyles = {
  minHeight: 44,
  px: 1.5,
  borderRadius: 1.5,
  color: "#C4CBC5",

  "& .MuiListItemText-primary": {
    fontSize: 14,
    fontWeight: 500,
  },

  "&:hover": {
    bgcolor: "#252A28",
    color: "#FFFFFF",
  },

  "&.active": {
    bgcolor: "#285D4B",
    color: "#FFFFFF",
  },

  "&.active .MuiListItemText-primary": {
    fontWeight: 700,
  },
};

const navIconStyles = {
  minWidth: 36,
  color: "inherit",

  "& .MuiSvgIcon-root": {
    fontSize: 21,
  },
};