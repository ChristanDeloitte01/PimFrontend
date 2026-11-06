import { useEffect, useState } from "react";
import AttributeRenderer from "../AttributeRenderer/AttributeRenderer";
import { getAttributes } from "../../services/attributeService";
import {
  normalizeProduct,
} from "../../mappers/productMapper";
import {
  buildProductPayload,
} from "../../mappers/productPayloadBuilder";

const ProductForm = ({
  product,
  onSave,
  saving = false,
}) => {
  const [attributes, setAttributes] = useState([]);
  const [formData, setFormData] = useState(null);
  const [loadingAttributes, setLoadingAttributes] =
    useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAttributes = async () => {
      try {
        setLoadingAttributes(true);
        setError(null);

        const response = await getAttributes({
          page: 1,
          limit: 50,
          includeOptions: true,
        });

        const attributeList = Array.isArray(response)
          ? response
          : response?.items || response?.data || [];

        setAttributes(attributeList);

        setFormData(
          normalizeProduct(product, attributeList)
        );
      } catch (err) {
        setError(
          err.message ||
            "Failed to load product attributes."
        );
      } finally {
        setLoadingAttributes(false);
      }
    };

    if (product) {
      loadAttributes();
    }
  }, [product]);

  const handleAttributeChange = (
    code,
    value
  ) => {
    setFormData((previous) => ({
      ...previous,
      attributes: {
        ...previous.attributes,
        [code]: value,
      },
    }));
  };

  const handleBasicFieldChange = (
    event
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData) {
      return;
    }

    const payload = buildProductPayload(
      formData,
      attributes
    );

    await onSave(payload);
  };

  if (loadingAttributes) {
    return <div>Loading product attributes...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Failed to load product attributes.</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!formData) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <section>
        <h2>Product Information</h2>

        <div>
          <label htmlFor="sku">
            SKU *
          </label>

          <input
            id="sku"
            name="sku"
            type="text"
            value={formData.sku}
            onChange={handleBasicFieldChange}
            required
          />
        </div>

        <div>
          <label htmlFor="family">
            Family
          </label>

          <input
            id="family"
            name="family"
            type="text"
            value={formData.family}
            onChange={handleBasicFieldChange}
          />
        </div>

        <div>
          <label htmlFor="type">
            Type
          </label>

          <input
            id="type"
            name="type"
            type="text"
            value={formData.type}
            onChange={handleBasicFieldChange}
          />
        </div>

        <div>
          <label htmlFor="status">
            Status
          </label>

          <input
            id="status"
            name="status"
            type="checkbox"
            checked={Boolean(formData.status)}
            onChange={handleBasicFieldChange}
          />
        </div>
      </section>

      <section>
        <h2>Attributes</h2>

        {attributes.map((attribute) => (
          <AttributeRenderer
            key={attribute.code}
            attribute={attribute}
            value={
              formData.attributes[
                attribute.code
              ]
            }
            onChange={
              handleAttributeChange
            }
          />
        ))}
      </section>

      <button
        type="submit"
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
};

export default ProductForm;