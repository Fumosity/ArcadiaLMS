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

import AdminAccount from './AccountModifier';
import PrintReport from './PrintReport';
import ModifySchedule from './ModifySchedule';
import AddEvents from './AddEvents';
import RemoveEvent from './RemoveEvent';
import ModifyEvents from './ModifyEvents';
import UpdateProfilePic from './UpdateProfilePic';
import BookCopies from './BookCopies';

function ModalTest() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)} className="btn">
        Open Research Upload Modal
      </button>
      <BookCopies isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default ModalTest;
