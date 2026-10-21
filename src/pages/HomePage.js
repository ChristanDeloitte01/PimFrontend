import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  CircularProgress,
  Typography,
} from "@mui/material";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import BrandingWatermarkOutlinedIcon from "@mui/icons-material/BrandingWatermarkOutlined";
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";
import ExtensionOutlinedIcon from "@mui/icons-material/ExtensionOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";

import { useNavigate } from "react-router-dom";
import { getServices } from "../api/serviceApi";

const serviceIcons = {
  inventory: Inventory2OutlinedIcon,
  category: CategoryOutlinedIcon,
  brand: BrandingWatermarkOutlinedIcon,
  catalog: CollectionsBookmarkOutlinedIcon,
  custom: ExtensionOutlinedIcon,
  ai: AutoAwesomeOutlinedIcon,
};

function HomePage() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadServices = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getServices();
      setServices(result);
    } catch (err) {
      console.error("Unable to load services:", err);
      setError(
        "Unable to load available services. Check the middleware and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" gutterBottom>
        PimWrapper
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Select a service to get started.
      </Typography>

      {loading && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            py: 4,
          }}
        >
          <CircularProgress size={24} />
          <Typography color="text.secondary">
            Loading available services...
          </Typography>
        </Box>
      )}

      {!loading && error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={loadServices}>
              Retry
            </Button>
          }
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {!loading && !error && services.length === 0 && (
        <Alert severity="info">
          No services are currently available.
        </Alert>
      )}

      {!loading && !error && services.length > 0 && (
        <Grid container spacing={3}>
          {services.map((service) => {
            const Icon =
              serviceIcons[service.icon] || ExtensionOutlinedIcon;

            return (
              <Grid item xs={12} sm={6} md={4} key={service.id}>
                <Card sx={{ height: "100%" }}>
                  <CardActionArea
                    onClick={() =>
                      navigate(`/services/${service.id}`)
                    }
                    sx={{ height: "100%" }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ mb: 2, color: "primary.main" }}>
                        <Icon fontSize="large" />
                      </Box>

                      <Typography variant="h6" gutterBottom>
                        {service.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {service.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}

export default HomePage;