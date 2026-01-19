import React, { useState } from 'react';
import { Modal, Button, TextInput, Label, ModalBody, ModalHeader } from 'flowbite-react';
import { HiPlus } from 'react-icons/hi';
import { apiService } from '../api/endpoints';

interface Props {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const HabitModal: React.FC<Props> = ({ show, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await apiService.createHabit(title);
      setTitle(''); 
      onSuccess();  
      onClose();    
    } catch (err) {
      console.error("Gagal membuat habit:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      show={show} 
      onClose={onClose} 
      size="md" 
      popup 
      root={document.body}
      className="backdrop-blur-md bg-purple-200/20"
    >
      <ModalHeader className="rounded-t-3xl" />
      <ModalBody className="rounded-b-3xl bg-white">
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-200">
              <HiPlus className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-black text-gray-800 tracking-tight">New Habit</h3>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mt-1">Langkah kecil menuju perubahan besar</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="habitTitle" className="text-xs font-bold text-gray-500 uppercase ml-1" />
            </div>
            <TextInput
              id="habitTitle"
              placeholder="Contoh: Meditasi pagi"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              shadow
              className="overflow-hidden rounded-xl border-none"
              theme={{
                field: {
                  input: {
                    colors: {
                      purple: "bg-gray-50 border-gray-200 text-gray-900 focus:border-purple-500 focus:ring-purple-500",
                    }
                  }
                }
              }}
              color="purple"
            />
          </div>

          <div className="flex flex-col gap-3 mt-8">
            <Button 
              type="submit" 
              className="bg-purple-600 hover:bg-purple-700 border-none h-12 text-md font-bold shadow-lg shadow-purple-100" 
            //   isProcessing={loading}
            >
              Mulai Kebiasaan Baru
            </Button>
            <button 
              type="button"
              onClick={onClose}
              className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors py-2"
            >
              Nanti saja
            </button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default HabitModal;