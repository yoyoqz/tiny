import { faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Track, VideoTrack } from 'livekit-client';
import { ReactElement, useContext } from 'react';
import { AudioRenderer } from './AudioRenderer';
import { DisplayContext } from './DisplayContext';
import { StageProps } from './StageProps';
import { GridStage } from './desktop/GridStage';
import { SpeakerStage } from './desktop/SpeakerStage';
import { MobileStage } from './mobile/MobileStage';
import styles from './styles.module.css';

function isMobile():boolean{
  return /Android|iPhone|iPad|iPod|BlackBerry|webOS|Windows Phone|SymbianOS|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export const StageView = (stageProps: StageProps) => {
  const { room, participants } = stageProps.roomState;
  const context = useContext(DisplayContext);

  let mainElement: ReactElement;
  if (isMobile()) {
    mainElement = <MobileStage {...stageProps} />;
  } else {
    // find first participant with screen shared
    let screenTrack: VideoTrack | undefined;
    participants.forEach((p) => {
      if (screenTrack) {
        return;
      }
      const track = p.getTrack(Track.Source.ScreenShare);
      if (track?.isSubscribed && track.videoTrack) {
        screenTrack = track.videoTrack;
      }
    });

    if (context.stageLayout === 'grid' && screenTrack === undefined) {
      mainElement = <GridStage {...stageProps} />;
    } else {
      mainElement = <SpeakerStage {...stageProps} />;
    }
  }

  return (
    <div className={styles.container}>
      {mainElement}
      {stageProps.roomState.audioTracks.map((track) => (
        <AudioRenderer key={track.sid} track={track} isLocal={false} />
      ))}

      {room?.canPlaybackAudio === false && (
        <div className={styles.overlay}>
          <button
            className={styles.unmuteButton}
            onClick={() => {
              room.startAudio();
            }}
          >
            <FontAwesomeIcon className={styles.icon} size="1x" icon={faVolumeMute} />
            Click to Unmute
          </button>
        </div>
      )}
    </div>
  );
};
