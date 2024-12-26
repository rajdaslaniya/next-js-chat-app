import React, { useState } from "react";
import { Separator } from "../ui/separator";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";

const ChatList = () => {
  const [searchText, setSearchText] = useState("");
  const [items, setItems] = useState([
    {
      id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
      name: "William Smith",
      email: "williamsmith@example.com",
      text: "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we align on our next steps to ensure the project's success.\n\nPlease come prepared with any questions or insights you may have. Looking forward to our meeting!\n\nBest regards, William",
      date: "2023-10-22T09:00:00",
      read: true,
    },
    {
      id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
      name: "William Smith",
      email: "williamsmith@example.com",
      text: "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we align on our next steps to ensure the project's success.\n\nPlease come prepared with any questions or insights you may have. Looking forward to our meeting!\n\nBest regards, William",
      date: "2023-10-22T09:00:00",
      read: false,
    },
    {
      id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
      name: "William Smith",
      text: "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we align on our next steps to ensure the project's success.\n\nPlease come prepared with any questions or insights you may have. Looking forward to our meeting!\n\nBest regards, William",
      date: "2023-10-22T09:00:00",
      read: false,
    },
    {
      id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
      name: "William Smith",
      text: "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we align on our next steps to ensure the project's success.\n\nPlease come prepared with any questions or insights you may have. Looking forward to our meeting!\n\nBest regards, William",
      date: "2023-10-22T09:00:00",
      read: false,
    },
    {
      id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
      name: "William Smith",
      text: "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we align on our next steps to ensure the project's success.\n\nPlease come prepared with any questions or insights you may have. Looking forward to our meeting!\n\nBest regards, William",
      date: "2023-10-22T09:00:00",
      read: false,
    },
    {
      id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
      name: "William Smith",
      text: "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we align on our next steps to ensure the project's success.\n\nPlease come prepared with any questions or insights you may have. Looking forward to our meeting!\n\nBest regards, William",
      date: "2023-10-22T09:00:00",
      read: false,
    },
    {
      id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
      name: "William Smith",
      text: "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we align on our next steps to ensure the project's success.\n\nPlease come prepared with any questions or insights you may have. Looking forward to our meeting!\n\nBest regards, William",
      date: "2023-10-22T09:00:00",
      read: false,
    },
    {
      id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
      name: "William Smith",
      text: "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we align on our next steps to ensure the project's success.\n\nPlease come prepared with any questions or insights you may have. Looking forward to our meeting!\n\nBest regards, William",
      date: "2023-10-22T09:00:00",
      read: false,
    },
    {
      id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
      name: "William Smith",
      text: "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we align on our next steps to ensure the project's success.\n\nPlease come prepared with any questions or insights you may have. Looking forward to our meeting!\n\nBest regards, William",
      date: "2023-10-22T09:00:00",
      read: false,
    },
    {
      id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
      name: "William Smith",
      text: "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we align on our next steps to ensure the project's success.\n\nPlease come prepared with any questions or insights you may have. Looking forward to our meeting!\n\nBest regards, William",
      date: "2023-10-22T09:00:00",
      read: false,
    },
  ]);

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
          {items.map((item) => (
            <button
              key={item.id}
              className={cn(
                "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent"
                // mail.selected === item.id && "bg-muted"
              )}
            >
              <div className="flex w-full flex-col gap-1">
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{item.name}</div>
                    {!item.read && <span className="flex h-2 w-2 rounded-full bg-blue-600" />}
                  </div>
                  <div
                    className={cn(
                      "ml-auto text-xs"
                      // mail.selected === item.id ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    about 1 year ago
                  </div>
                </div>
              </div>
              <div className="line-clamp-2 text-xs text-muted-foreground">{item.text.substring(0, 300)}</div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </>
  );
};

export default ChatList;
