import { useState } from "react";
import { Button } from "@/components/ui/button";
import mixpanel from "@/lib/mixpanel";
const InviteFriends = ({ roomId }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    mixpanel.track("Invite Friends Button Press");
    const inviteMessage = `A theft has occurred, and someone's being FRAMED! Join me in room ${roomId} \nhttps://play.framed.gg`;
    navigator.clipboard.writeText(inviteMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
  };

  return (
    <div className="flex flex-col items-center w-full mt-8">
      <Button onClick={copyToClipboard}>{copied ? "Copied!" : "Copy Invite Link"}</Button>
    </div>
  );
};

export default InviteFriends;
