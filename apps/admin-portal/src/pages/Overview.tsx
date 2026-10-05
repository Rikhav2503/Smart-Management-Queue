import React, { useEffect, useState } from 'react';
import { Card, StatTile, mockApi, subscribe } from '@careflow/shared';

export const Overview = () => {
  const [stats, setStats] = useState({
    queues: { EMERGENCY: 0, STANDARD: 0 },
    doctors: { AVAILABLE: 0, BREAK: 0, ROUNDS: 0 },
    served: 0,
    avgWait: 0
  });

  const loadData = async () => {
    const q = await mockApi.queue.getAllByLane();
    const docs = await mockApi.doctors.list();
    // Simulate some logic
    setStats({
      queues: { EMERGENCY: q.EMERGENCY?.length || 0, STANDARD: q.STANDARD?.length || 0 },
      doctors: { AVAILABLE: docs.length, BREAK: 0, ROUNDS: 0 }, // Simplified
      served: 45,
      avgWait: 22
    });
  };

  useEffect(() => {
    loadData();
    const unsub = subscribe(() => loadData());
    return unsub;
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-8 text-slate-800 dark:text-slate-100">Live Campus Dashboard</h1>
      <div className="grid grid-cols-4 gap-6">
        <StatTile title="Total Waiting" value={stats.queues.EMERGENCY + stats.queues.STANDARD} trend={+5} />
        <StatTile title="Emergency Lane" value={stats.queues.EMERGENCY} />
        <StatTile title="Doctors Available" value={stats.doctors.AVAILABLE} trend={-2} />
        <StatTile title="Avg Wait Time" value={`${stats.avgWait}m`} trend={-10} />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6 h-96 flex items-center justify-center text-slate-400">
          Chart: Queue Length by Department
        </Card>
        <Card className="p-6 h-96 flex items-center justify-center text-slate-400">
          Chart: Tickets Served Today
        </Card>
      </div>
    </div>
  );
};
