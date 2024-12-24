// "use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import withAuth from "@/components/protected/withAuth";

const Dashboard = () => {
  const router = useRouter();
  const [userDetail, setUserDetail] = useState<{
    name: string;
    email: string;
    avatar: string;
    id: string;
  }>({ avatar: "", email: "", name: "", id: "" });

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
    <div>
      <div className="flex items-center justify-between p-3 bg-gray-500 shadow-md">
        <label className="text-xl text-white">{userDetail.name}</label>
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
              style={{ top: "60px" }}
              className="absolute rounded w-32 top-15 right-0 shadow-md p-4 bg-white"
            >
              <button
                className="text-gray-500"
                onClick={() => redirectToLogin()}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <div>
        <div className="">Left</div>
        <div className="">Right</div>
      </div>
    </div>
  );
};

export default withAuth(Dashboard);
