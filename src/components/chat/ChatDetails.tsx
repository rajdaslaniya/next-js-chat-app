import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import Image from "next/image";
import { deleteSvg, messageSvg } from "@/assets";
import apiService from "@/utils/base-services";
import { toast } from "react-toastify";
import { useSocket } from "@/context/socket";
import MessageItem from "./Message";
import { IChatDetails, IGroupDetails, IMessage } from "@/utils/interface";

const ChatDetails: React.FC<IChatDetails> = ({ selectedChat, userDetail }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [groupDetails, setGroupDetails] = useState<IGroupDetails>({
    chat_name: "",
    group_admin: "",
    is_group: true,
    photo: "",
    users: [],
  });

  const socket = useSocket();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
      fetchChatDetails();
    }
  }, [selectedChat]);

  useEffect(() => {
    if (socket && selectedChat) {
      socket.emit("joinChatRoom", selectedChat);
    }
    return () => {
      socket?.emit("leaveChatRoom", selectedChat);
    };
  }, [selectedChat, socket]);

  useEffect(() => {
    const handleNewMessage = (data: { data: IMessage }) => {
      setMessages((prevMessages) => [...prevMessages, data.data]);
    };
    socket?.on("receiveNewMessage", handleNewMessage);

    return () => {
      socket?.off("receiveNewMessage", handleNewMessage);
    };
  }, [socket]);

  const fetchMessages = useCallback(async () => {
    try {
      const { status, data } = await apiService.get(`/message/${selectedChat}`);
      if (status === 200) {
        setMessages(data.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch messages.");
    }
  }, [selectedChat]);

  const fetchChatDetails = useCallback(async () => {
    try {
      const { status, data } = await apiService.get(`/chat/${selectedChat}`);
      if (status === 200) {
        setGroupDetails(data.data);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to fetch chat details."
      );
    }
  }, [selectedChat]);

  const handleSendMessage = useCallback(async () => {
    if (!message.trim()) {
      return toast.error("Please write a message.");
    }
    try {
      const { status } = await apiService.post(`/message/${selectedChat}`, {
        message: message.trim(),
      });
      if (status === 200) {
        toast.success("Message sent successfully.");
        setMessage("");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send message.");
    }
  }, [message, selectedChat]);

  const scrollToBottom = useCallback(() => {
    scrollContainerRef.current?.scrollTo({
      top: scrollContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const renderedMessages = useMemo(
    () =>
      messages.map((data) => {
        const isCurrentUser = data.sender._id === userDetail._id;
        return (
          <MessageItem
            key={data._id}
            messageData={data}
            isCurrentUser={isCurrentUser}
          />
        );
      }),
    [messages, userDetail]
  );

  return (
    <>
      <div className="flex justify-between items-center mb-2 gap-2">
        <div className="flex items-center gap-2">
          {groupDetails.is_group || groupDetails.users[0]?.avatar ? (
            <Image
              className="rounded-full"
              height={40}
              width={40}
              alt="user-image"
              src={
                groupDetails.is_group
                  ? groupDetails.photo
                  : groupDetails.users[0].avatar
              }
            />
          ) : null}
          <p className="text-md text-black">
            {groupDetails.is_group
              ? groupDetails.chat_name
              : groupDetails.users[0]?.name}
          </p>
        </div>
        <button className="border border-black p-2 rounded-full">
          <Image height={20} width={20} src={deleteSvg} alt="delete" />
        </button>
      </div>
      <hr className="bg-black mb-2" />
      <div className="flex-grow overflow-auto relative">
        <div
          ref={scrollContainerRef}
          className="absolute left-0 right-0 bottom-0 flex flex-col gap-3 max-h-full overflow-y-auto"
        >
          {renderedMessages}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <input
          type="text"
          placeholder="Write a message"
          value={message}
          className="w-full p-2 border border-black rounded-md text-black"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="bg-black text-white rounded-md p-3 border-black"
          onClick={handleSendMessage}
        >
          <Image alt="send" height={20} width={20} src={messageSvg} />
        </button>
      </div>
    </>
  );
};

export default ChatDetails;
