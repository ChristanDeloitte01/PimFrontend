import { useEffect } from "react";
import {
  serviceList,
  serviceDetail,
  serviceOptions,
} from "./services/serviceExecutor";

const ServiceApiTest = () => {
  useEffect(() => {
    const runTests = async () => {
      try {
        console.log("=== TEST 1: Products List ===");

        const products = await serviceList("products");

        console.log("Products:", products);

        console.log("=== TEST 2: Product Detail ===");

        const product = await serviceDetail("products", {
          id: "SHD-POLO-001",
        });

        console.log("Product:", product);

        console.log("=== TEST 3: Attributes List ===");

        const attributes = await serviceList("attributes", {
          page: 1,
          limit: 50,
          includeOptions: false,
        });

        console.log("Attributes:", attributes);

        console.log("=== TEST 4: Brand Options ===");

        const brandOptions = await serviceOptions("attributes", {
          code: "brand",
        });

        console.log("Brand options:", brandOptions);

        console.log("=== ALL TESTS PASSED ===");
      } catch (error) {
        console.error("=== SERVICE TEST FAILED ===");
        console.error("Message:", error.message);
        console.error("Error:", error.error);
        console.error("Details:", error.details);
        console.error("Status:", error.status);
        console.error(error);
      }
    };

    runTests();
  }, []);

  return <div>Service API tests running... Check the browser console.</div>;
};

export default ServiceApiTest;