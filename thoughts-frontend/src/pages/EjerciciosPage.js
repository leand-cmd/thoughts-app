import React, { useState, useEffect } from 'react';
import { GRUPOS, rutaImagen, nombreDeSlug } from './ejerciciosData';

const API = 'https://thoughts-app-production.up.railway.app/api';

const hoy = () => new Date().toISOString().split('T')[0];

const EjerciciosPage = () => {
  const [registros, setRegistros] = useState([]);
  const [fecha, setFecha] = useState(hoy());
  const [grupoAbierto, setGrupoAbierto] = useState(null);
  const [seleccion, setSeleccion] = useState([]);
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

  const alternar = (slug) => {
    setSeleccion((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const guardar = async () => {
    if (seleccion.length === 0) return;
    const detalle = seleccion.map(nombreDeSlug).join(', ');
    try {
      await fetch(API + '/registro-ejercicios/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha,
          detalle,
          duracion_min: duracion ? parseInt(duracion) : null,
        }),
      });
      setSeleccion([]);
      setDuracion('');
      setGrupoAbierto(null);
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
    padding: '14px',
    marginBottom: '14px',
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: '480px',
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
    boxSizing: 'border-box',
  };

  const contarEnGrupo = (g) =>
    Object.keys(g.ejercicios).filter((s) => seleccion.includes(s)).length;

  return (
    <div style={{ maxWidth: '480px' }}>
      <div style={caja}>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '10px' }}>
          Fecha del entrenamiento
        </div>
        <input
          type="date"
          style={input}
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
      </div>

      {GRUPOS.map((g) => {
        const abierto = grupoAbierto === g.carpeta;
        const marcados = contarEnGrupo(g);
        return (
          <div key={g.carpeta} style={{ ...caja, padding: '0', overflow: 'hidden' }}>
            <button
              onClick={() => setGrupoAbierto(abierto ? null : g.carpeta)}
              style={{
                width: '100%',
                padding: '14px',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                textAlign: 'left',
              }}
            >
              <span>
                {g.nombre}
                {marcados > 0 && (
                  <span
                    style={{
                      marginLeft: '8px',
                      background: '#0070ff',
                      borderRadius: '10px',
                      padding: '1px 7px',
                      fontSize: '11px',
                    }}
                  >
                    {marcados}
                  </span>
                )}
              </span>
              <span style={{ color: '#666', fontSize: '12px' }}>
                {Object.keys(g.ejercicios).length} {abierto ? '▲' : '▼'}
              </span>
            </button>

            {abierto && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
                  gap: '8px',
                  padding: '0 12px 14px',
                }}
              >
                {Object.entries(g.ejercicios).map(([slug, nombre]) => {
                  const activo = seleccion.includes(slug);
                  return (
                    <button
                      key={slug}
                      onClick={() => alternar(slug)}
                      style={{
                        background: activo
                          ? 'rgba(0,112,255,0.14)'
                          : 'rgba(255,255,255,0.03)',
                        border: activo
                          ? '1.5px solid #0070ff'
                          : '1px solid rgba(255,255,255,0.07)',
                        borderRadius: '10px',
                        padding: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <img
                        src={rutaImagen(g.carpeta, slug)}
                        alt={nombre}
                        loading="lazy"
                        style={{
                          width: '100%',
                          aspectRatio: '1',
                          objectFit: 'contain',
                          background: '#fff',
                          borderRadius: '6px',
                        }}
                      />
                      <span
                        style={{
                          color: activo ? '#8fc4ff' : '#bbb',
                          fontSize: '10px',
                          lineHeight: '1.2',
                          textAlign: 'center',
                        }}
                      >
                        {nombre}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {seleccion.length > 0 && (
        <div style={{ ...caja, borderColor: 'rgba(0,112,255,0.4)' }}>
          <div style={{ fontSize: '13px', color: '#8fc4ff', marginBottom: '8px' }}>
            {seleccion.length} ejercicio{seleccion.length > 1 ? 's' : ''} seleccionado
            {seleccion.length > 1 ? 's' : ''}
          </div>
          <div style={{ color: '#bbb', fontSize: '12px', marginBottom: '10px' }}>
            {seleccion.map(nombreDeSlug).join(', ')}
          </div>
          <input
            type="number"
            style={input}
            placeholder="Duración en minutos (opcional)"
            value={duracion}
            onChange={(e) => setDuracion(e.target.value)}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={guardar}
              style={{
                flex: 1,
                padding: '11px',
                background: '#0070ff',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              Guardar entrenamiento
            </button>
            <button
              onClick={() => setSeleccion([])}
              style={{
                padding: '11px 14px',
                background: 'rgba(255,255,255,0.06)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Limpiar
            </button>
          </div>
        </div>
      )}

      <div style={caja}>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '10px' }}>
          Historial ({registros.length})
        </div>
        {cargando && (
          <div style={{ color: '#666', fontSize: '13px' }}>Cargando...</div>
        )}
        {!cargando && registros.length === 0 && (
          <div style={{ color: '#666', fontSize: '13px' }}>
            Elegí los ejercicios de arriba para registrar tu primer entrenamiento.
          </div>
        )}
        {registros.map((r) => (
          <div
            key={r.id}
            style={{
              padding: '10px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '8px',
              marginBottom: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '8px',
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ color: '#0070ff', fontSize: '11px', fontWeight: '600' }}>
                {r.fecha}
                {r.duracion_min ? ' · ' + r.duracion_min + ' min' : ''}
              </div>
              <div style={{ color: '#fff', fontSize: '13px' }}>{r.detalle}</div>
            </div>
            <button
              onClick={() => borrar(r.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#666',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EjerciciosPage;
