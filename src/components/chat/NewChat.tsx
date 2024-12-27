import { useFormik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import Image from "next/image";
import { searchSvg } from "@/assets";

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
      users: Yup.array()
        .min(1, "You must select at least one users")
        .required("This field is required"),
    }),
    onSubmit: (values) => {},
  });

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-black rounded-lg shadow-lg w-full max-w-lg p-6 space-y-4">
        <form onSubmit={formik.handleSubmit}>
          <div className="flex justify-between items-center border-b pb-2">
            <div className="">
              <h3 className="text-xl font-semibold text-white">New Chat</h3>
              <p className="text-sm text-white">
                Invite user to this thread. This will create a new group
                message.
              </p>
            </div>
            <button
              className="text-white"
              aria-label="Close"
              onClick={closeChatModal}
            >
              ✕
            </button>
          </div>
          <div className="relative mt-2 mb-2">
            <Image
              src={searchSvg}
              height={20}
              width={20}
              alt="search"
              className="absolute top-0 bottom-0"
              style={{ left: 10, margin: "auto 0px" }}
            />
            <input
              placeholder="Search here"
              // value={searchText}
              // onChange={(event) => setSearchText(event.target.value)}
              className="w-full p-2 border border-black rounded-md text-black pl-8"
            />
          </div>
          <div className="flex flex-col gap-3 mb-2">
            <div
              style={{ backgroundColor: "#6b6b6b" }}
              className="flex gap-2 p-2 rounded-md cursor-pointer"
            >
              <div
                className="text-xl text-semibold text-white  rounded-full h-11 w-11 flex items-center justify-center"
                style={{ backgroundColor: "#aba3a3" }}
              >
                J
              </div>
              <div className="">
                <p className="text-md text-white">Raj</p>
                <p className="text-sm" style={{ color: "#d9d6d6" }}>
                  raj@yopmail.com
                </p>
              </div>
            </div>
            <div className="flex gap-2 p-2 rounded-md cursor-pointer">
              <div
                className="text-xl text-semibold text-white  rounded-full h-11 w-11 flex items-center justify-center"
                style={{ backgroundColor: "#6b6b6b" }}
              >
                J
              </div>
              <div className="">
                <p className="text-md text-white">Raj</p>
                <p className="text-sm" style={{ color: "#d9d6d6" }}>
                  jeet@yopmail.com
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 border-t pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-white text-black rounded-md hover:bg-white-700"
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
