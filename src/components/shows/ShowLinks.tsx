import EyeIcon from '@/media/Eye.svg';
import PencilIcon from '@/media/Pencil.svg';
import TrophyIcon from '@/media/Trophy.svg';
import { Show } from '@prisma/client';
import Link from 'next/link';
import React from 'react';

interface ShowLinksProps {
  runId: number;
  show?: Show;
}

const ShowLinks: React.FC<ShowLinksProps> = ({ runId, show }) => (
  <div className="flex items-center justify-between md:justify-center space-x-6 md:space-x-12 w-full py-3 text-center">
    <Link href={`/guesses/run/${runId}?night=${show?.runNight || ''}`}>
      <EyeIcon width={22} height={22} className="" />
    </Link>
    {show && (
      <Link href={`/guesses/${show.id}/edit`}>
        <PencilIcon width={22} height={22} className="" />
      </Link>
    )}
    <Link href={`/scores/run/${runId}?night=${show?.runNight || ''}`}>
      <TrophyIcon width={22} height={22} className="" />
    </Link>
  </div>
);

export default ShowLinks;
