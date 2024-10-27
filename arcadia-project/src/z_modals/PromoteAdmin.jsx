import React from 'react';

const PromoteAdminModal = ({ isOpen, onClose, accountName, onPromote }) => {
  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="flex overflow-hidden flex-col justify-center px-2.5 py-4 text-base rounded-3xl border border-solid bg-neutral-50 border-zinc-300 max-w-[500px] relative">
        <div className="flex gap-10 justify-between items-center px-2.5 w-full text-2xl whitespace-nowrap max-md:max-w-full">
          <div className="flex gap-2.5 items-center self-stretch my-auto min-w-[240px] w-[247px]">
            <div
              aria-hidden="true"
              className="flex-1 self-stretch my-auto text-center bg-red-400 rounded-xl h-[35px] min-h-[35px] text-neutral-50 w-[35px]"
            >
              !
            </div>
            <h2 
              id="attention-heading"
              className="self-stretch my-auto font-medium text-zinc-900"
            >
              Attention!
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
          >
            <img 
              loading="lazy" 
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/d5661593df255d4f4a81fe80cfb2dbcfaeb6c6f95c0dfa4c2d994043073bceb4?placeholderIfAbsent=true&apiKey=620028e28bca4cb69d65313d900a8f5f" 
              alt=""
              className="w-full h-full"
            />
          </button>
        </div>

        <div className="flex overflow-hidden flex-col justify-center p-2.5 mt-6 w-full font-medium text-black rounded-2xl max-md:max-w-full">
          <div 
            id="promotion-description"
            className="overflow-hidden w-full max-md:max-w-full"
          >
            You are about to turn {accountName} into a system admin account. 
            This will result in their full access to the system. 
            You may rescind this action in the future. Are you sure about this?
          </div>
        </div>

        <div className="flex gap-6 justify-center items-center mt-6 w-full font-medium text-center min-h-[50px] text-zinc-900 max-md:max-w-full">
          <button
            onClick={onClose}
            className="overflow-hidden gap-2.5 self-stretch px-2.5 py-1.5 my-auto border border-solid border-zinc-900 rounded-[40px] w-[175px]"
          >
            Go back
          </button>
          <button
            onClick={onPromote}
            className="overflow-hidden gap-2.5 self-stretch px-2.5 py-1.5 my-auto whitespace-nowrap border border-solid border-zinc-900 rounded-[40px] w-[175px]"
          >
            Promote
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoteAdminModal;
