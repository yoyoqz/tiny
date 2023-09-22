import PersonCard from '@/people/PersonCard';
import BaseSeo from '@/seo/BaseSeo';
import { PaginationResponse } from '@/common/CommonTypes';
import { dehydrate, useInfiniteQuery } from '@tanstack/react-query';
import { getAllPageResults } from '@/common/CommonUtils';
import { createQueryClient } from '@/http-client/queryClient';
import PageTitle from '@/common/PageTitle';
import LiveCard from '@/live/LiveCard';
import InfiniteGridList from '@/common/InfiniteGridList';
import { GetServerSideProps } from 'next';
import BaseGridList from '@/common/BaseGridList';


import { getRoomClient } from '../../lib/clients';
import { Room } from 'livekit-client';

function functest() {
  console.log('abc ddd')
}

function PopularPeoplePage({ data }:any) {
  
  console.log({data})

  return (
    <>
      <BaseSeo title="直播专区" description="Popular people list" />
      <PageTitle title="直播专区2" />
      <BaseGridList
      listEmptyMessage="No crew info has been found."
      >
      {
        data.map((room: any) => (
            <li key={room.sid}>
            <LiveCard name ={room.name} url="https://t1.szrtcpa.com/2023/09/21/5ec898fba0d22.jpg"/>
            </li>
        ))
      }
      </BaseGridList>
    </>
  );
}

export async function getServerSideProps() {
  const client = getRoomClient();
  const data = await client.listRooms();
  //console.log({rooms})

  return { props: { data } }
}


/*
  const queryClient = createQueryClient();

  await Promise.all([
    queryClient.fetchQuery(apiConfigurationAPI.configuration()),
    queryClient.fetchInfiniteQuery(peopleAPI.popularPeople()),
  ]);

  return {
    props: {
      // There is an issue when we use infinite query while SSR.
      // So, we use this workaround.
      // https://github.com/tannerlinsley/@tanstack/react-query/issues/1458
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
*/
export default PopularPeoplePage
