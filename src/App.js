import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ServicePage from "./pages/ServicePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/services/:serviceId"
          element={<ServicePage mode="list" />}
        />

        <Route
          path="/services/:serviceId/new"
          element={<ServicePage mode="create" />}
        />

        <Route
          path="/services/:serviceId/:id/edit"
          element={<ServicePage mode="edit" />}
        />

        <Route
          path="/services/:serviceId/:id"
          element={<ServicePage mode="view" />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;