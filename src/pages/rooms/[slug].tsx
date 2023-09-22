/*

import { useToast } from '@chakra-ui/react';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ActiveRoom from '../../components/ActiveRoom';
import PreJoin from '../../components/PreJoin';
import { getRoomClient } from '../../lib/clients';
import { SessionProps } from '../../lib/types';

interface RoomProps {
  roomName: string;
  numParticipants: number;
  region?: string;
  identity?: string;
  turnServer?: RTCIceServer;
  forceRelay?: boolean;
}

const RoomPage = ({ roomName, region, numParticipants, turnServer, forceRelay }: RoomProps) => {
  const [sessionProps, setSessionProps] = useState<SessionProps>();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!roomName.match(/\w{4}\-\w{4}/)) {
      toast({
        title: 'Invalid room',
        duration: 2000,
        onCloseComplete: () => {
          router.push('/');
        },
      });
    }
  }, [roomName, toast, router]);

  if (sessionProps) {
    return (
      <ActiveRoom
        {...sessionProps}
        region={region}
        turnServer={turnServer}
        forceRelay={forceRelay}
      />
    );
  } else {
    return (
      <PreJoin
        startSession={setSessionProps}
        roomName={roomName}
        numParticipants={numParticipants}
      />
    );
  }
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const roomName = context.params?.name;
  const region = context.query?.region;
  const identity = context.query?.identity;
  const turn = context.query?.turn;
  const forceRelay = context.query?.forceRelay;

  if (typeof roomName !== 'string') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const client = getRoomClient();
  const rooms = await client.listRooms([roomName]);
  let numParticipants = 0;
  if (rooms.length > 0) {
    numParticipants = rooms[0].numParticipants;
  }

  const props: RoomProps = {
    roomName,
    numParticipants,
  };
  if (typeof region === 'string') {
    props.region = region;
  }
  if (typeof identity === 'string') {
    props.identity = identity;
  }
  if (typeof turn === 'string') {
    const parts = turn.split('@');
    if (parts.length === 2) {
      const cp = parts[0].split(':');
      props.turnServer = {
        urls: [`turn:${parts[1]}?transport=udp`],
        username: cp[0],
        credential: cp[1],
      };
    }
  }
  if (forceRelay === '1' || forceRelay === 'true') {
    props.forceRelay = true;
  }

  return {
    props,
  };
};
*/
import {
  type GetServerSideProps,
  type InferGetServerSidePropsType,
} from "next";

import { useEffect, useState } from 'react';

import ChannelInfo from "@/components/channel/ChannelInfo";
import Chat from "@/components/channel/Chat";
import Sidebar from "@/components/channel/Sidebar";
import StreamPlayer from "@/components/channel/StreamPlayer";
import WatchingAsBar from "@/components/channel/WatchingAsBar";

import { LiveKitRoom } from "@livekit/components-react";

interface Props {
  slug: string;
}
interface TokenResult {
  url: string;
  token: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  params,
}) => {
  return Promise.resolve({
    props: {
      slug: params?.slug as string,
    },
  });
};

export default function RoomPage({
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  
  //const [viewerName, setViewerName] = useState("");
  const [tokenResult, setTokenResult] = useState<TokenResult | undefined>();
  //const [region, setRegion] = useState("");
  const viewerName = randomString(4);
  //setTokenResult(new TokenResult())

  useEffect(() => {
    const roomName = slug
    const identity = viewerName
    const params: { [key: string]: string } = {
      roomName,
      identity,
    };
    //if (region) {
    //  params.region = region;
    //}
    fetch("/film/api/token?" + new URLSearchParams(params).toString())
      .then((res) => res.json())
      .then((data: TokenResult) => {
        setTokenResult(data);
      }).catch(e => {
        console.log(e)
      });
  }, [slug]);

  return (
    <div className = "lk-room-container">
      {tokenResult &&
        <LiveKitRoom
          serverUrl = {tokenResult.url}
          token={tokenResult.token}        
        >

      <WatchingAsBar viewerName={viewerName} />
      <div className="flex h-full flex-1">
        <div className="sticky hidden w-80 border-r dark:border-zinc-800 dark:bg-zinc-900 lg:block">
          <div className="absolute left-0 top-0 bottom-0 flex h-full w-full flex-col gap-2 px-4 py-2">
            <Sidebar />
          </div>
        </div>
        <div className="flex-1 flex-col dark:border-t-zinc-200 dark:bg-black">
          <StreamPlayer />
          <ChannelInfo username={slug} />
        </div>
        <div className="sticky hidden w-80 border-l dark:border-zinc-800 dark:bg-zinc-900 md:block">
          <div className="absolute top-0 bottom-0 right-0 flex h-full w-full flex-col gap-2 p-2">
            <Chat viewerName={viewerName} />
          </div>
        </div>
      </div>
      </LiveKitRoom>}
    </div>
    /*
    <RoomProvider
      token={viewerToken}
      serverUrl={env.NEXT_PUBLIC_LIVEKIT_WS_URL}
      className="flex flex-1 flex-col"
    >
      <WatchingAsBar viewerName={viewerName} />
      <div className="flex h-full flex-1">
        <div className="sticky hidden w-80 border-r dark:border-zinc-800 dark:bg-zinc-900 lg:block">
          <div className="absolute left-0 top-0 bottom-0 flex h-full w-full flex-col gap-2 px-4 py-2">
            <Sidebar />
          </div>
        </div>
        <div className="flex-1 flex-col dark:border-t-zinc-200 dark:bg-black">
          <StreamPlayer />
          <ChannelInfo username={slug} />
        </div>
        <div className="sticky hidden w-80 border-l dark:border-zinc-800 dark:bg-zinc-900 md:block">
          <div className="absolute top-0 bottom-0 right-0 flex h-full w-full flex-col gap-2 p-2">
            <Chat viewerName={viewerName} />
          </div>
        </div>
      </div>
    </RoomProvider>
    */
  );
}

function randomString(length: number): string {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
