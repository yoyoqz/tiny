import { Box, Center, Grid, GridItem } from '@chakra-ui/react';
import { faCommentDots } from '@fortawesome/free-regular-svg-icons';
import { faComment, faDesktop, faStop } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { AudioSelectButton } from '../core/AudioSelectButton';
import { ControlButton } from '../core/ControlButton';
import { ControlsProps } from '../core/ControlsView';
import { VideoSelectButton } from '../core/VideoSelectButton';
import { useParticipant } from '../hooks/useParticipant';
import styles from '../styles/Room.module.css';
import ChatOverlay from './ChatOverlay';
import { Table, Tbody, Td, Tr } from '@chakra-ui/react';

const Controls = ({ room, onLeave }: ControlsProps) => {
  const { cameraPublication: camPub } = useParticipant(room.localParticipant);
  const [videoButtonDisabled, setVideoButtonDisabled] = useState(false);
  const [audioButtonDisabled, setAudioButtonDisabled] = useState(false);
  const [screenButtonDisabled, setScreenButtonDisabled] = useState(false);
  const [isChatOpen, setChatOpen] = useState(false);
  const [numUnread, setNumUnread] = useState(0);

  const startChat = () => {
    setChatOpen(true);
  };

  const audioEnabled = room.localParticipant.isMicrophoneEnabled;
  const muteButton = (
    <AudioSelectButton
      isMuted={!audioEnabled}
      isButtonDisabled={audioButtonDisabled}
      onClick={() => {
        setAudioButtonDisabled(true);
        room.localParticipant
          .setMicrophoneEnabled(!audioEnabled)
          .finally(() => setAudioButtonDisabled(false));
      }}
      onSourceSelected={(device) => {
        setAudioButtonDisabled(true);
        room
          .switchActiveDevice('audioinput', device.deviceId)
          .finally(() => setAudioButtonDisabled(false));
      }}
    />
  );

  const videoEnabled = !(camPub?.isMuted ?? true);
  const videoButton = (
    <VideoSelectButton
      isEnabled={videoEnabled}
      isButtonDisabled={videoButtonDisabled}
      onClick={() => {
        setVideoButtonDisabled(true);
        room.localParticipant
          .setCameraEnabled(!videoEnabled)
          .finally(() => setVideoButtonDisabled(false));
      }}
      onSourceSelected={(device) => {
        setVideoButtonDisabled(true);
        room
          .switchActiveDevice('videoinput', device.deviceId)
          .finally(() => setVideoButtonDisabled(false));
      }}
    />
  );

  const screenShareEnabled = room.localParticipant.isScreenShareEnabled;
  const screenButton = (
    <ControlButton
      label={screenShareEnabled ? 'Stop sharing' : 'Share screen'}
      icon={screenShareEnabled ? faStop : faDesktop}
      disabled={screenButtonDisabled}
      onClick={() => {
        setScreenButtonDisabled(true);
        room.localParticipant
          .setScreenShareEnabled(!screenShareEnabled)
          .finally(() => setScreenButtonDisabled(false));
      }}
    />
  );

  const chatButton = (
    <ControlButton
      label="Chat"
      icon={numUnread > 0 ? faCommentDots : faComment}
      onClick={startChat}
    />
  );

  return (
    <Box  bg="cld.bg1" minH="100vh">
      <main>
        <Box>
          <Grid
            mt="0.75rem"
            gap="0.5rem"
            templateColumns="min-content min-content"
            placeContent="end center">
            <GridItem>
            {muteButton}
            </GridItem>
            <GridItem>
            {videoButton}
            </GridItem>
          </Grid>
        </Box>
        <Box>
          <Grid
            mt="0.75rem"
            gap="0.5rem"
            templateColumns="min-content min-content min-content"
            placeContent="end center">
            <GridItem>
            {chatButton}
            </GridItem>
            <GridItem>
            {onLeave && (
            <ControlButton
              label="End"
              className={styles.dangerButton}
              onClick={() => {
                room.disconnect();
                onLeave(room);
              }}
            />
            )}
            </GridItem>
          </Grid>
        </Box>
        <Box>  
        <ChatOverlay
          room={room}
          isOpen={isChatOpen}
          onUnreadChanged={setNumUnread}
          onClose={() => {
            setChatOpen(false);
          }}
        />
      </Box>
    </main>
      <footer>
      </footer>
    </Box>
  )
};

/*
  return (
    <>
      <Table variant="simple" minH="60%">
        <Tbody>
          <Tr>
            <Td>{muteButton}</Td>
            <Td>{videoButton}</Td>
          </Tr>
          <Tr>
            <Td>{screenButton}</Td>
            <Td>        
              {onLeave && (
              <ControlButton
                label="End"
                className={styles.dangerButton}
                onClick={() => {
                  room.disconnect();
                  onLeave(room);
                }}
              />)}  
              </Td>
          </Tr>
        </Tbody>
      </Table>
      <ChatOverlay
        room={room}
        isOpen={isChatOpen}
        onUnreadChanged={setNumUnread}
        onClose={() => {
          setChatOpen(false);
        }}
      />
    </>
  );
};
*/

export default Controls;
/*
 *
      <HStack>
        {muteButton}
        {videoButton}
        {screenButton}
        {chatButton}
        {onLeave && (
          <ControlButton
            label="End"
            className={styles.dangerButton}
            onClick={() => {
              room.disconnect();
              onLeave(room);
            }}
          />
        )}
      </HStack>
 */

