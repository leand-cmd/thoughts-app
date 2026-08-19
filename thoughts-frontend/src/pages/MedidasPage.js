import React, { useState, useEffect } from 'react';

const API = 'https://thoughts-app-production.up.railway.app/api';

const CAMPOS = [
  { key: 'pecho', label: 'PECHO', top: '25%', side: 'left' },
  { key: 'cintura', label: 'CINTURA', top: '36%', side: 'left' },
  { key: 'cadera', label: 'CADERA', top: '45%', side: 'left' },
  { key: 'muslo', label: 'MUSLO', top: '62%', side: 'left' },
  { key: 'brazo', label: 'BRAZO', top: '28%', side: 'right' },
  { key: 'antebrazo', label: 'ANTEBRAZO', top: '42%', side: 'right' },
  { key: 'pantorrilla', label: 'PANTORRILLA', top: '80%', side: 'right' }
];

const hoy = () => new Date().toISOString().split('T')[0];

const MedidasPage = () => {
  const [mediciones, setMediciones] = useState([]);
  const [form, setForm] = useState({ fecha: hoy() });
  const [mostrarForm, setMostrarForm] = useState(false);

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    try {
      const res = await fetch(API + '/mediciones/');
      const data = await res.json();
      setMediciones(data.results || []);
    } catch (err) { console.error(err); }
  };

  const guardar = async () => {
    try {
      const body = { fecha: form.fecha };
      ['peso','altura','pecho','cintura','cadera','brazo','antebrazo','muslo','pantorrilla'].forEach(k => {
        if (form[k]) body[k] = form[k];
      });
      await fetch(API + '/mediciones/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      setForm({ fecha: hoy() });
      setMostrarForm(false);
      cargar();
    } catch (err) { console.error(err); }
  };

  const actual = mediciones[0] || {};
  const anterior = mediciones[1] || {};

  const delta = (key) => {
    if (!actual[key] || !anterior[key]) return null;
    const d = Number(actual[key]) - Number(anterior[key]);
    if (d === 0) return null;
    return d > 0 ? '+' + d : String(d);
  };

  const input = {
    width: '100%', padding: '9px', marginBottom: '8px',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px', color: '#fff', fontSize: '13px', boxSizing: 'border-box'
  };

  return (
    <div style={{ maxWidth: '480px' }}>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '14px'
      }}>
        {[
          { l: 'PESO', v: actual.peso ? actual.peso + ' kg' : '—' },
          { l: 'ALTURA', v: actual.altura ? actual.altura + ' m' : '—' },
          { l: 'FECHA', v: actual.fecha || '—' }
        ].map((x, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '8px' }}>
            <div style={{ color: '#5ba3b8', fontSize: '9px', letterSpacing: '1px' }}>{x.l}</div>
            <div style={{ color: '#dcfdff', fontSize: '15px' }}>{x.v}</div>
          </div>
        ))}
      </div>

      <div style={{ position: 'relative', width: '100%', marginBottom: '14px' }}>
        <img src="/body.jpg" alt="Silueta corporal" style={{ width: '100%', display: 'block', borderRadius: '12px' }} />
        {CAMPOS.map(c => {
          const val = actual[c.key];
          const d = delta(c.key);
          return (
            <div key={c.key} style={{
              position: 'absolute',
              top: c.top,
              [c.side]: '2%',
              textAlign: c.side === 'left' ? 'left' : 'right'
            }}>
              <div style={{ color: '#5ba3b8', fontSize: '9px', letterSpacing: '1px' }}>{c.label}</div>
              <div style={{ color: '#dcfdff', fontSize: '15px', fontWeight: '500' }}>
                {val ? val + ' cm' : '—'}
                {d && (
                  <span style={{ fontSize: '11px', marginLeft: '4px', color: d.startsWith('-') ? '#3ddc84' : '#ff9a6b' }}>
                    ({d})
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={() => setMostrarForm(!mostrarForm)}
        style={{ width: '100%', padding: '10px', background: mostrarForm ? 'rgba(255,255,255,0.06)' : '#0070ff', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
        {mostrarForm ? 'Cancelar' : 'Nueva medición'}
      </button>

      {mostrarForm && (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
          <input type="date" style={input} value={form.fecha} onChange={(e) => setForm({...form, fecha: e.target.value})} />
          <input type="number" step="0.1" style={input} placeholder="Peso (kg)" value={form.peso || ''} onChange={(e) => setForm({...form, peso: e.target.value})} />
          <input type="number" step="0.01" style={input} placeholder="Altura (m)" value={form.altura || ''} onChange={(e) => setForm({...form, altura: e.target.value})} />
          {CAMPOS.map(c => (
            <input key={c.key} type="number" style={input} placeholder={c.label.charAt(0) + c.label.slice(1).toLowerCase() + ' (cm)'}
              value={form[c.key] || ''} onChange={(e) => setForm({...form, [c.key]: e.target.value})} />
          ))}
          <button onClick={guardar}
            style={{ width: '100%', padding: '10px', background: '#0070ff', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
            Guardar medición
          </button>
        </div>
      )}

      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px' }}>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '8px' }}>Historial ({mediciones.length})</div>
        {mediciones.length === 0 && <div style={{ color: '#666', fontSize: '13px' }}>Sin mediciones aún.</div>}
        {mediciones.map(m => (
          <div key={m.id} style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', marginBottom: '6px' }}>
            <div style={{ color: '#0070ff', fontSize: '11px', fontWeight: '600' }}>{m.fecha}</div>
            <div style={{ color: '#ccc', fontSize: '12px' }}>
              {m.peso ? m.peso + 'kg · ' : ''}P{m.pecho} · C{m.cintura} · Cad{m.cadera}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedidasPage;
