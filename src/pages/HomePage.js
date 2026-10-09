import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import BrandingWatermarkOutlinedIcon from "@mui/icons-material/BrandingWatermarkOutlined";
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";

import { useNavigate } from "react-router-dom";

const menuItems = [
  {
    title: "Catalog",
    description: "Manage product catalogs",
    path: "/catalogs",
    icon: <CollectionsBookmarkOutlinedIcon fontSize="large" />,
  },
  {
    title: "Products",
    description: "Manage products and product information",
    path: "/products",
    icon: <Inventory2OutlinedIcon fontSize="large" />,
  },
  {
    title: "Brands",
    description: "Manage product brands",
    path: "/brands",
    icon: <BrandingWatermarkOutlinedIcon fontSize="large" />,
  },
  {
    title: "Categories",
    description: "Manage product categories",
    path: "/categories",
    icon: <CategoryOutlinedIcon fontSize="large" />,
  },
];

function HomePage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Product Information Management
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Select an area to manage.
      </Typography>

      <Grid container spacing={3}>
        {menuItems.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.title}>
            <Card sx={{ height: "100%" }}>
              <CardActionArea
                onClick={() => navigate(item.path)}
                sx={{ height: "100%" }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ mb: 2, color: "primary.main" }}>
                    {item.icon}
                  </Box>

                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {item.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default HomePage;