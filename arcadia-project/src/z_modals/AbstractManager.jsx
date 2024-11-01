import React, { useState } from 'react';
import ModifyAbstract from './ModifyAbstract'; // Assuming the ModifyAbstract component is in the same directory
import ViewAbstract from './ViewAbstract'; // Assuming the ViewAbstract component is in the same directory

const AbstractManager = () => {
  const [isModifyOpen, setModifyOpen] = useState(false);
  const [isViewOpen, setViewOpen] = useState(false);
  const [abstractContent, setAbstractContent] = useState("Lorem ipsum dolor sit amet."); // Initial abstract content

  const handleModify = (newAbstract) => {
    setAbstractContent(newAbstract); // Update abstract content on modify
    setModifyOpen(false); // Close the ModifyAbstract modal
  };

  return (
    <div>
      <button onClick={() => setModifyOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded-md">Modify Abstract</button>
      <button onClick={() => setViewOpen(true)} className="px-4 py-2 bg-green-500 text-white rounded-md ml-2">View Abstract</button>

      <ModifyAbstract
        isOpen={isModifyOpen}
        onClose={() => setModifyOpen(false)}
        onModify={handleModify} // Pass the handleModify function to the ModifyAbstract
      />
      
      <ViewAbstract
        isOpen={isViewOpen}
        onClose={() => setViewOpen(false)}
        abstractContent={abstractContent} // Pass the current abstract content to ViewAbstract
      />
    </div>
  );
};

export default AbstractManager;
