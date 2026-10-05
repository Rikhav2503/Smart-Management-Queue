import React, { useState } from 'react';
import { Card, Button, Badge } from '@careflow/shared';

export const Roster = () => {
  const doctors = [
    { id: 'doc_1', name: 'Dr. Smith (Cardio)' },
    { id: 'doc_2', name: 'Dr. Jones (Ortho)' },
    { id: 'doc_3', name: 'Dr. Lee (Peds)' }
  ];

  const rooms = ['Room 1', 'Room 2', 'Room 3'];
  const times = ['09:00', '10:00', '11:00', '12:00'];

  const [schedule, setSchedule] = useState<any>({});
  
  const handleDragStart = (e: React.DragEvent, docId: string) => {
    e.dataTransfer.setData('docId', docId);
  };

  const handleDrop = (e: React.DragEvent, room: string, time: string) => {
    const docId = e.dataTransfer.getData('docId');
    const key = `${room}-${time}`;
    
    // Conflict detection: Is doc already booked at this time?
    const isConflict = Object.entries(schedule).some(([k, v]) => k.includes(time) && v === docId);
    if (isConflict) {
      alert('Conflict: Doctor is already scheduled at this time!');
      return;
    }
    
    setSchedule({ ...schedule, [key]: docId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Doctor Roster & OPD Planner</h1>
        <Button variant="outline">Copy last week</Button>
      </div>

      <div className="flex space-x-6 flex-1 overflow-hidden">
        <div className="w-64 space-y-3 shrink-0">
          <Card className="p-4 bg-slate-100 dark:bg-slate-800">
            <h3 className="font-bold mb-4">Available Doctors</h3>
            <div className="space-y-2">
              {doctors.map(d => (
                <div 
                  key={d.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, d.id)}
                  className="p-3 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-700 rounded-xl cursor-move hover:border-teal-500"
                >
                  {d.name}
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0 z-10">
              <tr>
                <th className="p-4 border-b">Room / Time</th>
                {times.map(t => <th key={t} className="p-4 border-b w-32">{t}</th>)}
              </tr>
            </thead>
            <tbody>
              {rooms.map(r => (
                <tr key={r} className="border-b dark:border-slate-800">
                  <td className="p-4 font-bold bg-slate-50 dark:bg-slate-900/50">{r}</td>
                  {times.map(t => {
                    const key = `${r}-${t}`;
                    const docId = schedule[key];
                    const docName = doctors.find(d => d.id === docId)?.name;
                    return (
                      <td 
                        key={t} 
                        className="p-2 border-r dark:border-slate-800"
                        onDrop={(e) => handleDrop(e, r, t)}
                        onDragOver={handleDragOver}
                      >
                        <div className="h-16 rounded-lg bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center relative hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors">
                          {docName ? (
                            <div className="absolute inset-1 bg-teal-100 dark:bg-teal-900/50 rounded flex items-center justify-center text-teal-800 dark:text-teal-200 text-xs text-center font-medium p-1 cursor-pointer">
                              {docName}
                            </div>
                          ) : (
                            <span className="text-slate-300 text-xs">Drop here</span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
