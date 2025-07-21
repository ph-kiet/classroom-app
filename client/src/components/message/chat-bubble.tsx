import { cn } from "@/lib/utils";
import { IMessage } from "./chat-content";

interface IProps {
  msg: IMessage;
}

export default function ChatBubble({ msg }: IProps) {
  return (
    // <div className={`flex ${msg.isSent ? "justify-end" : "justify-start"}`}>
    //   <div>
    //     <div className="bg-muted rounded-md border p-4">
    //       <p>{msg.message}</p>
    //     </div>

    //     <div
    //       className={cn({
    //         "text-right": msg.isSent,
    //       })}
    //     >
    //       <time className="text-muted-foreground mt-1 text-xs ">
    //         {new Date(msg.timestamp).toLocaleTimeString()}
    //       </time>
    //     </div>
    //   </div>
    // </div>

    <div
      className={cn("max-w-(--breakpoint-sm) space-y-1", {
        "self-end": msg.isSent,
      })}
    >
      <div className="flex items-center gap-2">
        <div
          className={cn("bg-muted inline-flex rounded-md border p-4", {
            "order-1": msg.isSent,
          })}
        >
          {msg.message}
        </div>
        <div className={cn({ "order-2": !msg.isSent })}></div>
      </div>
      <div
        className={cn("flex items-center gap-2", {
          "justify-end": msg.isSent,
        })}
      >
        <time
          className={cn(
            "text-muted-foreground mt-1 flex items-center text-xs",
            {
              "justify-end": msg.isSent,
            }
          )}
        >
          {new Date(msg.timestamp).toLocaleTimeString()}
        </time>
        <div></div>
      </div>
    </div>
  );
}
