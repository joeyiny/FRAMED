import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Chat = () => {
  return (
    <div className="w-full h-full pt-[44px]">
      <div className="w-full h-full  border-l border-slate-200">
        <div id="chat-header" className="flex items-center">
          <h2 className="font-semibold text-lg text-left border-b w-full pl-3 py-2">Chat</h2>
        </div>
        <div id="messages-area" className="text-slate-700 px-4">
          <div className=" border-b text-left">
            <p className="text-sm py-3">
              <span className="font-bold">Ice Spice</span> joined the game
            </p>
          </div>
        </div>
      </div>
      <div id="input" className="bottom-0 w-full absolute h-14 flex items-center px-2 space-x-2">
        {/* <input type="text" className="flex-grow border rounded px-2 py-1" placeholder="Type a message..." /> */}
        {/* <button className="ml-2 bg-blue-500 text-white rounded px-2 py-1">Send</button> */}
        <Input placeholder="Type a message..."></Input>
        <Button size="sm">Send</Button>
      </div>
    </div>
  );
};
export default Chat;
