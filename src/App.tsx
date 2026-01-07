import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store/store";
import { updateField } from "./store/formSlice";
import { formTabs } from "./formConfig";
import { FormInput } from "./components/FormInput";

const App: React.FC = () => {
  const [tab, setTab] = useState(1);
  const form = useSelector((s: RootState) => s.form);
  const dispatch = useDispatch<AppDispatch>();

  const current = formTabs.find((t) => t.id === tab)!;
  const isSummary = current.summary;

  // Handle input changes
  const handleChange = (key: string, value: any) => {
    dispatch(updateField({ key, value }));
  };

  // Check if a field should be visible based on conditions
  const isFieldVisible = (field: any) => {
    // Check primary condition
    if (field.conditionalKey && field.conditionalValue) {
      if (form[field.conditionalKey] !== field.conditionalValue) {
        return false;
      }
    }

    // Check secondary condition (for fields with multiple conditions)
    if (field.conditionalKey2 && field.conditionalValue2) {
      if (form[field.conditionalKey2] !== field.conditionalValue2) {
        return false;
      }
    }

    return true;
  };

  // Validation for current tab
  const validateTab = () => {
    if (isSummary) return true;

    return current.fields?.every((f) => {
      // Skip if not required
      if (!f.required) return true;

      // Skip if conditional field not visible
      if (!isFieldVisible(f)) return true;

      // Must have value
      const value = form[f.key];
      
      // For file inputs
      if (f.type === "file") {
        return !!value;
      }
      
      // For checkbox
      if (f.type === "checkbox") {
        return value === true;
      }
      
      // For text/email/textarea/select
      return !!value && value.toString().trim() !== "";
    });
  };

  // Navigate tabs
  const nextTab = () => setTab((t) => Math.min(t + 1, formTabs.length));
  const prevTab = () => setTab((t) => Math.max(t - 1, 1));

  // Format value for display in summary
  const formatValue = (field: any, value: any) => {
    if (!value) return "Not provided";
    
    if (field.type === "file") {
      if (field.multiple && Array.isArray(value)) {
        return value.length > 0 
          ? value.map((f: any) => f.name).join(", ") 
          : "No files uploaded";
      }
      return value.name || "File uploaded";
    }
    
    if (field.type === "checkbox") {
      return value ? "Yes" : "No";
    }
    
    return value;
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      {/* Tab indicators */}
      <div className="flex justify-between mb-8 border-b">
        {formTabs.map((t) => (
          <div
            key={t.id}
            className={`pb-2 px-4 cursor-pointer transition-colors ${
              t.id === tab
                ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => {
              // Allow navigation to previous tabs or current tab
              if (t.id <= tab) setTab(t.id);
            }}
          >
            {t.title}
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-6">{current.title}</h2>

      {/* Render fields for non-summary tabs */}
      {!isSummary && (
        <div className="space-y-4">
          {current.fields?.map((f) => {
            // Hide conditional fields if condition not met
            if (!isFieldVisible(f)) return null;

            return (
              <FormInput
                key={f.key}
                label={f.label}
                type={f.type}
                required={f.required}
                options={f.options}
                multiple={f.multiple as boolean | undefined}
                validation={f.validation}
                value={form[f.key]}
                onChange={(v) => handleChange(f.key, v)}
              />
            );
          })}
        </div>
      )}

      {/* Summary tab */}
      {isSummary && (
        <div className="space-y-6">
          <p className="text-gray-600 mb-4">
            Please review all information before submitting the form.
          </p>
          
          {formTabs
            .filter((t) => !t.summary)
            .map((t) => {
              // Get visible fields for this tab
              const visibleFields = t.fields?.filter((f) => isFieldVisible(f)) || [];
              
              if (visibleFields.length === 0) return null;

              return (
                <div key={t.id} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{t.title}</h3>
                    <button
                      className="text-sm text-blue-600 hover:text-blue-800"
                      onClick={() => setTab(t.id)}
                    >
                      Edit
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {visibleFields.map((f) => (
                      <div key={f.key} className="grid grid-cols-3 gap-4">
                        <div className="font-medium text-gray-700">{f.label}:</div>
                        <div className="col-span-2 text-gray-900">
                          {formatValue(f, form[f.key])}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <button
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={prevTab}
          disabled={tab === 1}
        >
          Previous
        </button>

        {!isSummary && (
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={nextTab}
            disabled={!validateTab()}
          >
            Next
          </button>
        )}

        {isSummary && (
          <button
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            onClick={() => {
              console.log("Form submitted:", form);
              alert("Form submitted successfully!\n\nCheck console for form data.");
            }}
          >
            Submit
          </button>
        )}
      </div>

      {/* Validation hint */}
      {!isSummary && !validateTab() && (
        <p className="text-sm text-red-600 mt-4 text-center">
          Please fill in all required fields to continue
        </p>
      )}
    </div>
  );
};

export default App;