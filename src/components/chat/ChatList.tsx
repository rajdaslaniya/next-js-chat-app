import React from "react";
import { Separator } from "../ui/separator";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import apiService from "@/utils/base-services";
import { toast } from "sonner";

interface IChatList {
  setSelectedChatValue: (id: string) => void;
  selectedChat: string;
}

const ChatList: React.FC<IChatList> = ({ setSelectedChatValue, selectedChat }) => {
  const [searchText, setSearchText] = React.useState("");
  const [chatList, setChatList] = React.useState<
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

  React.useEffect(() => {
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
          {chatList.map((data) => (
            <button
              key={data._id}
              className={cn(
                "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                selectedChat === data._id && "bg-muted"
              )}
              onClick={() => setSelectedChatValue(data._id)}
            >
              <div className="flex w-full flex-col gap-1">
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{data.is_group ? data.chat_name : data.users[0].name}</div>
                    {/* {!item.read && <span className="flex h-2 w-2 rounded-full bg-blue-600" />} */}
                  </div>
                  <div className={cn("ml-auto text-xs", selectedChat === data._id ? "text-foreground" : "text-muted-foreground")}>
                    about 1 year ago
                  </div>
                </div>
              </div>
              {data.latest_message && <div className="line-clamp-2 text-xs text-muted-foreground">{data.latest_message.message}</div>}
            </button>
          ))}
        </div>
      </ScrollArea>
    </>
  );
};

export default ChatList;
