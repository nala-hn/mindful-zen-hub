import React, { useState, useEffect } from 'react';
import { Button, Textarea } from 'flowbite-react';
import { HiSparkles, HiPencilAlt } from 'react-icons/hi';
import { format } from 'date-fns';
import { apiService } from '../api/endpoints';

interface Props {
  selectedDate: Date;
}

const GratitudeJournal: React.FC<Props> = ({ selectedDate }) => {
  const [journalData, setJournalData] = useState<any>(null);
  const [tempContent, setTempContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchJournal = async () => {
    setLoading(true);
    try {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const response = await apiService.getGratitude(dateString);
      const rawData = response.data?.data;
      const data = Array.isArray(rawData) ? rawData[0] : rawData;
      
      if (data && data.content) {
        setJournalData(data);
        setTempContent(data.content);
        setIsEditing(false); 
      } else {
        setJournalData(null);
        setTempContent('');
        setIsEditing(true); 
      }
    } catch (err) {
      console.error("Gagal ambil jurnal:", err);
      setJournalData(null);
      setIsEditing(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournal();
  }, [selectedDate]);

  const handleSave = async () => {
    if (!tempContent.trim()) return;
    setLoading(true);
    try {
      if (journalData?.id) {
        await apiService.updateGratitude(journalData.id, tempContent);
      } else {
        await apiService.createGratitude(tempContent);
      }
      
      setIsEditing(false);
      await fetchJournal(); 
    } catch (err) {
      console.error("Gagal menyimpan:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !journalData && !tempContent) {
    return (
      <div className="mt-8 p-12 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 mt-8 transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 rounded-2xl text-amber-500">
            <HiSparkles className="text-2xl" />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-800 tracking-tight">Gratitude Journal</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Syukur hari ini</p>
          </div>
        </div>
        
        {journalData && !isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-xl font-bold text-xs hover:bg-amber-100 transition-all"
          >
            <HiPencilAlt /> EDIT
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <Textarea
            placeholder="Hari ini aku bersyukur karena..."
            value={tempContent}
            onChange={(e) => setTempContent(e.target.value)}
            rows={4}
            className="bg-gray-50 border-none focus:ring-2 focus:ring-amber-200 rounded-[1.5rem] p-6 text-gray-700 font-medium leading-relaxed italic"
          />
          <div className="flex justify-end gap-3">
             {journalData && (
                <button 
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setTempContent(journalData.content);
                  }} 
                  className="px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-gray-600"
                >
                  Batal
                </button>
             )}
             <Button 
                onClick={handleSave}
                disabled={loading}
                className="bg-amber-400 hover:bg-amber-500 border-none text-white font-bold rounded-xl px-8 shadow-lg shadow-amber-100"
              >
                {loading ? 'Menyimpan...' : 'Simpan'}
              </Button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-[1.8rem] p-8 border border-amber-100/50 relative">
          <span className="absolute -top-4 -left-2 text-5xl text-amber-200 font-serif opacity-50">“</span>
          <p className="text-lg font-bold text-gray-800 leading-relaxed italic px-6 py-2">
            {journalData?.content}
          </p>
          <span className="absolute -bottom-6 -right-2 text-5xl text-amber-200 font-serif opacity-50">”</span>
        </div>
      )}
    </div>
  );
};

export default GratitudeJournal;