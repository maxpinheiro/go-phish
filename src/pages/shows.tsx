import Head from 'next/head';
import React, { useState } from 'react';
import { ShowGroupRun, ShowGroupYear, ShowGroupVenue } from '@/types/main';
import { GetServerSideProps } from 'next';
import { getAllShows, getAllShowsWithVenues, getAllShowsWithVenuesAndRuns } from '@/services/show.service';
import { getAllRuns, getAllRunsWithVenues } from '@/services/run.service';
import { organizeShowsByRun, organizeShowsByVenue, organizeShowsByYear } from '@/utils/show.util';
import { toTitleCase } from '@/utils/utils';
import ShowList from '@/components/shows/ShowList';
import ErrorMessage from '@/components/shared/ErrorMessage';
import { ShowWithVenue } from '@/models/show.model';
import RadioGroup, { RadioOption } from '@/components/shared/RadioGroup';

export type FilterType = 'run' | 'year' | 'venue';
const filterTypes: FilterType[] = ['run', 'year', 'venue'];

const filterRadioOptions: RadioOption[] = filterTypes.map((filter) => ({
  value: filter,
  label: `By ${toTitleCase(filter)}`,
}));

interface ShowListProps {
  showsByRun: ShowGroupRun[];
  showsByYear: ShowGroupYear[];
  showsByVenue: ShowGroupVenue[];
  error?: string;
}

export const getServerSideProps: GetServerSideProps<ShowListProps> = async (context) => {
  let shows = await getAllShowsWithVenuesAndRuns();

  shows = JSON.parse(JSON.stringify(shows)) as typeof shows;
  // const shows = await getAllShowsWithVenues();
  // const runs = await getAllRunsWithVenues();

  const showsByRun = organizeShowsByRun(shows);
  const showsByYear = organizeShowsByYear(shows);
  const showsByVenue = organizeShowsByVenue(shows);

  return {
    props: { showsByRun, showsByYear, showsByVenue },
  };
};

const ShowListContainer: React.FC<ShowListProps> = ({ showsByRun, showsByYear, showsByVenue, error }) => {
  const [filterType, setFilterType] = useState<FilterType>('run');

  const FilterBar = () => (
    <div className="flex justify-center space-x-2.5 mb-5">
      {filterTypes.map((filter) => (
        <p
          key={filter}
          className={`m-0 cursor-pointer pb-1 ${
            filter === filterType ? 'border-b border-black dark:border-white' : ''
          }`}
          onClick={() => setFilterType(filter)}
        >
          By {toTitleCase(filter)}
        </p>
      ))}
    </div>
  );

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <>
      <Head>
        <title>Shows | Go Phish</title>
      </Head>
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
    </>
  );
};

export default ShowListContainer;
