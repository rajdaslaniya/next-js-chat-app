import { useFormik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import InputField from "../common/InputField";
import CheckboxGroup from "../common/CheckboxGroup";

interface INewChat {
  closeChatModal: () => void;
}

const NewChat: React.FC<INewChat> = ({ closeChatModal }) => {
  const [users, setUsers] = useState<{ _id: string; name: string }[]>([
    {
      _id: "7483274823",
      name: "Raj Daslaniya",
    },
    {
      _id: "7483274",
      name: "Jeet Desai",
    },
  ]);
  const formik = useFormik<{
    chat_name: string;
    users: string[];
  }>({
    initialValues: { chat_name: "", users: [] },
    validationSchema: Yup.object({
      chat_name: Yup.string()
        .required("Name is required")
        .min(3, "Minimum 3 characters are allowed")
        .max(50, "Maximum 50 characters are allowed")
        .matches(
          /^\S+(\s\S+)?$/,
          "Name must contain a space in between and no spaces at the start or end"
        )
        .trim(),
      users: Yup.array()
        .min(1, "You must select at least one users")
        .required("This field is required"),
    }),
    onSubmit: (values) => {},
  });

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 space-y-4">
        <form onSubmit={formik.handleSubmit}>
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-xl font-semibold text-gray-800">
              Select user for chat
            </h3>
            <button
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close"
              onClick={closeChatModal}
            >
              ✕
            </button>
          </div>
          <InputField
            id="chat_name"
            label="Chat name"
            type="text"
            formik={formik}
            labelClassName="text-black"
          />

          <CheckboxGroup
            name="users"
            label="Select users"
            options={users}
            formik={formik}
          />

          <div className="flex justify-end space-x-4 border-t pt-2">
            <button
              onClick={closeChatModal}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-white-700"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewChat;
