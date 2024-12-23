/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface CheckboxGroupProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  formik: any;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  name,
  label,
  options,
  formik,
}) => {
  // Check if formik is properly passed and initialized
  if (!formik || !formik.values) {
    return null; // Return nothing if formik is not initialized
  }

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const updatedHobbies = checked
      ? [...formik.values[name], value]
      : formik.values[name].filter((hobby: string) => hobby !== value);

    formik.setFieldValue(name, updatedHobbies);
  };

  return (
    <div className="mb-2 mt-2">
      <label className={`text-md text-black`}>{label}</label>
      <div>
        {options.map((option) => (
          <div key={option.value} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={option.value}
              name={name}
              value={option.value}
              checked={formik.values[name]?.includes(option.value)}
              onChange={handleCheckboxChange}
              onBlur={formik.handleBlur}
              className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded"
            />
            <label
              htmlFor={option.value}
              className="ml-2 text-sm font-medium text-black"
            >
              {option.label}
            </label>
          </div>
        ))}
        {formik.touched[name] && formik.errors[name] && (
          <p className="text-red-500 text-sm">{formik.errors[name]}</p>
        )}
      </div>
    </div>
  );
};

export default CheckboxGroup;
