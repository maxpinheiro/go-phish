import { ShowWithVenueAndRun } from '@/models/show.model';
import { useThemeContext } from '@/store/theme.store';
import { formatShowDate } from '@/utils/show.util';
import { Song } from '@prisma/client';
import React, { useState } from 'react';
import BackArrow from '../shared/BackArrow';
import SetlistBuilder from './SetlistBuilder';

interface ShowEditorProps {
  show: ShowWithVenueAndRun;
  allSongs: Song[];
  back: () => void;
}

type ShowEditorSection = 'toggle submissions' | 'score';
const sectionLabels: Record<ShowEditorSection, string> = {
  'toggle submissions': 'Toggle Submissions',
  score: 'Submit Songs',
};

const ShowEditor: React.FC<ShowEditorProps> = ({ show, allSongs, back }) => {
  const [openSection, setOpenSection] = useState<ShowEditorSection | null>(null);
  const { color } = useThemeContext();

  const showTitle = `${formatShowDate(show, 'MM/DD/YYYY')} - ${show.run.name}, Night ${show.runNight}`;

  return (
    <div className="flex flex-col items-center w-full">
      <BackArrow
        width={16}
        height={16}
        onClick={openSection ? () => setOpenSection(null) : back}
        className="cursor-pointer flex items-center justify-start w-full space-x-2 pt-4"
        svgClass="fill-black dark:fill-white"
      >
        <p className="">{openSection ? showTitle : 'All Shows'}</p>
      </BackArrow>
      <div className="flex items-center m-4">
        <p className="text-2xl text-center">{openSection ? sectionLabels[openSection] : showTitle}</p>
      </div>
      {openSection === null && (
        <div className="flex flex-col items-center space-y-6 mt-10">
          <button className={`border border-${color} rounded-lg px-2 py-1.5`} onClick={() => setOpenSection('score')}>
            Submit Songs
          </button>
        </div>
      )}
      {openSection === 'score' && <SetlistBuilder show={show} allSongs={allSongs} />}
    </div>
  );
};

export default ShowEditor;
