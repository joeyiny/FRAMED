import React from "react";
import Chat from "./Chat";
import { ChatContext } from "../../context/ChatContext";
import { BiArrowToRight, BiArrowToLeft } from "react-icons/bi";

const SidePanel: React.FC<{ roomId: string | null; player_id: string | null; hasJoined: boolean }> = ({
  roomId,
  player_id,
  hasJoined,
}) => {
  const { chatsOpenState, toggleChat } = React.useContext(ChatContext);
  const isChatOpen = chatsOpenState[roomId || ""];

  return (
    <div
      className={`fixed top-12 right-4 bottom-4 h-auto w-1/3 bg-white text-black rounded-lg shadow-xl flex flex-col justify-between transform ${
        isChatOpen ? "translate-x-0" : "translate-x-[calc(100%-40px)]"
      } transition-transform ease-in-out duration-300`}>
      <div className="bg-gray-900 text-white py-2 px-4 rounded-t-lg flex justify-between items-center">
        {isChatOpen ? (
          <div className="flex items-center cursor-pointer" onClick={() => toggleChat(roomId ? roomId : "999")}>
            <div className="flex-grow"></div>
            Chat
            <BiArrowToRight size={24} className="text-white ml-4" />
          </div>
        ) : (
          <div className="flex items-center cursor-pointer" onClick={() => toggleChat(roomId ? roomId : "999")}>
            <div className="flex-grow"></div>
            <BiArrowToLeft size={24} className="text-white " />
          </div>
        )}
      </div>

      {player_id && isChatOpen && <Chat roomId={roomId ? roomId : "999"} player_id={player_id} hasJoined={hasJoined} />}
    </div>
  );
};

export default SidePanel;
