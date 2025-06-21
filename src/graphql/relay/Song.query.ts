import { Song } from '@prisma/client';
import { graphql, useFragment } from 'react-relay';
import { SongFragment$data, SongFragment$key } from './__generated__/SongFragment.graphql';

export const SongFragment = graphql`
  fragment SongFragment on Song {
    id
    songId
    name
    averageGap
    points
    tags
  }
`;

export const formatSong = (song: SongFragment$data): Song => ({
  ...song,
  id: song.songId,
  tags: [...(song.tags || [])],
});

export const useSongFragment = (song: SongFragment$key): Song => {
  const songData = useFragment<SongFragment$key>(SongFragment, song);
  return formatSong(songData);
};
