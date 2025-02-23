import { ShowWithVenueAndRun } from '@/models/show.model';
import { selectOpenSection, setOpenSection } from '@/store/admin/showModerator.store';
import { useThemeContext } from '@/store/theme.store';
import { formatShowDate } from '@/utils/show.util';
import { Song } from '@prisma/client';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SetlistBuilder from './SetlistBuilder';

interface ShowEditorProps {
  show: ShowWithVenueAndRun;
  allSongs: Song[];
}

export type ShowEditorSection = 'toggle submissions' | 'score';

const sectionLabels: Record<ShowEditorSection, string> = {
  'toggle submissions': 'Toggle Submissions',
  score: 'Submit Setlist',
};

export const formatShowLabel = (show: ShowWithVenueAndRun) =>
  `${formatShowDate(show, 'MM/DD/YYYY')} - ${show.run.name}, Night ${show.runNight}`;

const ShowEditor: React.FC<ShowEditorProps> = ({ show, allSongs }) => {
  const dispatch = useDispatch();
  const chooseSection = (section: ShowEditorSection | null) => dispatch(setOpenSection(section));
  const openSection = useSelector(selectOpenSection);
  const { color } = useThemeContext();

  const showTitle = formatShowLabel(show);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex items-center mx-4 mb-4">
        <p className="text-header-light text-center">{openSection ? sectionLabels[openSection] : showTitle}</p>
      </div>
      {openSection === null && (
        <div className="flex flex-col items-center space-y-6 mt-4">
          <button className={`border border-${color} rounded-lg px-2 py-1.5`} onClick={() => chooseSection('score')}>
            Submit Songs
          </button>
        </div>
      )}
      {openSection === 'score' && <SetlistBuilder show={show} allSongs={allSongs} />}
    </div>
  );
};

export default ShowEditor;
