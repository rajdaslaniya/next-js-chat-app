import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { deleteSvg, messageSvg } from "@/assets";
import apiService from "@/utils/base-services";
import { toast } from "react-toastify";
import moment from "moment";
import { useSocket } from "@/context/socket";

interface IMessage {
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
}

interface IGroupDetails {
  chat_name: string;
  group_admin: string;
  is_group: boolean;
  photo: string;
  users: { avatar: string; email: string; name: string }[];
}

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
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [groupDetails, setGroupDetails] = useState<IGroupDetails>({
    chat_name: "",
    group_admin: "",
    is_group: true,
    photo: "",
    users: [],
  });

  const socket = useSocket();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
      fetchChatDetails();
    }
  }, [selectedChat]);

  useEffect(() => {
    if (socket && selectedChat) {
      socket.emit("joinChatRoom", selectedChat);
    }
    return () => {
      socket?.emit("leaveChatRoom", selectedChat);
    };
  }, [selectedChat, socket]);

  useEffect(() => {
    const handleNewMessage = (data: { data: IMessage }) => {
      setMessages((prevMessages) => [...prevMessages, data.data]);
    };
    socket?.on("receiveNewMessage", handleNewMessage);

    return () => {
      socket?.off("receiveNewMessage", handleNewMessage);
    };
  }, [socket]);

  const fetchMessages = async () => {
    try {
      const { status, data } = await apiService.get(`/message/${selectedChat}`);
      if (status === 200) {
        setMessages(data.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch messages.");
    }
  };

  const fetchChatDetails = async () => {
    try {
      const { status, data } = await apiService.get(`/chat/${selectedChat}`);
      if (status === 200) {
        setGroupDetails(data.data);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to fetch chat details."
      );
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      return toast.error("Please write a message.");
    }
    try {
      const { status } = await apiService.post(`/message/${selectedChat}`, {
        message: message.trim(),
      });
      if (status === 200) {
        toast.success("Message sent successfully.");
        setMessage("");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send message.");
    }
  };

  const scrollToBottom = () => {
    scrollContainerRef.current?.scrollTo({
      top: scrollContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <div className="flex justify-between items-center mb-2 gap-2">
        <div className="flex items-center gap-2">
          {groupDetails.is_group || groupDetails.users[0]?.avatar ? (
            <Image
              className="rounded-full"
              height={40}
              width={40}
              alt="user-image"
              src={
                groupDetails.is_group
                  ? groupDetails.photo
                  : groupDetails.users[0].avatar
              }
            />
          ) : null}
          <p className="text-md text-black">
            {groupDetails.is_group
              ? groupDetails.chat_name
              : groupDetails.users[0]?.name}
          </p>
        </div>
        <button className="border border-black p-2 rounded-full">
          <Image height={20} width={20} src={deleteSvg} alt="delete" />
        </button>
      </div>
      <hr className="bg-black mb-2" />
      <div className="flex-grow overflow-auto relative">
        <div
          ref={scrollContainerRef}
          className="absolute left-0 right-0 bottom-0 flex flex-col gap-3 max-h-full overflow-y-auto"
        >
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
                  alt="user-avatar"
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
                    className="text-xs"
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
      <div className="flex items-center gap-2 mt-2">
        <input
          type="text"
          placeholder="Write a message"
          value={message}
          className="w-full p-2 border border-black rounded-md text-black"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="bg-black text-white rounded-md p-3 border-black"
          onClick={handleSendMessage}
        >
          <Image alt="send" height={20} width={20} src={messageSvg} />
        </button>
      </div>
    </>
  );
};

export default ChatDetails;
