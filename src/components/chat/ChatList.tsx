import React, { useState } from "react";
import Image from "next/image";
import { searchSvg } from "@/assets";

const ChatList = () => {
  const [searchText, setSearchText] = useState("");
  return (
    <>
      <div className="relative">
        <Image
          src={searchSvg}
          height={20}
          width={20}
          alt="search"
          className="absolute top-0 bottom-0"
          style={{ left: 10, margin: "auto 0px" }}
        />
        <input
          placeholder="Search here"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          className="w-full p-2 border border-black rounded-md text-black pl-8"
        />
      </div>
      <div className="w-full flex flex-col gap-3 grow-1 shrink-1 basis-auto overflow-y-auto overflow-x-hidden">
        {Array(10)
          .fill(0)
          .map(() => (
            <div className="flex w-full border border-black p-2 gap-2 items-center rounded-md">
              <Image
                alt="user-image"
                width={30}
                height={30}
                className="rounded-full user-image"
                src="https://mostaql.hsoubcdn.com/uploads/thumbnails/1241455/6215569d78504/Minimal-Profile-Sketch-02.jpg"
              />
              <div className="user-details-container w-full overflow-hidden">
                <p className="chat-name text-black text-lg whitespace-nowrap overflow-ellipsis overflow-hidden w-full overflow-ellipsis overflow-hidden">
                  Namednjsdasjnda dn ndajsndjansadj
                </p>
                <p className="last-message text-black text-sm whitespace-nowrap overflow-ellipsis overflow-hidden w-full overflow-ellipsis overflow-hidden">
                  Hello My name is raj daslaniya kem cho majama
                </p>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default ChatList;
