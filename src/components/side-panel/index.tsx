import React from "react";
import Chat from "./Chat";
import { ChatContext } from "../../context/ChatContext";
import { BiArrowToRight, BiArrowToLeft, BiArrowToTop, BiArrowToBottom } from "react-icons/bi";

const SidePanel: React.FC<{ roomId: string | null; player_id: string | null; hasJoined: boolean }> = ({
  roomId,
  player_id,
  hasJoined,
}) => {
  const { chatsOpenState, toggleChat } = React.useContext(ChatContext);
  const isChatOpen = chatsOpenState[roomId || ""];

  const desktopWidth = isChatOpen ? "lg:w-1/3" : "lg:w-20";
  const desktopTranslateX = isChatOpen ? "sm:translate-x-0" : "sm:translate-x-[calc(100%-40px)]";

  return (
    <div
      className={`fixed bottom-0 right-0 sm:top-12 sm:bottom-4 w-full sm:w-20 ${desktopWidth} h-[45%] sm:h-auto bg-white text-black rounded-t-lg sm:rounded-lg shadow-xl flex flex-col justify-between transform ${
        isChatOpen ? "translate-y-0" : "translate-y-[calc(90%-14px)]"
      } ${desktopTranslateX} sm:translate-y-0 transition-transform ease-in-out duration-300`}>
      <div className="bg-gray-900 text-white py-2 px-4 rounded-t-lg sm:rounded-t-none sm:rounded-l-lg flex justify-between items-center">
        <div className="flex items-center cursor-pointer" onClick={() => toggleChat(roomId ? roomId : "999")}>
          {isChatOpen && <span>Chat</span>}
          {isChatOpen ? (
            <>
              {/* Mobile */}
              <BiArrowToBottom size={24} className="text-white ml-4 block sm:hidden" />
              {/* Desktop */}
              <BiArrowToRight size={24} className="text-white ml-4 hidden sm:block" />
            </>
          ) : (
            <>
              {/* Mobile */}
              <BiArrowToTop size={24} className="text-white block sm:hidden" />
              {/* Desktop */}
              <BiArrowToLeft size={24} className="text-white hidden sm:block" />
            </>
          )}
        </div>
      </div>

      {player_id && isChatOpen && <Chat roomId={roomId ? roomId : "999"} player_id={player_id} hasJoined={hasJoined} />}
    </div>
  );
};

export default SidePanel;
