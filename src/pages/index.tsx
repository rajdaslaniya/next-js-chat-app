import React from "react";
import { useRouter } from "next/router";
import { LogOut, Menu, Plus } from "lucide-react";
import { toast } from "sonner";

import withAuth from "@/components/protected/withAuth";
import ChatList from "@/components/chat/ChatList";
import ChatDetails from "@/components/chat/ChatDetails";
import NewChat from "@/components/chat/NewChat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import apiService from "@/utils/base-services";

const Dashboard = () => {
  const router = useRouter();
  const [userDetail, setUserDetail] = React.useState({ avatar: "", email: "", name: "", _id: "" });
  const [selectedChat, setSelectedChat] = React.useState<string>("");
  const [openNewChat, setOpenNewChat] = React.useState<boolean>(false);

  React.useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    try {
      const apiResponse = await apiService.get("/chat/user");
      if (apiResponse.status === 200) {
        setUserDetail(apiResponse.data.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch user details.");
    }
  };

  const handleLogout = React.useCallback(() => {
    localStorage.clear();
    router.push("/login");
  }, [router]);

  const toggleNewChatModal = React.useCallback(() => {
    setOpenNewChat((prev) => !prev);
  }, []);

  const userDetailMemo = React.useMemo(() => userDetail, [userDetail]);

  const defaultLayout = [150, 300];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex grow-0 shrink-0 basis-auto items-center justify-between p-3 border-b border-gray-500">
        <div className="relative">
          {userDetail.avatar && (
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={userDetail.avatar} alt="Image" />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{userDetailMemo.name}</p>
                <p className="text-sm text-muted-foreground">{userDetailMemo.email}</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="outline" className="ml-auto rounded-full" onClick={toggleNewChatModal}>
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">New message</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent sideOffset={10}>New message</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden ml-auto rounded-full">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Chat List</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <ChatList userDetail={userDetailMemo} openNewChat={openNewChat} selectedChat={selectedChat} setSelectedChatValue={setSelectedChat} />
            </SheetContent>
          </Sheet>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="outline" className="ml-auto rounded-full" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Logout</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent sideOffset={10}>Logout</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {openNewChat && <NewChat open={openNewChat} closeChatModal={toggleNewChatModal} />}

      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(sizes)}`;
        }}
        className="h-full w-full items-stretch"
      >
        <div className="hidden w-full sm:flex h-full">
          <ResizablePanel defaultSize={defaultLayout[0]} minSize={30}>
            <ChatList userDetail={userDetailMemo} openNewChat={openNewChat} selectedChat={selectedChat} setSelectedChatValue={setSelectedChat} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={defaultLayout[1]} minSize={40}>
            {selectedChat ? (
              <ChatDetails selectedChat={selectedChat} userDetail={userDetailMemo} />
            ) : (
              <div className="flex items-center justify-center h-full">Select chat</div>
            )}
          </ResizablePanel>
        </div>
        <div className="block w-full sm:hidden">
          {selectedChat ? (
            <ChatDetails selectedChat={selectedChat} userDetail={userDetailMemo} />
          ) : (
            <div className="flex items-center justify-center h-full p-4">Select chat</div>
          )}
        </div>
      </ResizablePanelGroup>
    </div>
  );
};

export default withAuth(Dashboard);
