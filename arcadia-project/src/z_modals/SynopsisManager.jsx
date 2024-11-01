import React, { useState } from 'react';
import ModifySynopsis from './ModifySynopsis'; // Assuming the ModifySynopsis component is in the same directory
import ViewSynopsis from './ViewSynopsis'; // Assuming the ViewSynopsis component is in the same directory

const SynopsisManager = () => {
  const [isModifyOpen, setModifyOpen] = useState(false);
  const [isViewOpen, setViewOpen] = useState(false);
  const [synopsisContent, setSynopsisContent] = useState("Lorem ipsum dolor sit amet."); // Initial synopsis content

  const handleModify = (newSynopsis) => {
    setSynopsisContent(newSynopsis); // Update synopsis content on modify
    setModifyOpen(false); // Close the ModifySynopsis modal
  };

  return (
    <div>
      <button onClick={() => setModifyOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded-md">Modify Synopsis</button>
      <button onClick={() => setViewOpen(true)} className="px-4 py-2 bg-green-500 text-white rounded-md ml-2">View Synopsis</button>

      <ModifySynopsis
        isOpen={isModifyOpen}
        onClose={() => setModifyOpen(false)}
        onModify={handleModify} // Pass the handleModify function to the ModifySynopsis
      />
      
      <ViewSynopsis
        isOpen={isViewOpen}
        onClose={() => setViewOpen(false)}
        synopsisContent={synopsisContent} // Pass the current synopsis content to ViewSynopsis
      />
    </div>
  );
};

export default SynopsisManager;
