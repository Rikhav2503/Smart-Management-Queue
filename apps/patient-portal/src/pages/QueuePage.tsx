import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Modal, mockApi, subscribe } from '@careflow/shared';

export const QueuePage = () => {
  const [ticket, setTicket] = useState<any>(null);
  const [scanning, setScanning] = useState(false);
  const [code, setCode] = useState('');
  
  // Dummy swap / reassign state
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [reassignPrompt, setReassignPrompt] = useState(false);

  useEffect(() => {
    // Listen for live updates
    const unsub = subscribe((e) => {
      if (e.type === 'ticket:updated' && ticket && e.payload.id === ticket.id) {
        setTicket(e.payload);
      }
      if (e.type === 'reassign:proposed') {
        setReassignPrompt(true);
      }
    });
    return unsub;
  }, [ticket]);

  const joinQueue = async () => {
    setScanning(true);
    // Simulate scan and join
    setTimeout(async () => {
      const t = await mockApi.tickets.join({
        campusId: 'c_1',
        serviceId: 's_opd_cardio',
        patientId: 'u_patient',
        source: 'REMOTE',
        tier: 'STANDARD'
      } as any);
      setTicket(t);
      setScanning(false);
    }, 1000);
  };

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Virtual Check-in</h2>
        <div className="w-48 h-48 border-4 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl flex items-center justify-center bg-slate-50 dark:bg-slate-900">
          {scanning ? <div className="w-48 h-2 bg-teal-400 animate-[scan_2s_ease-in-out_infinite]" /> : <span className="text-slate-400">Scan QR</span>}
        </div>
        <div className="flex space-x-2 w-full max-w-xs">
          <input 
            className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            placeholder="Or enter Code"
            value={code}
            onChange={e => setCode(e.target.value)}
          />
          <Button onClick={joinQueue} isLoading={scanning}>Join</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 text-center space-y-4 bg-gradient-to-br from-teal-500 to-teal-700 text-white border-0 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-white/20" />
        <Badge className="bg-white/20 text-white border-0">WAITING</Badge>
        <h1 className="text-5xl font-black">{ticket.code}</h1>
        <p className="text-teal-100">Token Number</p>
        
        <div className="flex justify-between pt-4 border-t border-teal-400/30">
          <div>
            <p className="text-sm text-teal-100">People Ahead</p>
            <p className="text-2xl font-bold">5</p>
          </div>
          <div>
            <p className="text-sm text-teal-100">Est. Time</p>
            <p className="text-2xl font-bold">45m</p>
          </div>
        </div>
      </Card>

      {/* FR-5: Readiness Score */}
      <Card className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100">Readiness Score</h3>
          <p className="text-xs text-slate-500">Complete prep items to speed up</p>
        </div>
        <div className="w-12 h-12 rounded-full border-4 border-teal-500 flex items-center justify-center font-bold text-sm text-teal-600">
          {ticket.readinessScore}%
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" onClick={() => setShowSwapModal(true)}>Spot Swap</Button>
        <Button variant="outline" onClick={() => setTicket(null)}>Leave Queue</Button>
      </div>

      {/* FR-4 Spot Swap Modal */}
      <Modal isOpen={showSwapModal} onClose={() => setShowSwapModal(false)}>
        <div className="p-6 space-y-4">
          <h3 className="font-bold text-lg">Request Spot Swap</h3>
          <p className="text-sm text-slate-500">Swap your ticket with someone willing to wait.</p>
          <Card className="flex justify-between items-center p-3">
            <div>
              <p className="font-bold">Token A012</p>
              <p className="text-xs text-slate-500">2 ahead of you</p>
            </div>
            <Button size="sm" onClick={() => setShowSwapModal(false)}>Ask to Swap</Button>
          </Card>
        </div>
      </Modal>

      {/* FR-3 Reassign Prompt */}
      {reassignPrompt && (
        <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900">
          <h3 className="font-bold text-yellow-800 dark:text-yellow-400">Doctor Delay</h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-500 mt-1 mb-3">Your doctor is delayed. Would you like to switch to Dr. Smith (0 wait time)?</p>
          <div className="flex space-x-2">
            <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 border-0" onClick={() => setReassignPrompt(false)}>Accept Switch</Button>
            <Button size="sm" variant="ghost" onClick={() => setReassignPrompt(false)}>Keep Waiting</Button>
          </div>
        </Card>
      )}
    </div>
  );
};
