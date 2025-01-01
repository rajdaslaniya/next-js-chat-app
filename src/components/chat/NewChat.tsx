import { useFormik } from "formik";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import * as Yup from "yup";
import Image from "next/image";
import { searchSvg } from "@/assets";
import apiService from "@/utils/base-services";
import { toast } from "react-toastify";

interface INewChat {
  closeChatModal: () => void;
}

const NewChat: React.FC<INewChat> = ({ closeChatModal }) => {
  const [users, setUsers] = useState<
    { _id: string; name: string; email: string }[]
  >([]);

  const getUsers = useCallback(async () => {
    try {
      const apiResponse = await apiService.get(`/chat/users`);
      setUsers(apiResponse.data.data);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const createChat = useCallback(
    async (values: { users: string }) => {
      try {
        const apiResponse = await apiService.post(`/chat`, {
          users: [values.users],
        });
        if (apiResponse.status === 200) {
          toast.success(apiResponse.data.message);
          closeChatModal();
        }
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    },
    [closeChatModal]
  );

  const formik = useFormik<{ users: string }>({
    initialValues: { users: "" },
    validationSchema: Yup.object({
      users: Yup.string().required("This field is required"),
    }),
    onSubmit: (values) => {
      createChat(values);
    },
  });

  const memoizedUsers = useMemo(() => users, [users]);

  const handleUserClick = useCallback(
    (userId: string) => {
      formik.setFieldValue("users", userId);
    },
    [formik]
  );

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 overflow-hidden p-3">
      <div className="bg-black rounded-lg shadow-lg w-full max-w-lg p-6 space-y-4 overflow-auto max-h-full">
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
              className="w-full p-2 border border-black rounded-md text-black pl-8"
            />
          </div>

          <div className="flex flex-col gap-3 mb-2">
            {memoizedUsers.map((data) => (
              <div
                key={data._id}
                className="flex gap-2 p-2 rounded-md cursor-pointer"
                onClick={() => handleUserClick(data._id)}
                style={{
                  backgroundColor:
                    formik.values.users === data._id
                      ? "#6b6b6b"
                      : "transparent",
                }}
              >
                <div
                  className="text-xl text-semibold text-white rounded-full h-11 w-11 flex items-center justify-center"
                  style={{
                    backgroundColor:
                      formik.values.users === data._id ? "#aba3a3" : "#6b6b6b",
                  }}
                >
                  {data.name.charAt(0).toUpperCase()}
                </div>
                <div className="">
                  <p className="text-md text-white">{data.name}</p>
                  <p className="text-sm" style={{ color: "#d9d6d6" }}>
                    {data.email}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4 border-t pt-2">
            <button
              type="submit"
              disabled={!formik.isValid}
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
