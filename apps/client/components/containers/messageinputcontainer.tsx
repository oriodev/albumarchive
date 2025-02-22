import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface Props {
  message: string;
  setMessage: (message: string) => void;
  handleKeyDown: any;
  inputRef: any;
  onSendMessage: any;
}

export default function MessageInputContainer({
  message,
  setMessage,
  handleKeyDown,
  inputRef,
  onSendMessage,
}: Props) {
  return (
    <div className="flex gap-2 p-2 ">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        ref={inputRef}
      />
      <Button onClick={onSendMessage} variant={"dark"} className="pl-8 pr-8">
        Send
      </Button>
    </div>
  );
}
