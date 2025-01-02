import React from "react";
import { Separator } from "../ui/separator";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import apiService from "@/utils/base-services";
import { toast } from "sonner";
import { Chat, IUser } from "@/types/chat";
import { useSocket } from "@/context/socket";

interface IChatList {
  setSelectedChatValue: (id: string) => void;
  openNewChat: boolean;
  selectedChat: string;
  userDetail: IUser;
}

const ChatList: React.FC<IChatList> = ({ userDetail, setSelectedChatValue, openNewChat, selectedChat }) => {
  const socket = useSocket();

  const [searchText, setSearchText] = React.useState("");
  const [chatList, setChatList] = React.useState<Chat[]>([]);
  const [filteredChatList, setFilteredChatList] = React.useState<Chat[]>([]);

  React.useEffect(() => {
    fetchChatList();
  }, [openNewChat]);

  const fetchChatList = async () => {
    try {
      const apiResponse = await apiService.get("/chat/chats");
      if (apiResponse.status === 200) {
        const chats = apiResponse.data.data;
        setChatList(chats);
        setFilteredChatList(chats);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch chat list.");
    }
  };

  React.useEffect(() => {
    const filtered = chatList.filter((chat) => {
      const chatName = chat.is_group ? chat.chat_name : chat.users[0]?.name;
      const latestMessage = chat.latest_message?.message || "";
      return chatName.toLowerCase().includes(searchText.toLowerCase()) || latestMessage.toLowerCase().includes(searchText.toLowerCase());
    });
    setFilteredChatList(filtered);
  }, [searchText, chatList]);

  React.useEffect(() => {
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

  return (
    <>
      <div className="flex items-center px-4 py-4">
        <h1 className="text-xl font-bold">Chat</h1>
      </div>
      <Separator />
      <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Search" className="pl-8" />
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="flex flex-col gap-2 p-4 pt-0">
          {filteredChatList.map((chat) => {
            const chatName = chat.is_group ? chat.chat_name : chat.users[0]?.name;
            return (
              <button
                key={chat._id}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                  selectedChat === chat._id && "bg-muted"
                )}
                onClick={() => setSelectedChatValue(chat._id)}
              >
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold" title={chatName}>
                        {chatName}
                      </div>
                      {/* {!item.read && <span className="flex h-2 w-2 rounded-full bg-blue-600" />} */}
                    </div>
                    <div className={cn("ml-auto text-xs", selectedChat === chat._id ? "text-foreground" : "text-muted-foreground")}>
                      about 1 year ago
                    </div>
                  </div>
                </div>
                {chat.latest_message && (
                  <div title={chat.latest_message.message} className="line-clamp-2 text-xs text-muted-foreground">
                    {chat.latest_message.message}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </>
  );
};

export default ChatList;
