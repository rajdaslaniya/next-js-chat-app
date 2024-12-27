/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  formik: any;
  className?: string;
  labelClassName?: string;
  autoFocus?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type,
  formik,
  className = "",
  labelClassName = "",
  autoFocus = false,
}) => {
  return (
    <div className="mb-2 mt-2">
      <label htmlFor={id} className={`text-md ${labelClassName}`}>
        {label}
      </label>
      <input
        type={type}
        autoFocus={autoFocus}
        id={id}
        {...formik.getFieldProps(id)}
        className={`w-full p-2 border border-black rounded-md text-black ${className}`}
      />
      {formik.touched[id] && formik.errors[id] ? (
        <p className="text-red-500 text-sm">{formik.errors[id]}</p>
      ) : null}
    </div>
  );
};

export default InputField;
