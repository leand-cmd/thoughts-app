import React, { useState, useEffect } from 'react';

const API = 'https://thoughts-app-production.up.railway.app/api';

const MOMENTOS = [
  { key: 'desayuno', label: 'Desayuno' },
  { key: 'almuerzo', label: 'Almuerzo' },
  { key: 'merienda', label: 'Merienda' },
  { key: 'cena', label: 'Cena' },
  { key: 'snack', label: 'Snack' }
];

const hoy = () => new Date().toISOString().split('T')[0];

const ComidasPage = () => {
  const [registros, setRegistros] = useState([]);
  const [fecha, setFecha] = useState(hoy());
  const [momento, setMomento] = useState('desayuno');
  const [detalle, setDetalle] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    try {
      const res = await fetch(API + '/registro-comidas/');
      const data = await res.json();
      setRegistros(data.results || []);
    } catch (err) {
      console.error(err);
    }
    setCargando(false);
  };

  const guardar = async () => {
    if (!detalle.trim()) return;
    try {
      await fetch(API + '/registro-comidas/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fecha, momento, detalle })
      });
      setDetalle('');
      cargar();
    } catch (err) {
      console.error(err);
    }
  };

  const borrar = async (id) => {
    try {
      await fetch(API + '/registro-comidas/' + id + '/', { method: 'DELETE' });
      cargar();
    } catch (err) {
      console.error(err);
    }
  };

  const caja = {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '16px',
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: '480px'
  };

  const input = {
    width: '100%',
    padding: '10px',
    marginBottom: '8px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '13px',
    boxSizing: 'border-box'
  };

  const porFecha = registros.reduce((acc, r) => {
    if (!acc[r.fecha]) acc[r.fecha] = [];
    acc[r.fecha].push(r);
    return acc;
  }, {});

  return (
    <div>
      <div style={caja}>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '10px' }}>Registrar comida</div>
        <input type="date" style={input} value={fecha} onChange={(e) => setFecha(e.target.value)} />
        <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', flexWrap: 'wrap' }}>
          {MOMENTOS.map(m => (
            <button key={m.key} onClick={() => setMomento(m.key)}
              style={{
                padding: '6px 10px',
                background: momento === m.key ? '#0070ff' : 'rgba(255,255,255,0.05)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '11px'
              }}>
              {m.label}
            </button>
          ))}
        </div>
        <textarea style={{ ...input, minHeight: '70px' }}
          placeholder="Ej: huevo, tomate, pan, mayonesa"
          value={detalle} onChange={(e) => setDetalle(e.target.value)} />
        <button onClick={guardar}
          style={{ width: '100%', padding: '10px', background: '#0070ff', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
          Guardar
        </button>
      </div>

      <div style={caja}>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '10px' }}>
          Historial ({registros.length})
        </div>
        {cargando && <div style={{ color: '#666', fontSize: '13px' }}>Cargando...</div>}
        {!cargando && registros.length === 0 && (
          <div style={{ color: '#666', fontSize: '13px' }}>Todavía no registraste ninguna comida.</div>
        )}
        {Object.keys(porFecha).sort().reverse().map(f => (
          <div key={f} style={{ marginBottom: '12px' }}>
            <div style={{ color: '#0070ff', fontSize: '11px', marginBottom: '4px', fontWeight: '600' }}>{f}</div>
            {porFecha[f].map(r => (
              <div key={r.id} style={{
                padding: '8px 10px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px',
                marginBottom: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '8px'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#888', fontSize: '10px', textTransform: 'uppercase' }}>{r.momento}</div>
                  <div style={{ color: '#fff', fontSize: '13px' }}>{r.detalle}</div>
                </div>
                <button onClick={() => borrar(r.id)}
                  style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: '16px' }}>
                  ×
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComidasPage;
