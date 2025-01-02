export interface IUser {
  avatar: string;
  email: string;
  name: string;
  _id: string;
}

interface LatestMessage {
  chat_id: string;
  message: string;
  createdAt: string;
  sender: {
    email: string;
    name: string;
    avatar: string;
  };
}

export interface Chat {
  _id: string;
  users: IUser[];
  photo: string;
  chat_name: string;
  is_group: boolean;
  group_admin: string;
  latest_message?: LatestMessage;
}

export interface IMessage {
  _id: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  sender: {
    _id: string;
    name: string;
    email: string;
    avatar: string;
  };
}

export interface IGroupDetails {
  chat_name: string;
  group_admin: string;
  is_group: boolean;
  photo: string;
  users: { avatar: string; email: string; name: string }[];
}
