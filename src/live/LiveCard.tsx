import BaseImage from '@/common/BaseImage';
import BaseCard from '@/common/BaseCard';
import BaseCardHeader from '@/common/BaseCardHeader';
import { LiveInfo } from '@/live/LiveTypes';
//import useApiConfiguration from '@/api-configuration/ApiConfigurationHooks';
import { Box } from '@mui/material';

interface LiveCardProps {
  name: string;
  url: string;
}

export default function LiveCard({ name, url }: LiveCardProps) {
  //const { getImageUrl } = useApiConfiguration();

  return (
    <BaseCard href={`/rooms/${name}`}>
      <Box sx={{ position: 'relative', aspectRatio: '2 / 3' }}>
        <BaseImage
          src={url}
          alt={name}
          fill
          style={{ objectFit: 'cover' }}
        />
      </Box>
      <BaseCardHeader title={name} />
    </BaseCard>
  );
}

//export default LiveCard;
