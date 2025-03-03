import CloseIcon from '@/media/CloseIcon.svg';
import React, { useState } from 'react';
import Modal from 'react-modal';
import SongSuggestModal from '../SongSuggestModal';

Modal.setAppElement('#__next');

const HelpText = ({ close }: { close: () => void }) => (
  <div className="flex justify-center items-center space-x-1 mt-2.5">
    <p className="text-center opacity-50">(Click on an open slot to input your guess)</p>
    <div className="cursor-pointer" onClick={close}>
      <CloseIcon width={16} height={16} className="fill-black opacity-50" />
    </div>
  </div>
);

const MissingText = ({ open, close }: { open: () => void; close: () => void }) => (
  <div className="flex justify-center items-center space-x-1 mt-2.5">
    <p className="text-center cursor-pointer opacity-50" onClick={open}>
      Missing a Song?
    </p>
    <div className="cursor-pointer" onClick={close}>
      <CloseIcon width={16} height={16} className="fill-black opacity-50 cursor-pointer" />
    </div>
  </div>
);

const GuessEditorTools: React.FC = () => {
  const [suggestModalOpen, setModalOpen] = useState(false);
  const [helpTextOpen, setHelpTextOpen] = useState(true);
  const [missingTextOpen, setMissingTextOpen] = useState(true);

  return (
    <>
      {helpTextOpen && <HelpText close={() => setHelpTextOpen(false)} />}
      {missingTextOpen && <MissingText open={() => setModalOpen(true)} close={() => setMissingTextOpen(false)} />}
      <Modal
        isOpen={suggestModalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Song Suggestion"
        style={{ content: { top: '62px', left: '12px', right: '12px', bottom: '12px' } }}
      >
        <SongSuggestModal close={() => setModalOpen(false)} />
      </Modal>
    </>
  );
};

export default GuessEditorTools;
