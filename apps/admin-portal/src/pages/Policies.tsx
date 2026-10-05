import React, { useState } from 'react';
import { Card, Button, Input, PolicySchema, emit, getDB, saveDB } from '@careflow/shared';

export const Policies = () => {
  const [formData, setFormData] = useState({
    cancelWindowMins: 60,
    graceMins: 15,
    maxQueueLen: 50,
    agingBoostEveryMins: 30,
    walkInReservePct: 10,
    reassignConsentMins: 5
  });

  const [errors, setErrors] = useState<any>({});
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: Number(e.target.value) });
  };

  const handleSave = () => {
    const res = PolicySchema.safeParse(formData);
    if (!res.success) {
      const errs: any = {};
      res.error.errors.forEach(e => { errs[e.path[0]] = e.message; });
      setErrors(errs);
      setSaved(false);
    } else {
      setErrors({});
      // Update mock DB
      const db = getDB();
      db.policy = res.data;
      saveDB(db);
      // Emit event
      emit({ type: 'policy:updated', payload: res.data });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">Policy Center</h1>
      <Card className="p-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Cancel Window (Mins)</label>
            <Input type="number" name="cancelWindowMins" value={formData.cancelWindowMins} onChange={handleChange} />
            {errors.cancelWindowMins && <p className="text-coral-500 text-xs mt-1">{errors.cancelWindowMins}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Grace Period for No-Show (Mins)</label>
            <Input type="number" name="graceMins" value={formData.graceMins} onChange={handleChange} />
            {errors.graceMins && <p className="text-coral-500 text-xs mt-1">{errors.graceMins}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Max Queue Length per Doctor</label>
            <Input type="number" name="maxQueueLen" value={formData.maxQueueLen} onChange={handleChange} />
            {errors.maxQueueLen && <p className="text-coral-500 text-xs mt-1">{errors.maxQueueLen}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Aging Priority Boost (Every X Mins)</label>
            <Input type="number" name="agingBoostEveryMins" value={formData.agingBoostEveryMins} onChange={handleChange} />
            {errors.agingBoostEveryMins && <p className="text-coral-500 text-xs mt-1">{errors.agingBoostEveryMins}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Walk-in Reserve %</label>
            <Input type="number" name="walkInReservePct" value={formData.walkInReservePct} onChange={handleChange} />
            {errors.walkInReservePct && <p className="text-coral-500 text-xs mt-1">{errors.walkInReservePct}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Reassign Consent Timeout (Mins)</label>
            <Input type="number" name="reassignConsentMins" value={formData.reassignConsentMins} onChange={handleChange} />
            {errors.reassignConsentMins && <p className="text-coral-500 text-xs mt-1">{errors.reassignConsentMins}</p>}
          </div>
        </div>
        
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-teal-600 font-bold">{saved && 'Policies saved and broadcasted live!'}</span>
          <Button onClick={handleSave}>Save Policies</Button>
        </div>
      </Card>
    </div>
  );
};
