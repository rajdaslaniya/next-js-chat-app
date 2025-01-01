export interface IUserDetails {
  name: string;
  email: string;
  avatar: string;
  _id: string;
}

export interface ILatestMessage {
  chat_id: string;
  message: string;
  createdAt: string;
  sender: {
    email: string;
    name: string;
    avatar: string;
  };
}

export interface IChat {
  _id: string;
  users: IUserDetails[];
  photo: string;
  chat_name: string;
  is_group: boolean;
  group_admin: string;
  latest_message?: ILatestMessage;
}

export interface IChatList {
  setSelectedChatValue: (id: string) => void;
  openNewChat: boolean;
  selectedChat: string;
  userDetail: {
    name: string;
    email: string;
    avatar: string;
    _id: string;
  };
}

export interface IMessage {
  _id: string;
  message: string;
  createdAt: string;
  sender: {
    _id: string;
    name: string;
    avatar: string;
  };
}

export interface IMessageProps {
  messageData: IMessage;
  isCurrentUser: boolean;
}

export interface IGroupDetails {
  chat_name: string;
  group_admin: string;
  is_group: boolean;
  photo: string;
  users: { avatar: string; email: string; name: string }[];
}

export interface IChatDetails {
  selectedChat: string;
  userDetail: {
    name: string;
    email: string;
    avatar: string;
    _id: string;
  };
}
