import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import withAuth from "@/components/protected/withAuth";
import ChatList from "@/components/chat/ChatList";
import ChatDetails from "@/components/chat/ChatDetails";
import { plusSvg } from "@/assets";
import NewChat from "@/components/chat/NewChat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

const Dashboard = () => {
  const router = useRouter();
  const [userDetail, setUserDetail] = useState<{
    name: string;
    email: string;
    avatar: string;
    id: string;
  }>({ avatar: "", email: "", name: "", id: "" });

  const [openNewChat, setOpenNewChat] = useState(false);

  useEffect(() => {
    const userDetailsString = localStorage.getItem("userDetails");
    if (userDetailsString) {
      const userDetails: {
        name: string;
        email: string;
        avatar: string;
        id: string;
      } = JSON.parse(userDetailsString);
      if (userDetails.name && userDetails.email && userDetails.id && userDetails.avatar) setUserDetail(userDetails);
    }
  }, []);

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

      {openNewChat && <NewChat open={openNewChat} closeChatModal={() => setOpenNewChat(false)} />}

      {/* <div className="flex gap-3 p-2 overflow-hidden h-full">
        <div className="w-80 min-w-min left-part flex flex-col gap-3 overflow-hidden bg-gray-500 p-2 rounded-md relative">
          <ChatList />
        </div>
        <div className="shrink right-part p-2 border border-gray-500 rounded-md w-full flex flex-col">
          <ChatDetails />
        </div>
      </div> */}
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(sizes)}`;
        }}
        className="h-full items-stretch"
      >
        <ResizablePanel defaultSize={defaultLayout[0]} minSize={30}>
          <ChatList />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={40}>
          <ChatDetails />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default withAuth(Dashboard);
