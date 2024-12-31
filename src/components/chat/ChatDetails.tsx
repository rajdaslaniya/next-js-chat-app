import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import apiService from "@/utils/base-services";
import { toast } from "sonner";
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
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState<
    {
      _id: string;
      message: string;
      createdAt: string;
      updatedAt: string;
      sender: { _id: string; name: string; email: string; avatar: string };
    }[]
  >([]);
  const [groupDetails, setGroupDetails] = React.useState<{
    chat_name: string;
    group_admin: string;
    is_group: boolean;
    photo: string;
    users: { avatar: string; email: string; name: string }[];
  }>({ chat_name: "", group_admin: "", is_group: true, photo: "", users: [] });

  React.useEffect(() => {
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
      <TooltipProvider delayDuration={0}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-md font-bold"> {groupDetails.is_group ? groupDetails.chat_name : groupDetails.users[0].name}</p>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Move to trash</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Move to trash</TooltipContent>
              </Tooltip>
            </div>
          </div>
          <Separator />
          <ScrollArea>
            <div className="space-y-4 p-4 overflow-y-auto">
              {messages.map((message, index) => {
                const isCurrentUser = message.sender._id === userDetail._id;
                return (
                  <div key={index} className={cn("flex w-max max-w-[75%] flex-col gap-1", isCurrentUser ? "ml-auto" : "")}>
                    <div
                      className={cn(
                        "flex gap-2 items-center px-3 py-2 text-sm rounded-lg",
                        isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}
                    >
                      {message.message}
                    </div>
                    <p className="text-xs text-right">
                      {moment(message.createdAt).isSame(new Date(), "day")
                        ? moment(message.createdAt).fromNow()
                        : moment(message.createdAt).format("MMM DD, YYYY")}
                    </p>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          {true ? (
            <div className="flex flex-1 flex-col">
              <Separator className="mt-auto" />
              <div className="p-4 mr-10">
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    sendMessage();
                  }}
                >
                  <Input value={message} onChange={(event) => setMessage(event.target.value)} className="p-4" placeholder={`Reply...`} />
                </form>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">No message selected</div>
          )}
        </div>
      </TooltipProvider>
    </>
  );
};

export default ChatDetails;
