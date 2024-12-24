/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface CheckboxGroupProps {
  name: string;
  label: string;
  options: { _id: string; name: string }[];
  formik: any;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  name,
  label,
  options,
  formik,
}) => {
  if (!formik || !formik.values) {
    return null;
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
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <div key={option._id} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={option._id}
              name={name}
              value={option._id}
              checked={formik.values[name]?.includes(option._id)}
              onChange={handleCheckboxChange}
              onBlur={formik.handleBlur}
              className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded"
            />
            <label
              htmlFor={option._id}
              className="ml-2 text-sm font-medium text-black"
            >
              {option.name}
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
