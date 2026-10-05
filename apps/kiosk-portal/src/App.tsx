import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, mockApi, subscribe } from '@careflow/shared';

const KioskApp = () => {
  const [step, setStep] = useState(0); // 0: Attract, 1: Phone, 2: Priority/Service, 3: Token
  const [phone, setPhone] = useState('');
  const [priority, setPriority] = useState<any>('STANDARD');
  const [ticket, setTicket] = useState<any>(null);
  const [activeBoard, setActiveBoard] = useState(false);
  const [calledTickets, setCalledTickets] = useState<any[]>([]);
  const [highContrast, setHighContrast] = useState(false);
  
  // Idle timeout
  useEffect(() => {
    let timeout: any;
    const reset = () => {
      if (step > 0 && step < 3) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          setStep(0);
          setPhone('');
        }, 60000); // 60s idle timeout
      }
    };
    window.addEventListener('click', reset);
    window.addEventListener('touchstart', reset);
    reset();
    return () => {
      window.removeEventListener('click', reset);
      window.removeEventListener('touchstart', reset);
      clearTimeout(timeout);
    };
  }, [step]);

  // Load called tickets for board
  useEffect(() => {
    const loadBoard = () => {
      mockApi.tickets.listActive().then(tickets => {
        setCalledTickets(tickets.filter(t => t.status === 'CALLED' || t.status === 'SERVING'));
      });
    };
    if (activeBoard || step === 0) {
      loadBoard();
    }
    const unsub = subscribe((e) => {
      if (e.type === 'ticket:updated') loadBoard();
    });
    return unsub;
  }, [activeBoard, step]);

  const join = async () => {
    const t = await mockApi.tickets.join({
      campusId: 'c_1',
      serviceId: 's_opd_cardio',
      patientId: `u_${phone}`,
      source: 'KIOSK',
      tier: priority
    } as any);
    setTicket(t);
    setStep(3);
    
    // Auto reset token slip after 20 seconds
    setTimeout(() => {
      setStep(0);
      setPhone('');
      setTicket(null);
    }, 20000);
  };

  const handleNumpad = (num: string) => {
    if (phone.length < 10) setPhone(phone + num);
  };
  const delNumpad = () => setPhone(phone.slice(0, -1));

  // Accessibility toggle
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
      document.body.style.fontSize = '120%';
    } else {
      document.body.classList.remove('high-contrast');
      document.body.style.fontSize = '100%';
    }
  }, [highContrast]);

  const maskPhone = (p: string) => p.slice(0, 3) + '****' + p.slice(7);

  if (activeBoard) {
    return (
      <div className="min-h-screen p-8 bg-slate-900 text-white flex flex-col">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-teal-400">Now Serving</h1>
          <Button variant="outline" onClick={() => setActiveBoard(false)}>Back to Kiosk</Button>
        </header>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {calledTickets.map(t => (
            <Card key={t.id} className="p-6 bg-slate-800 border-teal-500 border-2 text-center shadow-lg shadow-teal-500/20">
              <h2 className="text-6xl font-black text-white mb-2">{t.code}</h2>
              <p className="text-xl text-teal-400">Counter {t.doctorId || '1'}</p>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-8 select-none">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-teal-600">CareFlow</h1>
        <div className="flex space-x-4">
          <Button variant="ghost" onClick={() => setHighContrast(!highContrast)}>
            {highContrast ? 'Standard View' : 'Accessibility (Large / Contrast)'}
          </Button>
          {step === 0 && <Button variant="outline" onClick={() => setActiveBoard(true)}>Now Serving Board</Button>}
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center">
        {step === 0 && (
          <Card 
            className="p-16 text-center cursor-pointer hover:shadow-xl hover:border-teal-500 transition-all active:scale-95"
            onClick={() => setStep(1)}
          >
            <h2 className="text-5xl font-black text-slate-800 dark:text-white mb-4">Tap to Start</h2>
            <p className="text-xl text-slate-500">Get your consultation token</p>
          </Card>
        )}

        {step === 1 && (
          <Card className="p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-center mb-6">Enter Phone Number</h2>
            <div className="text-4xl font-mono text-center tracking-widest border-b-2 border-teal-500 pb-2 mb-8 h-12">
              {phone || <span className="text-slate-300">__________</span>}
            </div>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {['1','2','3','4','5','6','7','8','9'].map(n => (
                <Button key={n} variant="outline" className="text-2xl py-6" onClick={() => handleNumpad(n)}>{n}</Button>
              ))}
              <Button variant="outline" className="text-2xl py-6 text-coral-500" onClick={delNumpad}>Del</Button>
              <Button variant="outline" className="text-2xl py-6" onClick={() => handleNumpad('0')}>0</Button>
              <Button variant="outline" className="text-xl py-6 bg-slate-100" onClick={() => setStep(0)}>Cancel</Button>
            </div>
            <Button 
              className="w-full py-4 text-xl" 
              disabled={phone.length < 10}
              onClick={() => setStep(2)}
            >
              Continue
            </Button>
          </Card>
        )}

        {step === 2 && (
          <Card className="p-8 max-w-4xl w-full">
            <h2 className="text-2xl font-bold mb-6 text-center">Do any of these apply to you?</h2>
            <div className="grid grid-cols-2 gap-6 mb-8">
              {[
                { id: 'SENIOR', label: 'Senior Citizen (65+)' },
                { id: 'MATERNITY', label: 'Maternity' },
                { id: 'ACCESSIBLE', label: 'Accessibility Needs' },
                { id: 'STANDARD', label: 'None of the above' }
              ].map(p => (
                <Card 
                  key={p.id}
                  className={`p-8 text-center cursor-pointer text-xl font-medium transition-all ${priority === p.id ? 'bg-teal-600 text-white border-teal-600 shadow-md' : 'hover:border-teal-500'}`}
                  onClick={() => setPriority(p.id)}
                >
                  {p.label}
                </Card>
              ))}
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" className="flex-1 py-4 text-xl" onClick={() => setStep(1)}>Back</Button>
              <Button className="flex-1 py-4 text-xl" onClick={join}>Print Token</Button>
            </div>
          </Card>
        )}

        {step === 3 && ticket && (
          <Card className="p-12 text-center max-w-md w-full border-4 border-slate-800 shadow-2xl relative overflow-hidden bg-white">
            {/* Printable slip style */}
            <div className="border-b-2 border-dashed border-slate-300 pb-6 mb-6">
              <h2 className="text-2xl font-bold text-slate-800">CareFlow Hospital</h2>
              <p className="text-slate-500">North Campus</p>
              <p className="text-slate-400 mt-2">{new Date().toLocaleString()}</p>
            </div>
            <p className="text-lg font-bold text-slate-500 uppercase tracking-widest">Token No.</p>
            <h1 className="text-7xl font-black text-slate-900 my-4">{ticket.code}</h1>
            <Badge variant="default" className="text-lg px-4 py-1 mb-8">{ticket.tier}</Badge>
            
            <div className="bg-slate-100 p-4 rounded-xl mb-6">
              <p className="text-sm text-slate-500">Estimated Wait</p>
              <p className="text-2xl font-bold text-slate-800">45 mins</p>
            </div>
            
            <div className="w-32 h-32 mx-auto bg-slate-200 p-2 flex flex-col items-center justify-center rounded border-2 border-slate-800">
              <span className="text-xs font-mono text-slate-600 block text-center">Scan QR to track on mobile</span>
            </div>
            <p className="text-xs text-slate-400 mt-8">Please wait in the seating area.</p>
          </Card>
        )}
      </main>
    </div>
  );
};

export default KioskApp;
