import { FilterType } from '@/pages/shows';
import { ShowGroupRun, ShowGroupVenue, ShowGroupYear } from '@/types/main';
import React, { useState } from 'react';
import RunGroupItem from './RunGroupItem';
import VenueGroupItem from './VenueGroupItem';
import YearGroupItem from './YearGroupItem';

interface ShowListProps {
  filterType: FilterType;
  showsByRun: ShowGroupRun[];
  showsByYear: ShowGroupYear[];
  showsByVenue: ShowGroupVenue[];
}

const ShowList: React.FC<ShowListProps> = ({ filterType, showsByRun, showsByYear, showsByVenue }) => {
  const [openRunId, setOpenRunId] = useState<string | number | null>(null);
  const [openShowId, setOpenShowId] = useState<number | 'total' | null>(null);

  return (
    <div className="w-full flex flex-col">
      {filterType === 'run' &&
        showsByRun.map((showGroup, idx) => (
          <RunGroupItem
            showGroup={showGroup}
            idx={idx}
            key={'rungroupitem' + idx}
            openRunId={openRunId}
            setOpenRunId={setOpenRunId}
            openShowId={openShowId}
            setOpenShowId={setOpenShowId}
          />
        ))}
      {filterType === 'year' &&
        showsByYear.map((showGroup, idx) => (
          <YearGroupItem
            showGroup={showGroup}
            idx={idx}
            key={'yeargroupitem' + idx}
            openRunId={openRunId}
            setOpenRunId={setOpenRunId}
            openShowId={openShowId}
            setOpenShowId={setOpenShowId}
          />
        ))}
      {filterType === 'venue' &&
        showsByVenue.map((showGroup, idx) => (
          <VenueGroupItem
            showGroup={showGroup}
            idx={idx}
            key={'venuegroupitem' + idx}
            openRunId={openRunId}
            setOpenRunId={setOpenRunId}
            openShowId={openShowId}
            setOpenShowId={setOpenShowId}
          />
        ))}
    </div>
  );
};

export default ShowList;
