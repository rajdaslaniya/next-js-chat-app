// "use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import withAuth from "@/components/protected/withAuth";
import ChatList from "@/components/chat/ChatList";
import ChatDetails from "@/components/chat/ChatDetails";
import { plusSvg } from "@/assets";
import NewChat from "@/components/chat/NewChat";

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
      if (
        userDetails.name &&
        userDetails.email &&
        userDetails.id &&
        userDetails.avatar
      )
        setUserDetail(userDetails);
    }
  }, []);

  const [isOpenDropDown, setIsOpenDropDown] = useState(false);

  const redirectToLogin = () => {
    router.push("/login");
    localStorage.clear();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex grow-0 shrink-0 basis-auto  items-center justify-between p-3 bg-white shadow-md">
        <div className="flex items-center gap-2">
          <div className="relative">
            {userDetail.avatar && (
              <Image
                className="rounded-full cursor-pointer"
                height={50}
                width={50}
                alt="profiles"
                src={userDetail.avatar}
                onClick={() => setIsOpenDropDown(!isOpenDropDown)}
              />
            )}
            {isOpenDropDown && (
              <div
                style={{ top: "60px", zIndex: 1 }}
                className="absolute rounded w-32  left-0 shadow-md p-4 bg-white"
              >
                <button
                  className="text-black cursor-pointer"
                  onClick={() => redirectToLogin()}
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
        {openNewChat && (
          <NewChat closeChatModal={() => setOpenNewChat(false)} />
        )}
        <button
          onClick={() => setOpenNewChat(true)}
          className="border  border-black z-10 p-2 rounded-full text-md text-black"
        >
          <Image src={plusSvg} alt="plus" height={20} width={20} />
        </button>
      </div>
      <div className="flex gap-3 p-2 overflow-hidden h-full">
        <div className="w-80 min-w-min left-part flex flex-col gap-3 overflow-hidden border-black border p-2 rounded-md ">
          <ChatList />
        </div>
        <div className="shrink right-part p-2 border border-black rounded-md w-full flex flex-col">
          <ChatDetails />
        </div>
      </div>
    </div>
  );
};

export default withAuth(Dashboard);
