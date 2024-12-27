import React from "react";
import Image from "next/image";
import { deleteSvg, messageSvg } from "@/assets";

const ChatDetails = () => {
  return (
    <>
      <div className="flex gap-2 items-center mb-2 justify-between">
        <div className="flex gap-2 items-center">
          <Image
            className="rounded-full max-h-fit"
            height={40}
            width={40}
            alt="user-image"
            src="https://mostaql.hsoubcdn.com/uploads/thumbnails/1241455/6215569d78504/Minimal-Profile-Sketch-02.jpg"
          />
          <p className="text-black text-md">Group name</p>
        </div>
        <button className="border border-black p-2 rounded-full">
          <Image height={20} width={20} src={deleteSvg} alt="delete" />
        </button>
      </div>
      <hr className="bg-black mb-2" />
      <div className="flex-grow shrink basis-auto relative">
        <div className="absolute left-0 right-0 bottom-0 flex flex-col gap-3 overflow-auto max-h-full">
          {Array(1)
            .fill(0)
            .map(() => (
              <>
                <div className="flex gap-3">
                  <Image
                    className="rounded-full max-h-fit"
                    height={25}
                    width={25}
                    alt="user-image"
                    src="https://mostaql.hsoubcdn.com/uploads/thumbnails/1241455/6215569d78504/Minimal-Profile-Sketch-02.jpg"
                  />
                  <div
                    style={{ backgroundColor: "#e5e4e4" }}
                    className="p-2  text-black rounded-md max-w-screen-sm"
                  >
                    <p className="text-sm">
                      It is a long established fact that a reader will be
                      distracted by the readable content of a page when looking
                      at its layout. The point of using Lorem Ipsum is that it
                      has a more-or-less normal distribution of letters, as
                      opposed to using 'Content here.
                    </p>
                    <p className="text-xs text-right">7:30 PM</p>
                  </div>
                </div>

                <div className="flex gap-3 flex-row-reverse">
                  <Image
                    className="rounded-full max-h-fit"
                    height={25}
                    width={25}
                    alt="user-image"
                    src="https://mostaql.hsoubcdn.com/uploads/thumbnails/1241455/6215569d78504/Minimal-Profile-Sketch-02.jpg"
                  />
                  <div className="p-2 bg-black text-white rounded-md max-w-screen-sm">
                    <p className="text-sm">
                      It is a long established fact that a reader will be
                      distracted by the readable content of a page when looking
                      at its layout. The point of using Lorem Ipsum is that it
                      has a more-or-less normal distribution of letters, as
                      opposed to using 'Content here.
                    </p>
                    <p className="text-xs text-right">7:30 PM</p>
                  </div>
                </div>
              </>
            ))}
        </div>
      </div>
      <div className="flex gap-2 items-center  mt-2">
        <input
          placeholder="Write message"
          className="w-full p-2 border border-black rounded-md text-black"
        />
        <button className="bg-black rounded-md text-white p-3 border-black">
          <Image alt="send" height={20} width={20} src={messageSvg} />
        </button>
      </div>
    </>
  );
};

export default ChatDetails;
