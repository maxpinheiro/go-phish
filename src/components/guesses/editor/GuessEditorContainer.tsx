import { ShowInfo } from '@/components/shared/RunInfo';
import { RunWithVenue } from '@/models/run.model';
import { ShowIdAndRunNight, ShowWithVenue } from '@/models/show.model';
import { Guess } from '@prisma/client';
import { useSession } from 'next-auth/react';
import React from 'react';
import GuessEditor from './GuessEditor';

export interface GuessEditorContainerProps {
  run: RunWithVenue;
  show: ShowWithVenue;
  runShows: ShowIdAndRunNight[];
  currentGuesses: Guess[];
  forbiddenReason?: string | null; // valid data, but cannot edit for some reason
}

const GuessEditorContainer: React.FC<GuessEditorContainerProps> = ({
  run,
  show,
  runShows,
  currentGuesses,
  forbiddenReason,
}) => {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  return (
    <div className="flex flex-col items-center w-full pt-4 pb-10">
      <ShowInfo show={show} run={run} large />
      {forbiddenReason || !currentUserId ? (
        <p className="text-center mt-8">{forbiddenReason}</p>
      ) : (
        <div className="w-full">
          <GuessEditor
            show={{ ...show, run }}
            runShows={runShows}
            currentGuesses={currentGuesses}
            currentUserId={currentUserId}
          />
        </div>
      )}
    </div>
  );
};

export default GuessEditorContainer;
