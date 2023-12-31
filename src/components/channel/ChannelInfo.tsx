import { cn } from "@/styles/utils";
import { useParticipants } from "@livekit/components-react";
import { type Participant } from "livekit-client";
import { useCallback } from "react";
import { Icons } from "../ui";
import Presence from "./Presence";

type Props = {
  username: string;
};

export default function ChannelInfo({ username }: Props) {
  const filterFn = useCallback((p: Participant) => p.videoTracks.size > 0, []);
  const participants = useParticipants({
    filter: filterFn,
  });
  const isLive = participants.length > 0;

  return (
    <div className="space-y-6 border-t px-8 py-6 dark:border-t-zinc-800">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="grid place-items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={cn(
                "h-16 w-16 rounded-full border-2 border-white bg-gray-500 dark:border-zinc-900",
                isLive && "ring-2 ring-red-600"
              )}
              src={`https://api.dicebear.com/5.x/open-peeps/svg?seed=${username}&size=64&face=smile,cute`}
              alt={username}
            />
            {isLive && (
              <div className="absolute mt-14 w-12 rounded-xl border-2 border-white bg-red-600 p-1 text-center text-xs font-bold uppercase text-white transition-all dark:border-zinc-900">
                Live
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold">{username}</h1>
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
                <Icons.check className="h-3 w-3 text-white dark:text-zinc-900" />
              </div>
            </div>
          </div>
        </div>
        <Presence />
      </div>
    </div>
  );
}
