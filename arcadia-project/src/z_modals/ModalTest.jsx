import React, { useState } from 'react';
import ResearchUploadModal from './ResearchUploadModal';
import  BookCopiesTableModal from './BookCopies';
import PromoteAdmin from './PromoteAdmin';

function ModalTest() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)} className="btn">
        Open Research Upload Modal
      </button>
      <PromoteAdmin isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default ModalTest;
