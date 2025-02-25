import EyeIcon from '@/media/Eye.svg';
import PencilIcon from '@/media/Pencil.svg';
import TrophyIcon from '@/media/Trophy.svg';
import { ShowWithRun } from '@/models/show.model';
import Link from 'next/link';
import React from 'react';

interface ShowLinksProps {
  show: ShowWithRun;
}

const ShowLinks: React.FC<ShowLinksProps> = ({ show }) => (
  <div className="flex items-center justify-between md:justify-center space-x-6 md:space-x-12 w-full py-3 text-center">
    <Link href={`/guesses/run/${show.run.slug}?night=${show.runNight}`}>
      <EyeIcon width={22} height={22} className="" />
    </Link>
    {show && (
      <Link href={`/guesses/${show.slug}/edit`}>
        <PencilIcon width={22} height={22} className="" />
      </Link>
    )}
    <Link href={`/scores/run/${show.run.slug}?night=${show.runNight}`}>
      <TrophyIcon width={22} height={22} className="" />
    </Link>
  </div>
);

export default ShowLinks;
