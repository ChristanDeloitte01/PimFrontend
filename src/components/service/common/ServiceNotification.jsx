
import { Alert, Snackbar } from "@mui/material";

function ServiceNotification({ notification, onClose }) {
  return (
    <Snackbar
      open={notification.open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        severity={notification.severity}
        variant="filled"
        onClose={onClose}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
}

export default ServiceNotification;
