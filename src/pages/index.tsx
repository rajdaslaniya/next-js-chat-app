// "use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import withAuth from "@/components/protected/withAuth";
import ChatList from "@/components/chat/ChatList";
import ChatDetails from "@/components/chat/ChatDetails";
import { plusSvg } from "@/assets";
import NewChat from "@/components/chat/NewChat";
import apiService from "@/utils/base-services";
import { toast } from "react-toastify";

const Dashboard: React.FC = () => {
  const router = useRouter();

  const [userDetail, setUserDetail] = useState({
    name: "",
    email: "",
    avatar: "",
    _id: "",
  });
  const [selectedChat, setSelectedChat] = useState<string>("");
  const [openNewChat, setOpenNewChat] = useState<boolean>(false);
  const [isOpenDropDown, setIsOpenDropDown] = useState<boolean>(false);

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await apiService.get("/chat/user");
        if (response.status === 200) {
          setUserDetail(response.data.data);
        }
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to fetch user details."
        );
      }
    };
    fetchUserDetails();
  }, []);

  // Handlers
  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const toggleNewChatModal = () => {
    setOpenNewChat((prev) => !prev);
  };

  const toggleDropdown = () => {
    setIsOpenDropDown((prev) => !prev);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-white shadow-md">
        {/* User Details */}
        <div className="flex items-center gap-2">
          <div className="relative">
            {userDetail.avatar && (
              <Image
                className="rounded-full cursor-pointer"
                height={50}
                width={50}
                alt="Profile"
                src={userDetail.avatar}
                onClick={toggleDropdown}
              />
            )}
            {isOpenDropDown && (
              <div className="absolute top-14 z-10 left-0 w-32 p-4 bg-white shadow-md rounded">
                <button
                  className="text-black cursor-pointer w-full text-left"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          <div>
            <p className="text-xl text-black">{userDetail.name}</p>
            <p className="text-md text-black">{userDetail.email}</p>
          </div>
        </div>

        {/* New Chat Button */}
        <button
          onClick={toggleNewChatModal}
          className="border border-black p-2 rounded-full"
        >
          <Image src={plusSvg} alt="Add Chat" height={20} width={20} />
        </button>
        {openNewChat && <NewChat closeChatModal={toggleNewChatModal} />}
      </div>

      {/* Main Content */}
      <div className="flex gap-3 p-2 h-full">
        {/* Chat List */}
        <div className="w-80 min-w-min flex flex-col gap-3 overflow-hidden border border-black p-2 rounded-md">
          <ChatList
            openNewChat={openNewChat}
            selectedChat={selectedChat}
            setSelectedChatValue={setSelectedChat}
          />
        </div>

        {/* Chat Details */}
        <div className="flex flex-col w-full p-2 border border-black rounded-md">
          {selectedChat ? (
            <ChatDetails selectedChat={selectedChat} userDetail={userDetail} />
          ) : (
            <div className="flex items-center justify-center h-full">
              Select chat
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withAuth(Dashboard);
