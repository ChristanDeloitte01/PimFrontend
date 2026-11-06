const AttributeRenderer = ({
  attribute,
  value,
  onChange,
}) => {
  const {
    code,
    label,
    type,
    required,
    options = [],
  } = attribute;

  const handleChange = (event) => {
    onChange(code, event.target.value);
  };

  if (type === "boolean") {
    return (
      <label>
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) =>
            onChange(code, event.target.checked)
          }
        />
        {label}
      </label>
    );
  }

  if (type === "select") {
    return (
      <div>
        <label htmlFor={code}>
          {label}
          {required && " *"}
        </label>

        <select
          id={code}
          value={value ?? ""}
          onChange={handleChange}
        >
          <option value="">Select {label}</option>

          {options.map((option) => (
            <option
              key={option.code}
              value={option.code}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (
    type === "textarea" ||
    type === "html"
  ) {
    return (
      <div>
        <label htmlFor={code}>
          {label}
          {required && " *"}
        </label>

        <textarea
          id={code}
          value={value ?? ""}
          onChange={handleChange}
          rows={5}
        />
      </div>
    );
  }

  if (
    type === "price" ||
    type === "number"
  ) {
    return (
      <div>
        <label htmlFor={code}>
          {label}
          {required && " *"}
        </label>

        <input
          id={code}
          type="number"
          step="any"
          value={value ?? ""}
          onChange={handleChange}
        />
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={code}>
        {label}
        {required && " *"}
      </label>

      <input
        id={code}
        type="text"
        value={value ?? ""}
        onChange={handleChange}
      />
    </div>
  );
};

export default AttributeRenderer;