import React from "react";

interface Props {
  label: string;
  value: any;
  required?: boolean;
  onChange: (val: any) => void;
  type?: string;
  options?: string[];
  multiple?: boolean;
  validation?: string;
}

export const FormInput: React.FC<Props> = ({ 
  label, 
  value, 
  required, 
  onChange, 
  type = "text", 
  options,
  multiple = false,
  validation
}) => {
  // Email input
  if (type === "email") {
    return (
      <div className="mb-4">
        <label className="block font-medium mb-1">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
        <input
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="email"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter email address"
        />
      </div>
    );
  }

  // Select/Dropdown
  if (type === "select") {
    return (
      <div className="mb-4">
        <label className="block font-medium mb-1">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
        <select
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="" disabled>Select...</option>
          {options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // File upload (single or multiple)
  if (type === "file") {
    return (
      <div className="mb-4">
        <label className="block font-medium mb-1">
          {label} {required && <span className="text-red-600">*</span>}
          {multiple && <span className="text-sm text-gray-500 ml-2">(Multiple files allowed)</span>}
        </label>
        <input
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="file"
          multiple={multiple}
          onChange={(e) => {
            if (multiple) {
              // For multiple files, pass the FileList as an array
              onChange(e.target.files ? Array.from(e.target.files) : []);
            } else {
              // For single file, pass the first file
              onChange(e.target.files?.[0]);
            }
          }}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />
        {value && (
          <div className="mt-2 text-sm text-gray-600">
            {multiple && Array.isArray(value) ? (
              <div>
                <p className="font-medium">{value.length} file(s) selected:</p>
                <ul className="list-disc list-inside ml-2">
                  {value.map((file: File, idx: number) => (
                    <li key={idx}>{file.name}</li>
                  ))}
                </ul>
              </div>
            ) : value?.name ? (
              <p>Selected: {value.name}</p>
            ) : null}
          </div>
        )}
      </div>
    );
  }

  // Checkbox
  if (type === "checkbox") {
    return (
      <div className="mb-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="font-medium">
            {label} {required && <span className="text-red-600">*</span>}
          </span>
        </label>
      </div>
    );
  }

  // Textarea
  if (type === "textarea") {
    return (
      <div className="mb-4">
        <label className="block font-medium mb-1">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
        <textarea
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          placeholder="Enter additional details..."
        />
      </div>
    );
  }

  // Text input (with validation for numbers only)
  return (
    <div className="mb-4">
      <label className="block font-medium mb-1">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input
        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        value={value || ""}
        onChange={(e) => {
          const newValue = e.target.value;
          
          // Apply validation if specified
          if (validation === "numbers") {
            // Only allow numbers
            if (/^\d*$/.test(newValue)) {
              onChange(newValue);
            }
          } else {
            onChange(newValue);
          }
        }}
        placeholder={validation === "numbers" ? "Enter numbers only" : `Enter ${label.toLowerCase()}`}
      />
      {validation === "numbers" && (
        <p className="text-xs text-gray-500 mt-1">Numbers only</p>
      )}
    </div>
  );
};