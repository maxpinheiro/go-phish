import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <p className="text-title-regular my-4">About</p>
      <div className="flex flex-col space-y-2.5 mx-5">
        <p className="">
          Go Phish is an online song-guessing game in which users compete to correctly predict the most songs that will
          be played at a Phish show.
        </p>
        <p className="">
          On any particular night, you can submit up to 10 guesses - 9 regular guesses and one &apos;encore&apos; slot.
          Points are based on the frequency (average gap) of the songs, awarding more points for more uncommon songs. A
          guess in the &apos;encore&apos; slot receives 3 additional bonus points if the song was played as an encore.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
