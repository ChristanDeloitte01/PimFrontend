import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

import { getServices } from "../../api/serviceApi";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      setServices(await getServices());
    } catch (err) {
      console.error("Unable to load services:", err);
      setError("Unable to load navigation services.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#F5F6F4",
      }}
    >
      <Sidebar services={services} />

      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          component="header"
          sx={{
            height: 26,
            px: { xs: 2, md: 4 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            bgcolor: "#FFFFFF",
            borderBottom: "1px solid #E7EAE6",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: "#202522" }}
          >
            Product Workspace
          </Typography>

          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "#285D4B",
              fontSize: 14,
            }}
          >
            PW
          </Avatar>
        </Box>

        <Box
          sx={{
            flex: 1,
            p: { xs: 2, md: 4 },
            minWidth: 0,
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                py: 4,
              }}
            >
              <CircularProgress size={22} />
              <Typography color="text.secondary">
                Loading workspace...
              </Typography>
            </Box>
          ) : error ? (
            <Alert
              severity="error"
              action={
                <IconButton
                  color="inherit"
                  size="small"
                  aria-label="Retry loading services"
                  onClick={loadServices}
                >
                  <RefreshIcon />
                </IconButton>
              }
            >
              {error}
            </Alert>
          ) : (
            <Outlet context={{ services, reloadServices: loadServices }} />
          )}
        </Box>
      </Box>
    </Box>
  );
}