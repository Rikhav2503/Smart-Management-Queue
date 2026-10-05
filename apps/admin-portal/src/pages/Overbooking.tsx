import React, { useState } from 'react';
import { Card, Button, Badge } from '@careflow/shared';

export const Overbooking = () => {
  const [reservePct, setReservePct] = useState(10);
  
  const slots = [
    { id: 1, doc: 'Dr. Smith', time: '09:00', risk: 8, suggestion: 1, accepted: false },
    { id: 2, doc: 'Dr. Smith', time: '10:00', risk: 25, suggestion: 2, accepted: false },
    { id: 3, doc: 'Dr. Jones', time: '11:00', risk: 15, suggestion: 1, accepted: true },
  ];

  const [data, setData] = useState(slots);

  const handleAccept = (id: number) => {
    setData(data.map(d => d.id === id ? { ...d, accepted: true } : d));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">Smart Overbooking</h1>
      
      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2 p-6">
          <h2 className="text-xl font-bold mb-4">No-Show Predictor (Next 48h)</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="pb-2">Doctor</th>
                <th className="pb-2">Time</th>
                <th className="pb-2">No-Show Risk</th>
                <th className="pb-2">Suggested Overbook</th>
                <th className="pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map(d => (
                <tr key={d.id} className="border-b dark:border-slate-800">
                  <td className="py-3 font-medium">{d.doc}</td>
                  <td className="py-3">{d.time}</td>
                  <td className="py-3">
                    <Badge variant={d.risk > 20 ? 'destructive' : d.risk > 10 ? 'warning' : 'default'}>{d.risk}%</Badge>
                  </td>
                  <td className="py-3">+{d.suggestion} slots</td>
                  <td className="py-3">
                    {d.accepted ? (
                      <Badge variant="success">Applied</Badge>
                    ) : (
                      <Button size="sm" onClick={() => handleAccept(d.id)}>Accept</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Walk-in Reserve</h2>
          <p className="text-sm text-slate-500 mb-4">Set percentage of slots to keep open for walk-ins per day.</p>
          <div className="flex items-center space-x-4 mb-4">
            <input 
              type="range" 
              min="0" max="30" 
              value={reservePct} 
              onChange={e => setReservePct(Number(e.target.value))} 
              className="flex-1 accent-teal-500"
            />
            <span className="font-bold text-teal-600">{reservePct}%</span>
          </div>
          <Card className="bg-slate-50 dark:bg-slate-900 border-0 p-4">
            <h4 className="font-bold text-sm mb-2">Impact Preview</h4>
            <div className="text-xs text-slate-500 flex justify-between mb-1">
              <span>Expected Walk-ins:</span> <span className="font-bold">~42</span>
            </div>
            <div className="text-xs text-slate-500 flex justify-between">
              <span>Reserved Slots:</span> <span className="font-bold">{Math.floor(200 * (reservePct/100))}</span>
            </div>
          </Card>
        </Card>
      </div>
    </div>
  );
};
