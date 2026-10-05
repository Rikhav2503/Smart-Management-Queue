import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, mockApi, subscribe, Ticket, ReassignProposal } from '@careflow/shared';
import { useStaffStore } from '../stores/useStaffStore';

export const DoctorWorkspace = () => {
  const user = useStaffStore(s => s.user);
  const [queue, setQueue] = useState<Ticket[]>([]);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [status, setStatus] = useState<any>('AVAILABLE');
  const [proposals, setProposals] = useState<ReassignProposal[]>([]);
  const [timer, setTimer] = useState(0);
  const [noteMacro, setNoteMacro] = useState('');

  const avgConsult = 15 * 60; // 15 mins in seconds

  const loadData = () => {
    if (!user) return;
    mockApi.tickets.listActive(user.id).then(tickets => {
      const active = tickets.find(t => t.status === 'SERVING');
      if (active) setActiveTicket(active);
      else setActiveTicket(null);
      setQueue(tickets.filter(t => t.status === 'WAITING' || t.status === 'CALLED'));
    });
    mockApi.reassignProposals.list(user.id).then(setProposals);
  };

  useEffect(() => {
    loadData();
    const unsub = subscribe((e) => {
      if (e.type === 'ticket:updated' || e.type === 'reassign:proposed') {
        loadData();
      }
    });
    return unsub;
  }, [user]);

  useEffect(() => {
    let interval: any;
    if (activeTicket && activeTicket.status === 'SERVING') {
      interval = setInterval(() => {
        setTimer(Math.floor((Date.now() - activeTicket.startedAt!) / 1000));
      }, 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [activeTicket]);

  const callNext = async () => {
    if (!user) return;
    // Optimistic UI
    const q = [...queue];
    if (q.length > 0) {
      const next = q[0];
      next.status = 'CALLED';
      setQueue(q);
      try {
        await mockApi.tickets.callNext(user.id);
      } catch (err) {
        // Rollback on failure
        loadData();
      }
    }
  };

  const completeConsult = async (outcome: any) => {
    if (!activeTicket) return;
    await mockApi.tickets.completeConsult(activeTicket.id, outcome, noteMacro);
    setNoteMacro('');
    setActiveTicket(null);
  };

  const toggleStatus = async (newStatus: string) => {
    if (!user) return;
    setStatus(newStatus);
    if (newStatus !== 'AVAILABLE') {
      prompt('Enter handover note:');
    }
    await mockApi.doctorStatus.setStatus(user.id, newStatus as any);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'n' || e.key === 'N') callNext();
      if (e.key === 'b' || e.key === 'B') toggleStatus('BREAK');
      if (e.key === 'c' || e.key === 'C') {
         if (activeTicket) completeConsult('COMPLETED');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [queue, activeTicket]);

  const progressPct = Math.min((timer / avgConsult) * 100, 100);
  const isAmber = timer > avgConsult * 0.8;
  const isRed = timer > avgConsult;

  return (
    <div className="p-6 h-screen flex flex-col space-y-6">
      {/* Header Stats */}
      <header className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold">Dr. {user?.name}</h1>
          <p className="text-sm text-slate-500">Consults Today: 12 • Avg: 14m</p>
        </div>
        <div className="flex space-x-4 items-center">
          <Badge>Queue: {queue.length}</Badge>
          <select 
            value={status} 
            onChange={(e) => toggleStatus(e.target.value)}
            className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm border-0 focus:ring-2 focus:ring-teal-500"
          >
            <option value="AVAILABLE">Available</option>
            <option value="ROUNDS">On Rounds</option>
            <option value="OT">In OT</option>
            <option value="BREAK">Break</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </header>

      <div className="flex-1 flex space-x-6 overflow-hidden">
        {/* Main Console */}
        <div className="flex-1 flex flex-col space-y-6 overflow-y-auto pr-2">
          {activeTicket ? (
            <Card className="p-6 border-2 border-teal-500 shadow-md">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-4xl font-black text-slate-800 dark:text-slate-100">{activeTicket.code}</h2>
                  <Badge className="mt-2" variant="success">IN PROGRESS</Badge>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-mono tabular-nums mb-1">
                    {Math.floor(timer / 60).toString().padStart(2, '0')}:{(timer % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${isRed ? 'bg-coral-500' : isAmber ? 'bg-yellow-400' : 'bg-teal-500'}`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <Card className="p-4 bg-slate-50 dark:bg-slate-800 border-0">
                  <h4 className="font-bold mb-2">Readiness Score</h4>
                  <div className="text-2xl font-bold text-teal-600">{activeTicket.readinessScore}%</div>
                </Card>
                <Card className="p-4 bg-slate-50 dark:bg-slate-800 border-0">
                  <h4 className="font-bold mb-2">Prep Checklist</h4>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center text-teal-600">✓ Documents</li>
                    <li className="flex items-center text-teal-600">✓ Fasting</li>
                    <li className="flex items-center text-slate-400">○ Insurance</li>
                  </ul>
                </Card>
              </div>

              <div className="space-y-4">
                <select 
                  className="w-full p-3 border rounded-xl"
                  value={noteMacro}
                  onChange={e => setNoteMacro(e.target.value)}
                >
                  <option value="">Select quick note...</option>
                  <option value="Normal findings.">Normal findings.</option>
                  <option value="Advised rest and hydration.">Advised rest.</option>
                  <option value="Prescribed antibiotics.">Prescribed meds.</option>
                </select>
                <div className="flex space-x-3">
                  <Button className="flex-1" onClick={() => completeConsult('COMPLETED')}>Complete (C)</Button>
                  <Button className="flex-1 bg-yellow-500 hover:bg-yellow-600" onClick={() => completeConsult('FOLLOW_UP')}>Follow-up</Button>
                  <Button className="flex-1 bg-slate-500 hover:bg-slate-600" onClick={() => completeConsult('LAB_ORDERED')}>Order Lab</Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <p className="text-slate-500 mb-4">No active consultation.</p>
              <Button size="lg" onClick={callNext} disabled={queue.length === 0}>
                Call Next (N)
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-80 flex flex-col space-y-6">
          <Card className="flex-1 flex flex-col">
            <div className="p-4 border-b font-bold">Waiting Queue</div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {queue.map((t, idx) => (
                <div key={t.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div>
                    <span className="font-bold">{t.code}</span>
                    <p className="text-xs text-slate-500">Wait: {Math.floor((Date.now() - t.joinedAt) / 60000)}m</p>
                  </div>
                  {idx === 0 && t.status === 'CALLED' ? (
                    <Button size="sm" onClick={() => mockApi.tickets.startConsult(t.id)}>Start</Button>
                  ) : idx === 0 ? (
                    <Badge>Next</Badge>
                  ) : null}
                </div>
              ))}
            </div>
          </Card>

          {status !== 'AVAILABLE' && (
            <Card className="flex-1 flex flex-col bg-coral-50/50 border-coral-200">
              <div className="p-4 border-b border-coral-200 font-bold text-coral-800">Handover Log</div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {proposals.map(p => (
                  <div key={p.id} className="p-3 bg-white dark:bg-slate-800 rounded-xl text-sm shadow-sm">
                    <span className="font-bold text-coral-600">{p.status}</span>
                    <p className="text-slate-500 mt-1">Ticket {p.ticketId} assigned to {p.toDoctorId}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
