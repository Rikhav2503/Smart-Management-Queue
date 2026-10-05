import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, mockApi, subscribe, Ticket } from '@careflow/shared';

export const ReceptionWorkspace = () => {
  const [queues, setQueues] = useState<any>({
    EMERGENCY: [], SENIOR: [], MATERNITY: [], ACCESSIBLE: [], STANDARD: []
  });

  const loadQueues = () => {
    mockApi.queue.getAllByLane().then(setQueues);
  };

  useEffect(() => {
    loadQueues();
    const unsub = subscribe((e) => {
      if (e.type === 'ticket:updated' || e.type === 'ticket:created') {
        loadQueues();
      }
    });
    return unsub;
  }, []);

  const handleWalkIn = async () => {
    const phone = prompt('Enter 10-digit phone number:');
    if (phone && phone.length === 10) {
      await mockApi.tickets.join({
        campusId: 'c_1', serviceId: 's_opd_cardio', patientId: `u_${phone}`, source: 'KIOSK', tier: 'STANDARD'
      } as any);
    }
  };

  const markNoShow = async (id: string) => {
    await mockApi.tickets.updateStatus(id, 'NO_SHOW');
  };

  const tagTier = async (id: string, tier: any) => {
    if (tier === 'EMERGENCY') {
      const reason = prompt('Reason for EMERGENCY?');
      if (!reason) return;
    }
    await mockApi.tickets.updateTier(id, tier);
  };

  const lanes = ['EMERGENCY', 'SENIOR', 'MATERNITY', 'ACCESSIBLE', 'STANDARD'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Reception Workspace</h1>
        <div className="flex space-x-4">
          <Card className="px-4 py-2 flex items-center space-x-2">
            <span className="text-sm text-slate-500">Fairness Meter</span>
            <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-teal-500" style={{ width: '85%' }} />
            </div>
            <span className="font-bold text-teal-600">85%</span>
          </Card>
          <Button onClick={handleWalkIn}>+ Register Walk-In</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {lanes.map(lane => (
          <Card key={lane} className="bg-slate-100/50 dark:bg-slate-800/50 flex flex-col h-[calc(100vh-140px)]">
            <div className="p-3 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 flex justify-between">
              {lane} <Badge>{queues[lane]?.length || 0}</Badge>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {queues[lane]?.map((t: Ticket) => {
                // simulate "aged + 1" logic display
                const isAged = t.tier !== 'EMERGENCY' && t.tier !== 'STANDARD' && Math.random() > 0.7; 
                return (
                  <Card key={t.id} className="p-3 shadow-sm hover:border-teal-500 cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-black text-lg">{t.code}</h4>
                      {isAged && <Badge variant="warning">aged +1</Badge>}
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mb-3">
                      <span>Wait: {Math.floor((Date.now() - t.joinedAt) / 60000)}m</span>
                      <span className={t.status === 'CALLED' ? 'text-teal-600 font-bold' : ''}>{t.status}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost" className="flex-1 text-[10px]" onClick={() => markNoShow(t.id)}>No Show</Button>
                      <select 
                        className="flex-1 text-[10px] p-1 border rounded"
                        value={t.tier}
                        onChange={(e) => tagTier(t.id, e.target.value)}
                      >
                        {lanes.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                  </Card>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
