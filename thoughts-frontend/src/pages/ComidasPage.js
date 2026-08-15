import React, { useState, useEffect } from 'react';

const API = 'https://thoughts-app-production.up.railway.app/api';

const TIPOS = ['proteina', 'carbohidrato', 'verdura', 'fruta', 'lacteo', 'bebida', 'otro'];

const ComidasPage = () => {
  const [alimentos, setAlimentos] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: '', tipo: 'proteina', descripcion: '', porcion: '' });
  const [cargando, setCargando] = useState(true);

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    try {
      const res = await fetch(API + '/alimentos/');
      const data = await res.json();
      setAlimentos(data.results || []);
    } catch (err) {
      console.error(err);
    }
    setCargando(false);
  };

  const guardar = async () => {
    if (!nuevo.nombre.trim()) return;
    try {
      await fetch(API + '/alimentos/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...nuevo, activo: true })
      });
      setNuevo({ nombre: '', tipo: 'proteina', descripcion: '', porcion: '' });
      cargar();
    } catch (err) {
      console.error(err);
    }
  };

  const borrar = async (id) => {
    try {
      await fetch(API + '/alimentos/' + id + '/', { method: 'DELETE' });
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
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0, color: '#fff' }}>Alimentos</h2>
        <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>Tu listado para elegir cada día</p>
      </div>

      <div style={caja}>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '10px' }}>Agregar alimento</div>
        <input style={input} placeholder="Nombre (ej: Huevo revuelto)"
          value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} />
        <select style={input} value={nuevo.tipo} onChange={(e) => setNuevo({ ...nuevo, tipo: e.target.value })}>
          {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <input style={input} placeholder="Porción (ej: 2 unidades, 1 taza)"
          value={nuevo.porcion} onChange={(e) => setNuevo({ ...nuevo, porcion: e.target.value })} />
        <textarea style={{ ...input, minHeight: '60px' }} placeholder="Descripción / cómo lo preparás"
          value={nuevo.descripcion} onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })} />
        <button onClick={guardar}
          style={{ width: '100%', padding: '10px', background: '#0070ff', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
          Agregar
        </button>
      </div>

      <div style={caja}>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '10px' }}>
          Mis alimentos ({alimentos.length})
        </div>
        {cargando && <div style={{ color: '#666', fontSize: '13px' }}>Cargando...</div>}
        {!cargando && alimentos.length === 0 && (
          <div style={{ color: '#666', fontSize: '13px' }}>Todavía no cargaste ninguno.</div>
        )}
        {alimentos.map(a => (
          <div key={a.id} style={{
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
              <div style={{ color: '#fff', fontSize: '14px' }}>{a.nombre}</div>
              <div style={{ color: '#666', fontSize: '11px' }}>
                {a.tipo}{a.porcion ? ' · ' + a.porcion : ''}
              </div>
              {a.descripcion && (
                <div style={{ color: '#888', fontSize: '11px', marginTop: '3px' }}>{a.descripcion}</div>
              )}
            </div>
            <button onClick={() => borrar(a.id)}
              style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: '16px' }}>
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComidasPage;
