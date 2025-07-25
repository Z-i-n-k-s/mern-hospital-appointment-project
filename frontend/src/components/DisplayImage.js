import React from 'react';
import { CgClose } from "react-icons/cg";

const DisplayImage = ({ imgUrl, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white rounded shadow-lg p-4 max-w-[90vw] max-h-[90vh]">
        <button
          className="absolute top-2 right-2 text-2xl text-gray-600 hover:text-red-600"
          onClick={onClose}
        >
          <CgClose />
        </button>

        <div className="flex justify-center items-center w-full h-full overflow-auto">
          <img
            src={imgUrl}
            alt="Full view"
            className="max-w-full max-h-[80vh] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default DisplayImage;
