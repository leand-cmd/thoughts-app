import React, { useState, useEffect } from 'react';

const API = 'https://thoughts-app-production.up.railway.app/api';

const hoy = () => new Date().toISOString().split('T')[0];

const EjerciciosPage = () => {
  const [registros, setRegistros] = useState([]);
  const [fecha, setFecha] = useState(hoy());
  const [detalle, setDetalle] = useState('');
  const [duracion, setDuracion] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    try {
      const res = await fetch(API + '/registro-ejercicios/');
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
      await fetch(API + '/registro-ejercicios/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha,
          detalle,
          duracion_min: duracion ? parseInt(duracion) : null
        })
      });
      setDetalle('');
      setDuracion('');
      cargar();
    } catch (err) {
      console.error(err);
    }
  };

  const borrar = async (id) => {
    try {
      await fetch(API + '/registro-ejercicios/' + id + '/', { method: 'DELETE' });
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

  return (
    <div>
      <div style={caja}>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '10px' }}>Registrar entrenamiento</div>
        <input type="date" style={input} value={fecha} onChange={(e) => setFecha(e.target.value)} />
        <textarea style={{ ...input, minHeight: '80px' }}
          placeholder="Ej: press banca 4x10, sentadillas 4x12, remo 3x12"
          value={detalle} onChange={(e) => setDetalle(e.target.value)} />
        <input type="number" style={input} placeholder="Duración en minutos (opcional)"
          value={duracion} onChange={(e) => setDuracion(e.target.value)} />
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
          <div style={{ color: '#666', fontSize: '13px' }}>Todavía no registraste entrenamientos.</div>
        )}
        {registros.map(r => (
          <div key={r.id} style={{
            padding: '10px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '8px',
            marginBottom: '6px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#0070ff', fontSize: '11px', fontWeight: '600' }}>
                {r.fecha}{r.duracion_min ? ' · ' + r.duracion_min + ' min' : ''}
              </div>
              <div style={{ color: '#fff', fontSize: '13px', whiteSpace: 'pre-wrap' }}>{r.detalle}</div>
            </div>
            <button onClick={() => borrar(r.id)}
              style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: '16px' }}>
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EjerciciosPage;
