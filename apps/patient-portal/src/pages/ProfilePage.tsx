import React, { useState } from 'react';
import { Card, Button, usePatientStore, Badge, Modal } from '@careflow/shared';
import { usePatientStore as useLocalStore } from '../stores/usePatientStore';
import { Users, Plus, LogOut } from 'lucide-react';

export const ProfilePage = () => {
  const user = useLocalStore(s => s.user);
  const logout = useLocalStore(s => s.logout);
  const [showAdd, setShowAdd] = useState(false);
  const [dependents, setDependents] = useState([
    { id: 'd1', name: 'Child 1', relation: 'Son', dob: '2015-01-01' }
  ]);

  return (
    <div className="space-y-6">
      <Card className="flex items-center space-x-4 p-6">
        <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-2xl font-bold">
          {user?.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{user?.name}</h2>
          <p className="text-sm text-slate-500">{user?.phone}</p>
          <Badge className="mt-2">Primary</Badge>
        </div>
      </Card>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Family Health Group</h2>
          <Button variant="ghost" size="sm" onClick={() => setShowAdd(true)}><Plus size={16} /> Add</Button>
        </div>
        <div className="space-y-3">
          {dependents.map(d => (
            <Card key={d.id} className="p-4 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100">{d.name}</h4>
                  <p className="text-xs text-slate-500">{d.relation} • {d.dob}</p>
                </div>
              </div>
              <Button size="sm" variant="outline">Book</Button>
            </Card>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-4 text-center">You can book up to 5 linked tickets in one flow.</p>
      </section>

      <Button variant="ghost" className="w-full text-coral-500 hover:text-coral-600 hover:bg-coral-50" onClick={logout}>
        <LogOut size={16} className="mr-2" /> Logout
      </Button>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)}>
        <div className="p-6 space-y-4">
          <h3 className="font-bold text-lg">Add Dependent</h3>
          <input className="w-full p-2 border rounded" placeholder="Full Name" />
          <input className="w-full p-2 border rounded" placeholder="Relation (e.g. Son)" />
          <input className="w-full p-2 border rounded" type="date" />
          <Button className="w-full" onClick={() => setShowAdd(false)}>Save</Button>
        </div>
      </Modal>
    </div>
  );
};
