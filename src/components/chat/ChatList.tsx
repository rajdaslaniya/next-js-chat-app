import React, { useEffect, useState } from "react";
import Image from "next/image";
import { searchSvg } from "@/assets";
import apiService from "@/utils/base-services";
import { toast } from "react-toastify";

interface User {
  avatar: string;
  email: string;
  name: string;
  _id: string;
}

interface LatestMessage {
  chat_id: string;
  message: string;
  createdAt: string;
  sender: {
    email: string;
    name: string;
    avatar: string;
  };
}

interface Chat {
  _id: string;
  users: User[];
  photo: string;
  chat_name: string;
  is_group: boolean;
  group_admin: string;
  latest_message?: LatestMessage;
}

interface IChatList {
  setSelectedChatValue: (id: string) => void;
  openNewChat: boolean;
  selectedChat: string;
}

const ChatList: React.FC<IChatList> = ({
  setSelectedChatValue,
  openNewChat,
  selectedChat,
}) => {
  const [searchText, setSearchText] = useState("");
  const [chatList, setChatList] = useState<Chat[]>([]);
  const [filteredChatList, setFilteredChatList] = useState<Chat[]>([]);

  // Fetch chat list when the component mounts or when `openNewChat` changes
  useEffect(() => {
    fetchChatList();
  }, [openNewChat]);

  const fetchChatList = async () => {
    try {
      const apiResponse = await apiService.get("/chat/chats");
      if (apiResponse.status === 200) {
        const chats = apiResponse.data.data;
        setChatList(chats);
        setFilteredChatList(chats); // Initialize filtered chat list
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to fetch chat list."
      );
    }
  };

  // Update the filtered chat list when `searchText` changes
  useEffect(() => {
    const filtered = chatList.filter((chat) => {
      const chatName = chat.is_group ? chat.chat_name : chat.users[0]?.email;
      const latestMessage = chat.latest_message?.message || "";
      return (
        chatName.toLowerCase().includes(searchText.toLowerCase()) ||
        latestMessage.toLowerCase().includes(searchText.toLowerCase())
      );
    });
    setFilteredChatList(filtered);
  }, [searchText, chatList]);

  return (
    <>
      {/* Search Input */}
      <div className="relative">
        <Image
          src={searchSvg}
          height={20}
          width={20}
          alt="search"
          className="absolute top-0 bottom-0"
          style={{ left: 10, margin: "auto 0" }}
        />
        <input
          type="text"
          placeholder="Search here"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full p-2 border border-black rounded-md text-black pl-8"
        />
      </div>

      {/* Chat List */}
      <div className="w-full flex flex-col gap-3 overflow-y-auto overflow-x-hidden">
        {filteredChatList.map((chat) => {
          const chatName = chat.is_group
            ? chat.chat_name
            : chat.users[0]?.email;
          const chatPhoto = chat.is_group ? chat.photo : chat.users[0]?.avatar;

          return (
            <div
              key={chat._id}
              className={`flex w-full border border-black p-2 gap-2 items-center rounded-md cursor-pointer chat-list ${
                selectedChat === chat._id ? "chat-list-active" : ""
              }`}
              onClick={() => setSelectedChatValue(chat._id)}
            >
              <Image
                alt="user-image"
                width={30}
                height={30}
                className="rounded-full"
                src={chatPhoto}
              />
              <div className="w-full overflow-hidden">
                {/* Chat Name */}
                <p
                  title={chatName}
                  className="text-black text-md whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  {chatName}
                </p>
                {/* Latest Message */}
                {chat.latest_message && (
                  <p
                    title={chat.latest_message.message}
                    className="text-black text-sm whitespace-nowrap overflow-hidden text-ellipsis"
                  >
                    {chat.is_group && `${chat.latest_message.sender.name}: `}
                    {chat.latest_message.message}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ChatList;
