import React, { useState } from "react";
import Image from "next/image";

const ChatList = () => {
  const [searchText, setSearchText] = useState("");
  return (
    <>
      <input
        placeholder="Search here"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        className="w-full p-2 border border-gray-500 rounded-md text-black"
      />
      <div className="w-full flex flex-col gap-3 grow-1 shrink-1 basis-auto overflow-y-auto overflow-x-hidden">
        {Array(10)
          .fill(0)
          .map(() => (
            <div className="flex w-full gap-2 items-center">
              <Image
                alt="user-image"
                width={30}
                height={30}
                className="rounded-full user-image"
                src="https://mostaql.hsoubcdn.com/uploads/thumbnails/1241455/6215569d78504/Minimal-Profile-Sketch-02.jpg"
              />
              <div className="user-details-container w-full overflow-hidden">
                <p className="chat-name text-white text-lg whitespace-nowrap overflow-ellipsis overflow-hidden w-full overflow-ellipsis overflow-hidden">
                  Namednjsdasjnda dn ndajsndjansadj
                </p>
                <p className="last-message text-white text-sm whitespace-nowrap overflow-ellipsis overflow-hidden w-full overflow-ellipsis overflow-hidden">
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
