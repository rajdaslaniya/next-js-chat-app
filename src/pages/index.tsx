import React, { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import withAuth from "@/components/protected/withAuth";
import ChatList from "@/components/chat/ChatList";
import ChatDetails from "@/components/chat/ChatDetails";
import { plusSvg } from "@/assets";
import NewChat from "@/components/chat/NewChat";
import apiService from "@/utils/base-services";
import { toast } from "react-toastify";
import { IUserDetails } from "@/utils/interface";

const Dashboard: React.FC = () => {
  const router = useRouter();

  const [userDetail, setUserDetail] = useState<IUserDetails>({
    name: "",
    email: "",
    avatar: "",
    _id: "",
  });
  const [selectedChat, setSelectedChat] = useState<string>("");
  const [openNewChat, setOpenNewChat] = useState<boolean>(false);
  const [isOpenDropDown, setIsOpenDropDown] = useState<boolean>(false);

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

  const handleLogout = useCallback(() => {
    localStorage.clear();
    router.push("/login");
  }, [router]);

  const toggleNewChatModal = useCallback(() => {
    setOpenNewChat((prev) => !prev);
  }, []);

  const toggleDropdown = useCallback(() => {
    setIsOpenDropDown((prev) => !prev);
  }, []);

  const userDetailMemo = useMemo(() => userDetail, [userDetail]);

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
              <div className="absolute top-14 z-100 left-0 w-32 p-4 bg-white shadow-md rounded">
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
            <p className="text-xl text-black">{userDetailMemo.name}</p>
            <p className="text-md text-black">{userDetailMemo.email}</p>
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
        <ChatList
          userDetail={userDetailMemo}
          openNewChat={openNewChat}
          selectedChat={selectedChat}
          setSelectedChatValue={setSelectedChat}
        />
        {/* Chat Details */}
        <div className="flex flex-col w-full p-2 border border-black rounded-md">
          {selectedChat ? (
            <ChatDetails
              selectedChat={selectedChat}
              userDetail={userDetailMemo}
            />
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
