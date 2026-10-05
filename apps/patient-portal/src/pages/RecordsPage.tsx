import React from 'react';
import { Card, Button, Badge } from '@careflow/shared';
import { Calendar as CalIcon, Clock, ChevronRight } from 'lucide-react';

export const RecordsPage = () => {
  const followUps = [
    { id: 'f1', doc: 'Dr. Demo', date: 'Oct 15, 2026', due: true, status: 'PENDING' },
    { id: 'f2', doc: 'Dr. Doc 1', date: 'Nov 02, 2026', due: false, status: 'BOOKED' }
  ];

  const history = [
    { id: 't1', doc: 'Dr. Demo', date: 'Sep 25, 2026', outcome: 'FOLLOW_UP', note: 'Advised rest' }
  ];

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Follow-up Care Planner</h2>
        <div className="space-y-3">
          {followUps.map(f => (
            <Card key={f.id} className={`p-4 flex items-center justify-between ${f.due ? 'border-coral-200 bg-coral-50 dark:bg-coral-900/10' : ''}`}>
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-xl ${f.due ? 'bg-coral-100 text-coral-600' : 'bg-slate-100 text-slate-500'}`}>
                  <CalIcon size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100">{f.doc}</h4>
                  <p className="text-xs text-slate-500 flex items-center mt-1">
                    <Clock size={12} className="mr-1" /> Due {f.date}
                  </p>
                </div>
              </div>
              {f.status === 'PENDING' ? (
                <Button size="sm">Book</Button>
              ) : (
                <Badge variant="success">Booked</Badge>
              )}
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Visit History</h2>
        <div className="space-y-3 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
          {history.map(h => (
            <div key={h.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <CalIcon size={16} />
              </div>
              <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 shadow-sm">
                <div className="flex justify-between mb-1">
                  <h4 className="font-bold text-slate-800 dark:text-slate-100">{h.doc}</h4>
                  <span className="text-xs text-slate-500">{h.date}</span>
                </div>
                <Badge variant="default" className="mb-2">{h.outcome}</Badge>
                <p className="text-sm text-slate-600 dark:text-slate-400">{h.note}</p>
              </Card>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
