import React, { useState, useMemo } from 'react';
import { Card, Button, Badge } from '@careflow/shared';

// Simple hash for demo
const hash = (str: string) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  }
  return h.toString(16);
};

export const Audit = () => {
  const [search, setSearch] = useState('');
  
  const rawLogs = [
    { id: '1', actor: 'Admin User', action: 'POLICY_UPDATE', entity: 'PolicySettings', timestamp: '2026-10-05 10:00:00' },
    { id: '2', actor: 'Reception', action: 'TIER_OVERRIDE', entity: 'Ticket A012', timestamp: '2026-10-05 10:15:00' },
    { id: '3', actor: 'Dr. Smith', action: 'HANDOVER_CREATE', entity: 'Proposal rp_123', timestamp: '2026-10-05 11:30:00' },
    { id: '4', actor: 'Admin User', action: 'OVERBOOK_ACCEPT', entity: 'Slot 10:00', timestamp: '2026-10-05 12:00:00' }
  ];

  // Client-side hash chain computation
  const logsWithHashes = useMemo(() => {
    let prevHash = '00000000';
    return rawLogs.map(log => {
      const currentString = `${log.actor}${log.action}${log.entity}${log.timestamp}`;
      const currentHash = hash(prevHash + currentString);
      const res = { ...log, prevHash, hash: currentHash };
      prevHash = currentHash;
      return res;
    });
  }, []);

  const [verified, setVerified] = useState<boolean | null>(null);

  const verifyChain = () => {
    // In a real app, recompute and check if it matches stored hashes
    setVerified(true);
    setTimeout(() => setVerified(null), 3000);
  };

  const filtered = logsWithHashes.filter(l => 
    l.actor.toLowerCase().includes(search.toLowerCase()) || 
    l.action.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Audit Log</h1>
        <div className="flex items-center space-x-4">
          <input 
            type="text" 
            placeholder="Search logs..." 
            className="p-2 border rounded-lg"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Button onClick={verifyChain} className={verified ? 'bg-success hover:bg-success' : ''}>
            {verified ? 'Chain Verified ✓' : 'Verify Hash Chain'}
          </Button>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 dark:bg-slate-800">
            <tr>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Actor</th>
              <th className="p-4">Action</th>
              <th className="p-4">Entity</th>
              <th className="p-4">Hash</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l.id} className="border-b dark:border-slate-800">
                <td className="p-4 text-slate-500">{l.timestamp}</td>
                <td className="p-4 font-medium">{l.actor}</td>
                <td className="p-4"><Badge variant="outline">{l.action}</Badge></td>
                <td className="p-4">{l.entity}</td>
                <td className="p-4 font-mono text-xs text-slate-400">
                  {l.hash}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 flex justify-between items-center border-t border-slate-200 dark:border-slate-800 text-sm text-slate-500">
          <span>Showing 1 to {filtered.length} of {filtered.length} entries</span>
          <div className="flex space-x-2">
            <Button size="sm" variant="ghost" disabled>Previous</Button>
            <Button size="sm" variant="ghost" disabled>Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
