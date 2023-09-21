import { ConnectionState, Room, RoomConnectOptions, RoomOptions } from 'livekit-client';
import React, { useEffect } from 'react';

import { ControlsProps } from './ControlsView';
import { ParticipantProps } from './ParticipantView';
import { StageProps } from './StageProps';
import { StageView } from './StageView';

import { useRoom } from '../hooks/useRoom';

export interface RoomProps {
  url: string;
  token: string;
  roomOptions?: RoomOptions;
  connectOptions?: RoomConnectOptions;
  // when first connected to room
  onConnected?: (room: Room) => void;
  // when user leaves the room
  onLeave?: (room: Room) => void;
  stageRenderer?: (props: StageProps) => React.ReactElement | null;
  participantRenderer?: (props: ParticipantProps) => React.ReactElement | null;
  controlRenderer?: (props: ControlsProps) => React.ReactElement | null;
}

export const LiveKitRoom = ({
  url,
  token,
  roomOptions,
  connectOptions,
  stageRenderer,
  participantRenderer,
  controlRenderer,
  onConnected,
  onLeave,
}: RoomProps) => {
  const roomState = useRoom(roomOptions);

  useEffect(() => {
    if (roomState.room) {
      roomState.connect(url, token, connectOptions).then((room) => {
        if (!room) {
          return;
        }
        if (onConnected && room.state === ConnectionState.Connected) {
          onConnected(room);
        }
      });
    }
    return () => {
      if (roomState.room?.state !== ConnectionState.Disconnected) {
        roomState.room?.disconnect();
      }
    };
  }, [roomState.room]);

  const selectedStageRenderer = stageRenderer ?? StageView;

  return selectedStageRenderer({
    roomState,
    participantRenderer,
    controlRenderer,
    onLeave,
  });
};
