import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import withAuth from "@/components/protected/withAuth";
import ChatList from "@/components/chat/ChatList";
import ChatDetails from "@/components/chat/ChatDetails";
import NewChat from "@/components/chat/NewChat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import apiService from "@/utils/base-services";
import { toast } from "sonner";

const Dashboard = () => {
  const router = useRouter();
  const [userDetail, setUserDetail] = useState<{
    name: string;
    email: string;
    avatar: string;
    _id: string;
  }>({ avatar: "", email: "", name: "", _id: "" });
  const [selectedChat, setSelectedChat] = useState("");
  const [openNewChat, setOpenNewChat] = useState(false);

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    try {
      const apiResponse = await apiService.get("/chat/user");
      if (apiResponse.status === 200) {
        setUserDetail(apiResponse.data.data);
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const setSelectedChatValue = (id: string) => {
    setSelectedChat(id);
  };

  const changeCloseChatModalValue = () => {
    setOpenNewChat(false);
  };

  const redirectToLogin = () => {
    router.push("/login");
    localStorage.clear();
  };

  const defaultLayout = [150, 300];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex grow-0 shrink-0 basis-auto items-center justify-between p-3 border-b border-gray-500">
        <div className="relative">
          {userDetail.avatar && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={userDetail.avatar} alt="Image" />
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">{userDetail.name}</p>
                    <p className="text-sm text-muted-foreground">{userDetail.email}</p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => redirectToLogin()}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="outline" className="ml-auto rounded-full" onClick={() => setOpenNewChat(true)}>
                <Plus className="h-4 w-4" />
                <span className="sr-only">New message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={10}>New message</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {openNewChat && <NewChat open={openNewChat} closeChatModal={changeCloseChatModalValue} />}

      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(sizes)}`;
        }}
        className="h-full items-stretch"
      >
        <ResizablePanel defaultSize={defaultLayout[0]} minSize={30}>
          <ChatList selectedChat={selectedChat} setSelectedChatValue={setSelectedChatValue} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={40}>
          {selectedChat ? (
            <ChatDetails selectedChat={selectedChat} userDetail={userDetail} />
          ) : (
            <div className="flex items-center justify-center h-full">Select chat</div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default withAuth(Dashboard);
