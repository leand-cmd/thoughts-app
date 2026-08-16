import React, { useState, useEffect } from 'react';
import ComidasPage from './ComidasPage';
import EjerciciosPage from './EjerciciosPage';

const GymPage = () => {
  const [solapa, setSolapa] = useState('calendario');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dailyLogs, setDailyLogs] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [editData, setEditData] = useState({ gym: false, creatina: false, vitamina_d: false, omega3: false, magnesio: false, zinc: false });

  useEffect(() => {
    fetchDailyLogs();
  }, [currentDate]);

  const fetchDailyLogs = async () => {
    try {
      const response = await fetch('https://thoughts-app-production.up.railway.app/api/daily-logs/');
      const data = await response.json();
      const logsMap = {};
      data.results.forEach(log => {
        logsMap[log.fecha] = log;
      });
      setDailyLogs(logsMap);
    } catch (err) {
      console.error('Error fetching daily logs:', err);
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDayClick = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    const existing = dailyLogs[dateStr];
    if (existing) {
      setEditData(existing);
    } else {
      setEditData({ gym: false, creatina: false, vitamina_d: false, omega3: false, magnesio: false, zinc: false });
    }
  };

  const handleSave = async () => {
    try {
      const method = dailyLogs[selectedDate] ? 'PUT' : 'POST';
      const url = dailyLogs[selectedDate]
        ? `https://thoughts-app-production.up.railway.app/api/daily-logs/${selectedDate}/`
        : 'https://thoughts-app-production.up.railway.app/api/daily-logs/';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fecha: selectedDate, ...editData })
      });

      if (response.ok) {
        fetchDailyLogs();
        setSelectedDate(null);
      }
    } catch (err) {
      console.error('Error saving:', err);
    }
  };

  const days = [];
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const isWeekend = (day) => {
    if (!day) return false;
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return d.getDay() === 0 || d.getDay() === 6;
  };

  const getDayData = (day) => {
    if (!day) return null;
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dailyLogs[dateStr];
  };

  const remedies = [
    { key: 'creatina', label: 'Creatina', emoji: '💊' },
    { key: 'vitamina_d', label: 'Vitamina D', emoji: '☀️' },
    { key: 'omega3', label: 'Omega-3', emoji: '🐟' },
    { key: 'magnesio', label: 'Magnesio', emoji: '✨' },
    { key: 'zinc', label: 'Zinc', emoji: '⚡' }
  ];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0a0a0a 0%, #0f0f1e 100%)',
      padding: '0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif'
    }}>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ marginBottom: '20px' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '8px',
            background: 'linear-gradient(135deg, #fff 0%, #0070ff 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-2px'
          }}>💪 Gym</h1>
          <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>Seguimiento diario: gym, suplementos y progreso</p>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {[
            { key: 'calendario', label: 'Calendario' },
            { key: 'comidas', label: 'Comidas' },
            { key: 'ejercicios', label: 'Ejercicios' }
          ].map(s => (
            <button key={s.key} onClick={() => setSolapa(s.key)}
              style={{
                padding: '8px 14px',
                background: solapa === s.key ? '#0070ff' : 'rgba(255,255,255,0.05)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: solapa === s.key ? '600' : '400'
              }}>
              {s.label}
            </button>
          ))}
        </div>

        {solapa === 'comidas' && <ComidasPage />}

        {solapa === 'ejercicios' && <EjerciciosPage />}

        {solapa === 'calendario' && (
        <>

        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '12px',
          marginBottom: '24px',
          maxWidth: '480px',
          boxSizing: 'border-box',
          width: '100%'
        }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: '#fff' }}>
              {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ‹
              </button>
              <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ›
              </button>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '4px'
          }}>
            {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(d => (
              <div key={d} style={{ textAlign: 'center', fontWeight: '600', color: '#555', fontSize: '9px', paddingBottom: '4px' }}>
                {d}
              </div>
            ))}

            {days.map((day, idx) => {
              const data = getDayData(day);
              const isWeekendDay = isWeekend(day);

              return (
                <div key={idx}
                  onClick={() => day && handleDayClick(day)}
                  style={{
                    aspectRatio: '0.8',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                    cursor: day ? 'pointer' : 'default',
                    background: !day ? 'transparent' : isWeekendDay ? 'rgba(80, 80, 80, 0.1)' : (data?.gym ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.02)'),
                    border: data?.gym ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.2s ease',
                    padding: '4px',
                    fontSize: '10px',
                    gap: '2px'
                  }}
                  onMouseEnter={(e) => day && (e.currentTarget.style.background = isWeekendDay ? 'rgba(80, 80, 80, 0.15)' : 'rgba(0, 112, 255, 0.06)')}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = !day ? 'transparent' : isWeekendDay ? 'rgba(80, 80, 80, 0.1)' : (data?.gym ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.02)');
                  }}
                >
                  {day && (
                    <>
                      <div style={{ fontWeight: '700', color: data?.gym ? '#10b981' : '#888', lineHeight: '1.1' }}>
                        {day}
                      </div>
                      {data?.gym && <div style={{ color: '#10b981', fontSize: '7px' }}>✓</div>}
                      {data && (
                        <div style={{ display: 'flex', gap: '1px', fontSize: '7px', color: '#ccc', lineHeight: '1' }}>
                          {data.creatina && <span>C</span>}
                          {data.vitamina_d && <span>D</span>}
                          {data.omega3 && <span>O</span>}
                          {data.magnesio && <span>M</span>}
                          {data.zinc && <span>Z</span>}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        </>
        )}

        {selectedDate && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setSelectedDate(null)}>
            <div style={{
              background: 'linear-gradient(135deg, #0a0a0a 0%, #0f0f1e 100%)',
              border: '1px solid rgba(0, 112, 255, 0.3)',
              borderRadius: '16px',
              padding: '40px',
              maxWidth: '500px',
              width: '90%',
              backdropFilter: 'blur(10px)'
            }}
            onClick={(e) => e.stopPropagation()}>

              <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: '#fff' }}>
                {selectedDate}
              </h3>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '8px', cursor: 'pointer', marginBottom: '12px' }}>
                  <input type="checkbox" checked={editData.gym} onChange={(e) => setEditData({...editData, gym: e.target.checked})}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                  <span style={{ color: '#fff', fontSize: '16px', flex: 1 }}>Fui al gym 💪</span>
                </label>

                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ fontSize: '14px', color: '#999', marginBottom: '12px' }}>Remedios:</div>
                  {remedies.map(r => (
                    <label key={r.key} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', cursor: 'pointer', marginBottom: '8px' }}>
                      <input type="checkbox" checked={editData[r.key]} onChange={(e) => setEditData({...editData, [r.key]: e.target.checked})}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                      <span style={{ color: editData[r.key] ? '#10b981' : '#ccc', fontSize: '14px', flex: 1 }}>
                        {r.emoji} {r.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={handleSave}
                  style={{ flex: 1, padding: '12px', background: '#0070ff', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '600' }}>
                  Guardar
                </button>
                <button onClick={() => setSelectedDate(null)}
                  style={{ flex: 1, padding: '12px', background: 'rgba(255, 255, 255, 0.1)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GymPage;
