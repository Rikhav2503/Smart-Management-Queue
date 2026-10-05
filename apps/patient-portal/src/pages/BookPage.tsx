import React, { useState } from 'react';
import { Card, Badge, Button } from '@careflow/shared';

export const BookPage = () => {
  const [selectedDoctor, setSelectedDoctor] = useState('doc_1');
  
  // Dummy heatmap data
  const slots = [
    { time: '09:00 AM', crowd: 'QUIET', recommended: false },
    { time: '09:30 AM', crowd: 'MODERATE', recommended: false },
    { time: '10:00 AM', crowd: 'BUSY', recommended: false },
    { time: '10:30 AM', crowd: 'BUSY', recommended: false },
    { time: '11:00 AM', crowd: 'QUIET', recommended: true },
    { time: '11:30 AM', crowd: 'MODERATE', recommended: false },
  ];

  const [booked, setBooked] = useState(false);

  if (booked) {
    return (
      <Card className="text-center p-8 space-y-4">
        <div className="mx-auto w-48 h-48 bg-slate-100 flex items-center justify-center rounded-2xl border-4 border-teal-500">
          <p className="text-slate-400 font-mono">QR_PASS_123</p>
        </div>
        <h2 className="text-2xl font-bold text-teal-600">Booking Confirmed!</h2>
        <p className="text-slate-500">Show this QR pass at the kiosk or scan it for virtual check-in.</p>
        <Button onClick={() => setBooked(false)} variant="outline">Book Another</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Select Doctor</h2>
        <select 
          className="mt-2 block w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
          value={selectedDoctor}
          onChange={e => setSelectedDoctor(e.target.value)}
        >
          <option value="doc_1">Dr. Demo (Cardiology)</option>
          <option value="doc_2">Dr. Doc 1 (Orthopedics)</option>
        </select>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Availability Heatmap</h2>
        <div className="grid grid-cols-2 gap-3">
          {slots.map((s, i) => (
            <Card 
              key={i} 
              className={`p-3 cursor-pointer hover:border-teal-500 transition-colors relative ${s.recommended ? 'ring-2 ring-teal-500' : ''}`}
              onClick={() => setBooked(true)}
            >
              {s.recommended && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-500 text-white text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap">
                  Best Time
                </span>
              )}
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">{s.time}</span>
                <span className={`w-3 h-3 rounded-full ${
                  s.crowd === 'QUIET' ? 'bg-teal-400' : 
                  s.crowd === 'MODERATE' ? 'bg-yellow-400' : 'bg-coral-500'
                }`} />
              </div>
            </Card>
          ))}
        </div>
      </div>
      <div className="flex items-center space-x-4 text-xs text-slate-500 justify-center pt-4">
        <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-teal-400 mr-1"/> Quiet</span>
        <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-yellow-400 mr-1"/> Moderate</span>
        <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-coral-500 mr-1"/> Busy</span>
      </div>
    </div>
  );
};
