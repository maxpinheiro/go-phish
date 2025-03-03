import EyeIcon from '@/media/Eye.svg';
import PencilIcon from '@/media/Pencil.svg';
import TrophyIcon from '@/media/Trophy.svg';
import { Run, Show } from '@prisma/client';
import Link from 'next/link';
import React from 'react';

interface RunShowLinksProps {
  run: Run;
  show?: Show;
}

const RunShowLinks: React.FC<RunShowLinksProps> = ({ run, show }) => {
  const nightQuery = show ? `night=${show.runNight}` : '';
  return (
    <div className="flex items-center justify-between md:justify-center space-x-6 md:space-x-12 w-full py-3 text-center">
      <Link href={`/guesses/run/${run.slug}?${nightQuery}`}>
        <EyeIcon width={22} height={22} className="" />
      </Link>
      {show && (
        <Link href={`/guesses/${show.slug}/edit`}>
          <PencilIcon width={22} height={22} className="" />
        </Link>
      )}
      <Link href={`/scores/run/${run.slug}?${nightQuery}`}>
        <TrophyIcon width={22} height={22} className="" />
      </Link>
    </div>
  );
};

export default RunShowLinks;
