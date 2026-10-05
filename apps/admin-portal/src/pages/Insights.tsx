import React from 'react';
import { Card, Button } from '@careflow/shared';

export const Insights = () => {
  const exportCSV = (name: string) => {
    alert(`Exporting ${name}.csv...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Insights Studio</h1>
        <div className="flex space-x-2">
          <select className="border p-2 rounded-lg"><option>All Campuses</option></select>
          <select className="border p-2 rounded-lg"><option>Last 7 Days</option></select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Patient Satisfaction Trend */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Patient Satisfaction Trend</h3>
            <Button size="sm" variant="ghost" onClick={() => exportCSV('satisfaction')}>Export CSV</Button>
          </div>
          <div className="h-64 w-full flex items-end space-x-2 px-2">
            {[4, 4.2, 4.1, 4.5, 4.6, 4.8, 4.7].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end items-center group">
                <div 
                  className="w-full bg-teal-500 rounded-t-sm transition-all group-hover:bg-teal-400" 
                  style={{ height: `${(val / 5) * 100}%` }}
                />
                <span className="text-[10px] text-slate-500 mt-2">Day {i+1}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Consult Time Histogram */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Consult Time Distribution</h3>
            <Button size="sm" variant="ghost" onClick={() => exportCSV('consult_times')}>Export CSV</Button>
          </div>
          <div className="h-64 w-full flex items-end space-x-1 px-2">
            {[2, 5, 12, 25, 40, 30, 15, 8, 3].map((count, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end items-center group">
                <div 
                  className="w-full bg-coral-500 rounded-t-sm transition-all group-hover:bg-coral-400" 
                  style={{ height: `${(count / 40) * 100}%` }}
                />
                <span className="text-[10px] text-slate-500 mt-2">{i*5}m</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Peak-hour heatmap (simplified) */}
        <Card className="p-6 col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Peak-Hour Heatmap</h3>
            <Button size="sm" variant="ghost" onClick={() => exportCSV('peak_heatmap')}>Export CSV</Button>
          </div>
          <div className="grid grid-cols-12 gap-1 h-32">
            {Array.from({length: 84}).map((_, i) => (
              <div 
                key={i} 
                className={`rounded-sm ${Math.random() > 0.7 ? 'bg-coral-500' : Math.random() > 0.4 ? 'bg-yellow-400' : 'bg-teal-400'}`}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
