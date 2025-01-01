import React, { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { closeSvg, hamburgerSvg, searchSvg } from "@/assets";
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
  const [open, setOpen] = useState(false);

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
      const handleTabClose = () => {
        socket?.emit("userOffline", userDetail._id);
      };
      window.addEventListener("beforeunload", handleTabClose);
      return () => {
        socket?.emit("userOffline", userDetail._id);
        window.removeEventListener("beforeunload", handleTabClose);
      };
    }
  }, [userDetail, socket]);

  const handleSelectChat = useCallback(
    (chatId: string) => {
      setSelectedChatValue(chatId);
      setOpen(false);
    },
    [setSelectedChatValue]
  );

  const toggleDrawer = (open: boolean) => {
    setOpen(open);
  };

  return (
    <>
      <div className="w-80 min-w-min flex flex-col gap-3 overflow-hidden border border-black p-2 rounded-md md:flex sm:hidden">
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
            const chatPhoto = chat.is_group
              ? chat.photo
              : chat.users[0]?.avatar;

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
      </div>
      <button
        onClick={() => toggleDrawer(true)}
        className=" p-2 max-h-max border rounded-full shadow-lg border-black fixed top-24 left-5 z-50 bg-white md:hidden sm:block"
      >
        <Image src={hamburgerSvg} alt="hamburger" height={25} width={25} />
      </button>
      <div
        className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-50 transition-all duration-300 ${
          open ? "block" : "hidden"
        }`}
        onClick={() => toggleDrawer(false)}
      >
        <div
          className={`fixed left-0 top-0 p-2 w-80 min-w-min bg-white h-full shadow-lg transition-transform transform flex flex-col gap-3 overflow-hidden ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-end">
            <button
              onClick={() => toggleDrawer(false)}
              className=" p-2 max-h-max border rounded-full shadow-lg border-black max-h-max max-w-max bg-white md:hidden sm:block"
            >
              <Image src={closeSvg} alt="hamburger" height={25} width={25} />
            </button>
          </div>
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
              const chatPhoto = chat.is_group
                ? chat.photo
                : chat.users[0]?.avatar;

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
                        {chat.is_group &&
                          `${chat.latest_message.sender.name}: `}
                        {chat.latest_message.message}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatList;
