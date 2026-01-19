import React from 'react';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import { id } from 'date-fns/locale';

interface CalendarStripProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const CalendarStrip: React.FC<CalendarStripProps> = ({ selectedDate, onDateChange }) => {
  const dates = Array.from({ length: 15 }, (_, i) => addDays(subDays(new Date(), 7), i));

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
      {dates.map((date) => {
        const isActive = isSameDay(date, selectedDate);
        const isToday = isSameDay(date, new Date());

        return (
          <button
            key={date.toString()}
            onClick={() => onDateChange(date)}
            className={`flex flex-col items-center min-w-[65px] p-3 rounded-2xl transition-all snap-center
              ${isActive 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-200 scale-105' 
                : 'bg-white text-gray-500 hover:bg-purple-50'
              }
              ${isToday && !isActive ? 'border-2 border-purple-200' : ''}
            `}
          >
            <span className="text-[10px] uppercase font-bold tracking-wider">
              {format(date, 'EEE', { locale: id })}
            </span>
            <span className="text-xl font-bold">
              {format(date, 'd')}
            </span>
            {isToday && <div className={`w-1 h-1 rounded-full mt-1 ${isActive ? 'bg-white' : 'bg-purple-600'}`}></div>}
          </button>
        );
      })}
    </div>
  );
};

export default CalendarStrip;