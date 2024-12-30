import React, { useEffect, useState } from "react";
import Image from "next/image";
import { searchSvg } from "@/assets";
import apiService from "@/utils/base-services";
import { toast } from "react-toastify";

interface IChatList {
  setSelectedChatValue: (id: string) => void;
}
const ChatList: React.FC<IChatList> = ({ setSelectedChatValue }) => {
  const [searchText, setSearchText] = useState("");

  const [chatList, setChatList] = useState<
    {
      _id: string;
      users: { avatar: string; email: string; name: string; _id: string }[];
      photo: string;
      chat_name: string;
      is_group: boolean;
      group_admin: string;
      latest_message: {
        chat_id: string;
        message: string;
        createdAt: string;
        sender: {
          email: string;
          name: string;
          avatar: string;
        };
      };
    }[]
  >([]);

  useEffect(() => {
    getChatList();
  }, []);

  const getChatList = async () => {
    try {
      const apiResponse = await apiService.get("/chat/chats");
      if (apiResponse.status === 200) {
        setChatList(apiResponse.data.data);
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <div className="relative">
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
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          className="w-full p-2 border border-black rounded-md text-black pl-8"
        />
      </div>
      <div className="w-full flex flex-col gap-3 grow-1 shrink-1 basis-auto overflow-y-auto overflow-x-hidden">
        {chatList.map((data) => (
          <div
            className="flex w-full border border-black p-2 gap-2 items-center rounded-md cursor-pointer"
            key={data._id}
            onClick={() => setSelectedChatValue(data._id)}
          >
            <Image
              alt="user-image"
              width={30}
              height={30}
              className="rounded-full user-image"
              src={data.is_group ? data.photo : data.users[0].avatar}
            />
            <div className="user-details-container w-full overflow-hidden">
              <p className="chat-name text-black text-md whitespace-nowrap overflow-ellipsis overflow-hidden w-full overflow-ellipsis overflow-hidden">
                {data.is_group ? data.chat_name : data.users[0].name}
              </p>
              {data.latest_message && (
                <p className="last-message text-black text-sm whitespace-nowrap overflow-ellipsis overflow-hidden w-full overflow-ellipsis overflow-hidden">
                  {data.is_group && `${data.latest_message.sender.name}: `}
                  {data.latest_message.message}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ChatList;
