import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'flowbite-react';
import { HiExclamationCircle } from 'react-icons/hi';

interface ConfirmModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  show,
  onClose,
  onConfirm,
  title = "Apakah kamu yakin?",
  message = "Tindakan ini tidak dapat dibatalkan.",
  confirmText = "Ya, Hapus",
  cancelText = "Batal",
  isDanger = true,
}) => {
  return (
    <Modal 
      show={show} 
      size="md" 
      onClose={onClose} 
      popup
      theme={{
        root: {
          show: {
            on: "flex backdrop-blur-md bg-purple-900/20",
            off: "hidden"
          }
        }
      }}
    >
      <ModalHeader />
      <ModalBody>
        <div className="text-center px-4 pb-4">
          <div className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full ${isDanger ? 'bg-red-50 text-red-500' : 'bg-purple-50 text-purple-500'}`}>
             <HiExclamationCircle className="h-10 w-10" />
          </div>
          
          <h3 className="mb-2 text-xl font-black text-gray-800 tracking-tight">
            {title}
          </h3>
          <p className="mb-8 text-sm font-medium text-gray-500 leading-relaxed">
            {message}
          </p>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`w-full py-3 rounded-2xl text-sm font-bold text-white transition-all shadow-lg active:scale-95 ${
                isDanger 
                ? 'bg-red-500 hover:bg-red-600 shadow-red-100' 
                : 'bg-purple-600 hover:bg-purple-700 shadow-purple-100'
              }`}
            >
              {confirmText}
            </button>

            <button 
              onClick={onClose} 
              className="w-full py-3 rounded-2xl text-sm font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ConfirmModal;