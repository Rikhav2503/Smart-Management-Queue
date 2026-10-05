import React, { useState, useEffect } from 'react';
import { mockApi, Department, Service, DoctorProfile, Card, Badge, Skeleton } from '@careflow/shared';

export const HomePage = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      mockApi.departments.list(),
      mockApi.services.list(),
      mockApi.doctors.list()
    ]).then(([deps, svcs, docs]) => {
      setDepartments(deps);
      setServices(svcs);
      setDoctors(docs);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="space-y-4"><Skeleton className="h-32 w-full"/><Skeleton className="h-32 w-full"/></div>;

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Departments</h2>
        <div className="grid grid-cols-2 gap-4">
          {departments.map(d => (
            <Card key={d.id} className="text-center p-4">
              <h3 className="font-semibold text-slate-700 dark:text-slate-200">{d.name}</h3>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Services</h2>
        <div className="flex overflow-x-auto space-x-4 pb-2">
          {services.filter(s => s.kind !== 'OPD').map(s => (
            <Card key={s.id} className="min-w-[150px] p-4 flex-shrink-0">
              <Badge>{s.kind}</Badge>
              <h4 className="mt-2 font-medium">{s.name}</h4>
              <p className="text-xs text-slate-500 mt-1">Avg {s.avgMins} mins</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Our Doctors</h2>
        <div className="space-y-4">
          {doctors.map(doc => (
            <Card key={doc.userId} className="p-4 flex flex-col space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-teal-700 dark:text-teal-400">{doc.user?.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{doc.specialty}</p>
                </div>
                <Badge variant="success">Available</Badge>
              </div>
              <div className="text-xs text-slate-500 flex justify-between">
                <span>{doc.qualification}</span>
                <span>Avg consult: {doc.avgConsultMins}m</span>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};
