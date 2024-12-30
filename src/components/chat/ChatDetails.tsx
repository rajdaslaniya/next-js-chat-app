import React, { useEffect, useState } from "react";
import Image from "next/image";
import { deleteSvg, messageSvg } from "@/assets";
import apiService from "@/utils/base-services";
import { toast } from "react-toastify";
import moment from "moment";
interface IChatDetails {
  selectedChat: string;
  userDetail: {
    name: string;
    email: string;
    avatar: string;
    _id: string;
  };
}
const ChatDetails: React.FC<IChatDetails> = ({ selectedChat, userDetail }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    {
      _id: string;
      message: string;
      createdAt: string;
      updatedAt: string;
      sender: {
        _id: string;
        name: string;
        email: string;
        avatar: string;
      };
    }[]
  >([]);

  const [groupDetails, setGroupDetails] = useState<{
    chat_name: string;
    group_admin: string;
    is_group: boolean;
    photo: string;
    users: { avatar: string; email: string; name: string }[];
  }>({
    chat_name: "",
    group_admin: "",
    is_group: true,
    photo: "",
    users: [],
  });

  useEffect(() => {
    if (selectedChat) {
      getMessages();
      getChatDetails();
    }
  }, [selectedChat]);

  const getMessages = async () => {
    try {
      const apiResponse = await apiService.get(`/message/${selectedChat}`);
      if (apiResponse.status === 200) {
        setMessages(apiResponse.data.data);
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const getChatDetails = async () => {
    try {
      const apiResponse = await apiService.get(`/chat/${selectedChat}`);
      if (apiResponse.status === 200) {
        setGroupDetails(apiResponse.data.data);
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) {
      return toast.error("Please write message");
    }
    try {
      const apiResponse = await apiService.post(`/message/${selectedChat}`, {
        message: message.trim(),
      });
      if (apiResponse.status === 200) {
        toast.success("Message send successfully");
        setMessage("");
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <div className="flex gap-2 items-center mb-2 justify-between">
        <div className="flex gap-2 items-center">
          {groupDetails.is_group
            ? groupDetails.photo
            : groupDetails.users[0]?.avatar && (
                <Image
                  className="rounded-full max-h-fit"
                  height={40}
                  width={40}
                  alt="user-image"
                  src={
                    groupDetails.is_group
                      ? groupDetails.photo
                      : groupDetails.users[0].avatar
                  }
                />
              )}
          <p className="text-black text-md">
            {groupDetails.is_group
              ? groupDetails.chat_name
              : groupDetails.users[0].name}
          </p>
        </div>
        <button className="border border-black p-2 rounded-full">
          <Image height={20} width={20} src={deleteSvg} alt="delete" />
        </button>
      </div>
      <hr className="bg-black mb-2" />
      <div className="flex-grow shrink basis-auto relative">
        <div className="absolute left-0 right-0 bottom-0 flex flex-col gap-3 overflow-auto max-h-full">
          {messages.map((data) => {
            const isCurrentUser = data.sender._id === userDetail._id;
            return (
              <div
                className={`flex gap-3 ${
                  isCurrentUser ? "flex-row-reverse" : ""
                }`}
                key={data._id}
              >
                <Image
                  className="rounded-full max-h-fit"
                  height={25}
                  width={25}
                  alt="user-image"
                  src={data.sender.avatar}
                />
                <div
                  className={`p-2 rounded-md max-w-screen-sm text-sm ${
                    isCurrentUser
                      ? "bg-black text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  <p
                    className={`text-xs`}
                    style={{ color: isCurrentUser ? "#44ef5b" : "#ef4444" }}
                  >
                    {data.sender.name}
                  </p>
                  <p>{data.message}</p>
                  <p className="text-xs text-right">
                    {moment(data.createdAt).format("DD/MM/YYYY, h:mm A")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex gap-2 items-center  mt-2">
        <input
          placeholder="Write message"
          value={message}
          className="w-full p-2 border border-black rounded-md text-black"
          onChange={(event) => setMessage(event.target.value)}
        />
        <button
          className="bg-black rounded-md text-white p-3 border-black"
          onClick={() => sendMessage()}
        >
          <Image alt="send" height={20} width={20} src={messageSvg} />
        </button>
      </div>
    </>
  );
};

export default ChatDetails;
