import RadioGroup, { RadioOption } from '@/components/shared/RadioGroup';
import ShowList from '@/components/shows/ShowList';
import { ShowGroupRun, ShowGroupVenue, ShowGroupYear } from '@/types/main';
import { toTitleCase } from '@/utils/utils';
import React, { useState } from 'react';

export type FilterType = 'run' | 'year' | 'venue';
const filterTypes: FilterType[] = ['run', 'year', 'venue'];

const filterRadioOptions: RadioOption[] = filterTypes.map((filter) => ({
  value: filter,
  label: `By ${toTitleCase(filter)}`,
}));

interface ShowsContainerProps {
  showsByRun: ShowGroupRun[];
  showsByYear: ShowGroupYear[];
  showsByVenue: ShowGroupVenue[];
}

const ShowsContainer: React.FC<ShowsContainerProps> = ({ showsByRun, showsByYear, showsByVenue }) => {
  const [filterType, setFilterType] = useState<FilterType>('run');

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <p className="text-4xl my-4">Shows</p>
      </div>
      <RadioGroup
        options={filterRadioOptions}
        selected={filterType}
        select={(type) => setFilterType(type as FilterType)}
        containerClass="mb-5"
      />
      <div className="w-full">
        <ShowList
          filterType={filterType}
          showsByRun={showsByRun}
          showsByYear={showsByYear}
          showsByVenue={showsByVenue}
        />
      </div>
    </div>
  );
};

export default ShowsContainer;
