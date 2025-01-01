import React, { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { searchSvg } from "@/assets";
import apiService from "@/utils/base-services";
import { toast } from "react-toastify";
import { useSocket } from "@/context/socket";
import { IChat, IChatList } from "@/utils/interface";

const ChatList: React.FC<IChatList> = ({
  setSelectedChatValue,
  openNewChat,
  selectedChat,
  userDetail,
}) => {
  const socket = useSocket();

  const [searchText, setSearchText] = useState("");
  const [chatList, setChatList] = useState<IChat[]>([]);

  const fetchChatList = useCallback(async () => {
    try {
      const apiResponse = await apiService.get("/chat/chats");
      if (apiResponse.status === 200) {
        const chats = apiResponse.data.data;
        setChatList(chats);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to fetch chat list."
      );
    }
  }, []);

  useEffect(() => {
    fetchChatList();
  }, [openNewChat, fetchChatList]);

  const filteredChatList = useMemo(() => {
    return chatList.filter((chat) => {
      const chatName = chat.is_group ? chat.chat_name : chat.users[0]?.email;
      const latestMessage = chat.latest_message?.message || "";
      return (
        chatName.toLowerCase().includes(searchText.toLowerCase()) ||
        latestMessage.toLowerCase().includes(searchText.toLowerCase())
      );
    });
  }, [searchText, chatList]);

  useEffect(() => {
    if (userDetail._id) {
      socket?.emit("userOnline", userDetail._id);

      socket.on("receivingLatestMessage", (data) => {
        const { latest_message, chat_id } = data;
        setChatList((prev) => {
          const updatedChatList = prev.map((chat) => {
            if (chat._id === chat_id) {
              return {
                ...chat,
                latest_message,
              };
            }
            return chat;
          });
          return updatedChatList;
        });
      });

      return () => {
        socket?.off("userOnline");
        socket?.emit("userOffline", userDetail._id);
      };
    }
  }, [userDetail, socket]);

  const handleSelectChat = useCallback(
    (chatId: string) => {
      setSelectedChatValue(chatId);
    },
    [setSelectedChatValue]
  );

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
              onClick={() => handleSelectChat(chat._id)}
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
