import React from "react";
import Image from "next/image";
import moment from "moment";
import { IMessageProps } from "@/utils/interface";

const Message: React.FC<IMessageProps> = ({ messageData, isCurrentUser }) => {
  return (
    <div
      className={`flex gap-3 ${isCurrentUser ? "flex-row-reverse" : ""}`}
      key={messageData._id}
    >
      <Image
        className="rounded-full max-h-fit"
        height={25}
        width={25}
        alt="user-avatar"
        src={messageData.sender.avatar}
      />
      <div
        className={`p-2 rounded-md max-w-screen-sm text-sm ${
          isCurrentUser ? "bg-black text-white" : "bg-gray-200 text-black"
        }`}
      >
        <p
          className="text-xs"
          style={{ color: isCurrentUser ? "#44ef5b" : "#ef4444" }}
        >
          {messageData.sender.name}
        </p>
        <p>{messageData.message}</p>
        <p className="text-xs text-right">
          {moment(messageData.createdAt).format("DD/MM/YYYY, h:mm A")}
        </p>
      </div>
    </div>
  );
};

export default Message;
