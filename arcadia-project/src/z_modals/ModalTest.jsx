import React, { useState } from 'react';
import ResearchUploadModal from './ResearchUploadModal';
import  BookCopiesTableModal from './BookCopies';
import PromoteAdmin from './PromoteAdmin';
import WrngRmvRsrchInv from './warning-modals/WrngRmvRsrchInv';
import WrngOverwriting from './warning-modals/WrngOverwriting';
import WrngDemote from './warning-modals/WrngDemote';
import CnfrmTest from './confirmation-modals/CnfrmBlacklist';
import CnfrmWhitelist from './confirmation-modals/CnfrmWhitelist';
import CnfrmSave from './confirmation-modals/CnfrmSave';
import PromoteToIntern from './attention-modals/PromoteToIntern';
import PromoteToSuperadmin from './attention-modals/PromoteToSuperadmin';
import DeleteSupadminAcc from './attention-modals/DeleteSupadminAcc';
import BookingReservation from './BookingReservation';
import UserAccount from './UserAccount';
import AdminAccount from './AdminAccount';

function ModalTest() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)} className="btn">
        Open Research Upload Modal
      </button>
      <AdminAccount isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default ModalTest;
