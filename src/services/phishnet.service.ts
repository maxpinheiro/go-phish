import { PhishNetSong, ResponseStatus, SetlistSong } from '@/types/main';
import { PhishNet } from '@/models/phishnet.model';
import * as cheerio from 'cheerio';
import { toTitleCase } from '@/utils/utils';
import { Song } from '@prisma/client';

const apiRoot = 'https://api.phish.net/v5';
const API_KEY = process.env.PHISHNET_API_KEY || '';

export const getAllSongs = async (): Promise<PhishNetSong[] | ResponseStatus.UnknownError> => {
  const res = await fetch(`${apiRoot}/songs.json?apikey=${API_KEY}`);
  if (res.ok || res.status === 200) {
    const data = await res.json();
    const songs = PhishNet.extractSongListResponse(data);
    if (!songs) {
      return ResponseStatus.UnknownError;
    } else if (songs.error) {
      console.log(songs.error_message);
      return ResponseStatus.UnknownError;
    } else {
      return songs.data.map((song) => ({
        id: song.slug,
        name: song.song,
        tags: [],
        artist: song.artist,
        debut: song.debut,
        last_played: song.last_played,
        times_played: song.times_played,
        gap: song.gap,
      }));
    }
  } else {
    return ResponseStatus.UnknownError;
  }
};

export const getSongById = async (songId: string): Promise<PhishNetSong | ResponseStatus.UnknownError> => {
  const res = await fetch(`${apiRoot}/songs/slug/${songId}.json?apikey=${API_KEY}`);
  if (res.ok || res.status === 200) {
    const data = await res.json();
    const song = PhishNet.extractSongResponse(data);
    if (!song) {
      return ResponseStatus.UnknownError;
    } else if (song.error) {
      console.log(song.error_message);
      return ResponseStatus.UnknownError;
    } else {
      return {
        id: song.data.slug,
        name: song.data.song,
        tags: [],
        artist: song.data.artist,
        debut: song.data.debut,
        last_played: song.data.last_played,
        times_played: song.data.times_played,
        gap: song.data.gap,
      };
    }
  } else {
    return ResponseStatus.UnknownError;
  }
};

export const getSetlistForShowDate = async (
  dateYMD: string // of the form YYYY-MM-DD
): Promise<SetlistSong[] | ResponseStatus.NotFound | ResponseStatus.UnknownError> => {
  const res = await fetch(`${apiRoot}/setlists/showdate/${dateYMD}.json?apikey=${API_KEY}`);
  if (res.ok || res.status === 200) {
    const data = await res.json();
    const setlist = PhishNet.extractSetlistResponse(data);
    if (!setlist) {
      return ResponseStatus.NotFound;
    } else if (setlist.error) {
      console.log(setlist.error_message);
      return ResponseStatus.UnknownError;
    } else {
      return setlist.data.map((song) => ({
        id: song.slug,
        name: song.slug
          .split('-')
          .map((s) => toTitleCase(s))
          .join(' '),
        encore: song.set === 'e',
      }));
    }
  } else {
    return ResponseStatus.UnknownError;
  }
};

export const scrapeSongFrequency = async (song: Song): Promise<number | ResponseStatus.NotFound> => {
  const res = await fetch(`https://phish.net/song/${song.id}`);
  if (res.ok || res.status === 200) {
    const body = await res.text();
    const $ = cheerio.load(body);
    const $text = $("p:contains('Since its debut')");
    const text = $text.text();
    const totalCountMatch = text.match(/It was played (?<count>\d+(,\d+)*) time\(s\) at the following show\(s\)/);
    const showsSinceDebutMatch = text.match(/There have been (?<count>\d+(,\d+)*) shows since the live debut/);

    if (totalCountMatch && showsSinceDebutMatch) {
      const totalCount = parseInt(totalCountMatch['groups']?.count?.toString().replace(/,/g, '') || '');
      const showsSinceDebut = parseInt(showsSinceDebutMatch['groups']?.count?.toString().replace(/,/g, '') || '');
      const frequency = totalCount / showsSinceDebut;
      let inverseFrequency = 1.0 / frequency;
      inverseFrequency = Math.floor(inverseFrequency * 1000) / 1000;
      return inverseFrequency;
    } else {
      console.log(`missing: ${song.name}`);
    }
    return -1;
  } else {
    return ResponseStatus.NotFound;
  }
};

export default { getAllSongs, scrapeSongFrequency };
