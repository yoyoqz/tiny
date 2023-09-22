import { MediaType } from '@/common/CommonEnums';
import { DateString, ItemWithId, Maybe } from '@/common/CommonTypes';
import { Movie, MovieImage } from '@/movies/MoviesTypes';


export interface LiveInfo extends ItemWithId {
  name: string;
  url: string;
}

