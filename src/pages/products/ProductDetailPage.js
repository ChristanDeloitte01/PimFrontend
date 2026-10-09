import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import { CancelSharp } from "@mui/icons-material";

import { useNavigate, useParams } from "react-router-dom";

import { createProduct, getProduct, updateProduct } from "../../api/productApi";

const emptyProduct = {
  sku: "",
  name: "",
  description: "",
  externalId: "",
  brand: "",
  category: "",
};

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isNew = !id;

  const [product, setProduct] = useState(emptyProduct);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const [notification, setNotification] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  useEffect(() => {
    if (!id) {
      return;
    }

    getProduct(id)
      .then(setProduct)
      .catch((err) => {
        console.error(err);

        setNotification({
          open: true,
          severity: "error",
          message: "Unable to load product.",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProduct((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = async () => {
  setSaving(true);

  try {
    if (isNew) {
      const createdProduct = await createProduct(product);

      setNotification({
        open: true,
        severity: "success",
        message: "Product created successfully.",
      });

      // If backend returns the created product with its ID,
      // move to its detail page.
      if (createdProduct?.id) {
        navigate(`/products/${createdProduct.id}`);
      }
    } else {
      await updateProduct(id, product);

      setNotification({
        open: true,
        severity: "success",
        message: "Product saved successfully.",
      });
    }
  } catch (error) {
    console.error(error);

    setNotification({
      open: true,
      severity: "error",
      message: isNew
        ? "Unable to create product."
        : "Unable to save product.",
    });
  } finally {
    setSaving(false);
  }
};

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1000, mx: "auto", p: 4 }}>
        <Typography>Loading product...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/products")}
        sx={{ mb: 2 }}
      >
        Back to Products
      </Button>

      <Typography variant="h4" sx={{ mb: 3 }}>
        {isNew ? "Add Product" : "Product Details"}
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 3,
          }}
        >
          <TextField
            label="SKU"
            name="sku"
            value={product.sku}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Name"
            name="name"
            value={product.name}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Brand"
            name="brand"
            value={product.brand}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Category"
            name="category"
            value={product.category}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="External ID"
            name="externalId"
            value={product.externalId}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Description"
            name="description"
            value={product.description}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            sx={{ gridColumn: "1 / -1" }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 4,
            gap:2,
          }}
        >
        <Button
            variant="contained"
            startIcon={<CancelSharp/>}
            onClick={() => navigate("/products")}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() =>
          setNotification((previous) => ({
            ...previous,
            open: false,
          }))
        }
      >
        <Alert severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ProductDetailPage;